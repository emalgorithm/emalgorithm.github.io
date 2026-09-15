#!/usr/bin/env python3
"""Generate the full CV's publication list from the website bibliography."""

from __future__ import annotations

import argparse
import re
import unicodedata
from pathlib import Path


SELF_NAME = "Emanuele Rossi"
PUBLICATION_GROUPS = (
    ("preprint", "Under Review"),
    ("journal", "Peer-reviewed journal articles"),
    ("conference", "Peer-reviewed conference proceedings"),
    ("workshop", "Peer-reviewed workshop proceedings"),
)


def latex_bibtex_text(value: str) -> str:
    for character in ("%", "&", "#", "_"):
        value = re.sub(rf"(?<!\\)\{character}", rf"\\{character}", value)
    return value


def balanced_value(text: str, start: int, opener: str, closer: str) -> tuple[str, int]:
    if opener == closer:
        index = start + 1
        value_start = index
        while index < len(text):
            if text[index] == "\\":
                index += 2
                continue
            if text[index] == closer:
                return text[value_start:index], index + 1
            index += 1
        raise ValueError("Unterminated BibTeX value")

    depth = 1
    index = start + 1
    value_start = index

    while index < len(text):
        character = text[index]
        if character == "\\":
            index += 2
            continue
        if character == opener:
            depth += 1
        elif character == closer:
            depth -= 1
            if depth == 0:
                return text[value_start:index], index + 1
        index += 1

    raise ValueError("Unterminated BibTeX value")


def parse_fields(content: str) -> dict[str, str]:
    fields: dict[str, str] = {}
    index = 0

    while index < len(content):
        while index < len(content) and (
            content[index].isspace() or content[index] == ","
        ):
            index += 1
        if index >= len(content):
            break

        name_match = re.match(r"[A-Za-z_][A-Za-z0-9_]*", content[index:])
        if not name_match:
            raise ValueError(f"Invalid BibTeX field near: {content[index:index + 40]!r}")
        name = name_match.group(0).lower()
        index += len(name_match.group(0))

        while index < len(content) and content[index].isspace():
            index += 1
        if index >= len(content) or content[index] != "=":
            raise ValueError(f"Missing '=' after BibTeX field {name}")
        index += 1
        while index < len(content) and content[index].isspace():
            index += 1

        if content[index] == "{":
            value, index = balanced_value(content, index, "{", "}")
        elif content[index] == '"':
            value, index = balanced_value(content, index, '"', '"')
        else:
            value_start = index
            while index < len(content) and content[index] != ",":
                index += 1
            value = content[value_start:index]

        fields[name] = re.sub(r"\s+", " ", value).strip()

    return fields


def load_bibliography(path: Path) -> list[dict[str, str]]:
    text = path.read_text(encoding="utf-8")
    entries: list[dict[str, str]] = []
    index = 0

    while True:
        match = re.search(r"@([A-Za-z]+)\s*\{", text[index:])
        if not match:
            break
        entry_type = match.group(1).lower()
        entry_start = index + match.end() - 1
        entry_body, index = balanced_value(text, entry_start, "{", "}")
        key, separator, fields_text = entry_body.partition(",")
        if not separator:
            raise ValueError(f"BibTeX entry {key.strip()} has no fields")

        entry = {
            "type": entry_type,
            "key": key.strip(),
            **parse_fields(fields_text),
            "_order": str(len(entries)),
        }
        required = [field for field in ("title", "author", "year") if not entry.get(field)]
        if required:
            raise ValueError(
                f"BibTeX entry {entry['key']} is missing: {', '.join(required)}"
            )
        entries.append(entry)

    if not entries:
        raise ValueError(f"No BibTeX entries found in {path}")

    return sorted(
        entries,
        key=lambda entry: (-int(entry["year"]), int(entry["_order"])),
    )


def split_name_parts(name: str) -> list[str]:
    parts: list[str] = []
    start = 0
    depth = 0
    for index, character in enumerate(name):
        if character == "{" and (index == 0 or name[index - 1] != "\\"):
            depth += 1
        elif character == "}" and (index == 0 or name[index - 1] != "\\"):
            depth -= 1
        elif character.isspace() and depth == 0:
            if name[start:index].strip():
                parts.append(name[start:index].strip())
            start = index + 1
    if name[start:].strip():
        parts.append(name[start:].strip())
    return parts


def initial(given_name: str) -> str:
    for character in given_name:
        if character.isalpha():
            return f"{character.upper()}."
    raise ValueError(f"Cannot derive an initial from author name: {given_name}")


def abbreviated_author(author: str) -> str:
    if author == SELF_NAME:
        return r"\textbf{E. Rossi}"

    if "," in author:
        family_name, given_names = [
            component.strip() for component in author.split(",", 1)
        ]
        given_parts = split_name_parts(given_names)
    else:
        parts = split_name_parts(author)
        if len(parts) < 2:
            raise ValueError(f"Cannot split author name: {author}")
        surname_start = len(parts) - 1
        if len(parts) >= 3 and parts[-2].lower() in {
            "da",
            "de",
            "del",
            "di",
            "dos",
            "van",
            "von",
        }:
            surname_start -= 1
        given_parts = parts[:surname_start]
        family_name = " ".join(parts[surname_start:])

    if family_name.startswith("{") and family_name.endswith("}"):
        family_name = family_name[1:-1]

    initials = " ".join(initial(part) for part in given_parts)
    return f"{initials} {latex_bibtex_text(family_name)}"


def full_authors(author_field: str) -> str:
    authors = [author.strip() for author in re.split(r"\s+and\s+", author_field)]
    if SELF_NAME not in authors:
        raise ValueError(f"{SELF_NAME} is missing from author list: {author_field}")

    rendered = [abbreviated_author(author) for author in authors]

    if len(rendered) == 1:
        return rendered[0]
    if len(rendered) == 2:
        return f"{rendered[0]} and {rendered[1]}"
    return ", ".join(rendered[:-1]) + f" and {rendered[-1]}"


def normalized_title(title: str) -> str:
    title = re.sub(r"\\[`'^\"~=cHkruvbtd]\s*\{?([A-Za-z])\}?", r"\1", title)
    title = unicodedata.normalize("NFKD", title)
    return "".join(character.lower() for character in title if character.isalnum())


def load_citations(path: Path) -> dict[str, int]:
    citations: dict[str, int] = {}
    current_count: int | None = None

    for line in path.read_text(encoding="utf-8").splitlines():
        count_match = re.match(r"\s+citations:\s*(\d+)\s*$", line)
        if count_match:
            current_count = int(count_match.group(1))
            continue

        title_match = re.match(r"\s+title:\s*(.+?)\s*$", line)
        if title_match and current_count is not None:
            title = title_match.group(1)
            if (
                len(title) >= 2
                and title[0] == title[-1]
                and title[0] in {'"', "'"}
            ):
                title = title[1:-1]
            citations[normalized_title(title)] = current_count
            current_count = None

    if not citations:
        raise ValueError(f"No citation counts found in {path}")
    return citations


def venue(entry: dict[str, str]) -> str:
    if entry["type"] in {"phdthesis", "mastersthesis", "thesis"}:
        return entry.get("school", "Thesis")
    return entry.get("journal") or entry.get("booktitle") or ""


def render(
    entries: list[dict[str, str]],
    citations: dict[str, int],
    bibliography_source: Path,
    citations_source: Path,
) -> str:
    lines = [
        "% Generated by generate_cv_publications.py.",
        f"% Bibliography source: {bibliography_source.as_posix()}",
        f"% Citation source: {citations_source.as_posix()}",
        r"\section{Full Publication List}",
        "",
    ]

    known_types = {group_type for group_type, _ in PUBLICATION_GROUPS}
    publication_entries = [
        entry for entry in entries if entry.get("pubtype") != "thesis"
    ]
    unknown_types = sorted(
        {entry.get("pubtype", "") for entry in publication_entries} - known_types
    )
    if unknown_types:
        raise ValueError(
            f"Unsupported publication types: {', '.join(unknown_types)}"
        )

    for group_type, heading in PUBLICATION_GROUPS:
        grouped_entries = [
            entry
            for entry in publication_entries
            if entry.get("pubtype") == group_type
        ]
        if not grouped_entries:
            continue

        lines.extend([rf"\subsection{{{heading}}}", ""])

        for index, entry in enumerate(grouped_entries):
            title = latex_bibtex_text(entry["title"])
            periodical = latex_bibtex_text(venue(entry))
            citation_count = citations.get(normalized_title(entry["title"]), 0)
            award = ""
            if entry.get("award"):
                award = rf" \textbf{{{latex_bibtex_text(entry['award'])}.}}"

            lines.extend(
                [
                    r"\begin{onecolentry}",
                    r"    \hangindent=0.32cm",
                    r"    \hangafter=1",
                    (
                        r"    \makebox[0.32cm][l]{\color{primaryColor}"
                        r"\raisebox{0.12ex}{\footnotesize$\circ$}}"
                        rf"{full_authors(entry['author'])}. "
                        rf"{entry['year']}. {title}. "
                        rf"\textit{{{periodical}}}.{award} "
                        rf"(\textbf{{{citation_count}}})."
                    ),
                    r"\end{onecolentry}",
                ]
            )
            if index != len(grouped_entries) - 1:
                lines.extend(["", r"\vspace{0.12 cm}", ""])
        lines.append("")

    return "\n".join(lines) + "\n"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("bibliography", type=Path)
    parser.add_argument("citations", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()

    entries = load_bibliography(args.bibliography)
    citation_counts = load_citations(args.citations)
    args.output.write_text(
        render(entries, citation_counts, args.bibliography, args.citations),
        encoding="utf-8",
    )
    print(
        f"Generated {len(entries)} publications from {args.bibliography} "
        f"with citation counts from {args.citations}."
    )


if __name__ == "__main__":
    main()
