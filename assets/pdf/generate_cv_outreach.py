#!/usr/bin/env python3
"""Generate full-CV outreach sections from the website data."""

from __future__ import annotations

import argparse
import json
import re
from datetime import date
from pathlib import Path


ENTRY_RE = re.compile(r"^  - ([a-z_]+):\s*(.*)$")
FIELD_RE = re.compile(r"^    ([a-z_]+):\s*(.*)$")
NESTED_ENTRY_RE = re.compile(r"^      - ([a-z_]+):\s*(.*)$")
NESTED_FIELD_RE = re.compile(r"^        ([a-z_]+):\s*(.*)$")
TOP_LEVEL_RE = re.compile(r"^[a-z_]+:\s*$")
TALK_FIELDS = ("date", "title", "venue")
WORKSHOP_FIELDS = ("date", "title", "venue", "role")
GRANT_FIELDS = ("date", "title", "institution")
AWARD_FIELDS = ("date", "title", "institution", "description")
MENTOR_FIELDS = ("start_date", "name", "position")
WEBSITE_URL = "https://emanuelerossi.co.uk"


def parse_scalar(value: str) -> str:
    value = value.strip()
    if value.startswith('"') and value.endswith('"'):
        return json.loads(value)
    if value.startswith("'") and value.endswith("'"):
        return value[1:-1].replace("''", "'")
    return value


def load_section(
    path: Path, section: str, required_fields: tuple[str, ...]
) -> list[dict[str, str]]:
    items: list[dict[str, str]] = []
    current: dict[str, str] | None = None
    in_section = False

    for raw_line in path.read_text(encoding="utf-8").splitlines():
        if raw_line == f"{section}:":
            in_section = True
            continue
        if not in_section:
            continue
        if TOP_LEVEL_RE.match(raw_line):
            break

        match = ENTRY_RE.match(raw_line)
        if match:
            if current is not None:
                items.append(current)
            current = {match.group(1): parse_scalar(match.group(2))}
            continue

        match = FIELD_RE.match(raw_line)
        if match and current is not None:
            current[match.group(1)] = parse_scalar(match.group(2))

    if current is not None:
        items.append(current)

    if not items:
        raise ValueError(f"No {section} found in {path}")

    for index, item in enumerate(items, start=1):
        missing = [field for field in required_fields if not item.get(field)]
        if missing:
            raise ValueError(
                f"{section} item {index} is missing: {', '.join(missing)}"
            )
        item["_parsed_date"] = date.fromisoformat(item["date"])

    return sorted(items, key=lambda item: item["_parsed_date"], reverse=True)


def load_mentoring(path: Path) -> list[dict]:
    items: list[dict] = []
    current: dict | None = None
    current_publication: dict[str, str] | None = None
    in_section = False

    for raw_line in path.read_text(encoding="utf-8").splitlines():
        if raw_line == "mentoring:":
            in_section = True
            continue
        if not in_section:
            continue
        if TOP_LEVEL_RE.match(raw_line):
            break

        match = ENTRY_RE.match(raw_line)
        if match:
            if current is not None:
                items.append(current)
            current = {
                match.group(1): parse_scalar(match.group(2)),
                "publications": [],
            }
            current_publication = None
            continue

        match = NESTED_ENTRY_RE.match(raw_line)
        if match and current is not None:
            current_publication = {
                match.group(1): parse_scalar(match.group(2))
            }
            current["publications"].append(current_publication)
            continue

        match = NESTED_FIELD_RE.match(raw_line)
        if match and current_publication is not None:
            current_publication[match.group(1)] = parse_scalar(match.group(2))
            continue

        match = FIELD_RE.match(raw_line)
        if match and current is not None and match.group(1) != "publications":
            current[match.group(1)] = parse_scalar(match.group(2))

    if current is not None:
        items.append(current)

    if not items:
        raise ValueError(f"No mentoring entries found in {path}")

    for index, item in enumerate(items, start=1):
        missing = [field for field in MENTOR_FIELDS if not item.get(field)]
        if missing:
            raise ValueError(
                f"mentoring item {index} is missing: {', '.join(missing)}"
            )
        item["_parsed_start_date"] = date.fromisoformat(item["start_date"])
        if item.get("end_date"):
            item["_parsed_end_date"] = date.fromisoformat(item["end_date"])

    return sorted(
        items, key=lambda item: item["_parsed_start_date"], reverse=True
    )


def latex_escape(value: str) -> str:
    replacements = {
        "\\": r"\textbackslash{}",
        "&": r"\&",
        "%": r"\%",
        "$": r"\$",
        "#": r"\#",
        "_": r"\_",
        "{": r"\{",
        "}": r"\}",
        "~": r"\textasciitilde{}",
        "^": r"\textasciicircum{}",
        "£": r"\pounds{}",
        "€": r"\texteuro{}",
        "≈": r"\(\approx\)",
    }
    return "".join(replacements.get(character, character) for character in value)


def absolute_url(value: str) -> str:
    if value.startswith("/"):
        return f"{WEBSITE_URL}{value}"
    return value


def latex_url(value: str) -> str:
    return latex_escape(absolute_url(value))


def linked_text(text: str, url: str | None) -> str:
    escaped_text = latex_escape(text)
    if not url:
        return escaped_text
    return rf"\hrefWithoutArrow{{{latex_url(url)}}}{{\color{{primaryColor}}{escaped_text}}}"


def linked_venue(talk: dict[str, str]) -> str:
    return linked_text(talk["venue"], talk.get("venue_url"))


def resource_links(talk: dict[str, str]) -> str:
    resources = (
        ("slides_html_url", "Slides (HTML)"),
        ("slides_pdf_url", "Slides (PDF)"),
        ("video_url", "Video"),
    )
    links = [
        rf"\hrefWithoutArrow{{{latex_url(talk[field])}}}{{\color{{primaryColor}}[{label}]}}"
        for field, label in resources
        if talk.get(field)
    ]
    if not links:
        return ""
    return r"\enspace " + r"\enspace ".join(links)


def display_date(item: dict[str, str]) -> str:
    if item.get("years"):
        return latex_escape(item["years"])
    return item["_parsed_date"].strftime("%d/%m/%Y")


def mentoring_date_range(item: dict) -> str:
    start = item["_parsed_start_date"].strftime("%m/%Y")
    end = (
        item["_parsed_end_date"].strftime("%m/%Y")
        if item.get("_parsed_end_date")
        else "Present"
    )
    return f"{start} -- {end}"


def render_mentoring(items: list[dict]) -> list[str]:
    lines = [r"\section{Supervision and Mentoring}", ""]

    for index, item in enumerate(items):
        details = (
            rf"\textbf{{{linked_text(item['name'], item.get('url'))}}}"
            rf" -- {latex_escape(item['position'])}"
        )
        for publication in item["publications"]:
            publication_text = linked_text(
                publication["title"], publication.get("url")
            )
            if publication.get("wip") == "true":
                publication_text += " (Work in Progress)"
            if publication.get("under_review") == "true":
                publication_text += " (Under Review)"
            details += (
                rf"\\[-0.02 cm]{{\small\emergencystretch=1em {publication_text}}}"
            )

        lines.extend(
            [
                r"\needspace{4\baselineskip}",
                r"\begin{daterangeentry}{",
                rf"\mbox{{\small\textit{{{mentoring_date_range(item)}}}}}}}",
                r"    \begin{itemize}[leftmargin=10pt, nosep]",
                rf"        \item {details}",
                r"    \end{itemize}",
                r"\end{daterangeentry}",
            ]
        )
        if index != len(items) - 1:
            lines.extend(["", r"\vspace{0.06 cm}", ""])

    return lines


def render_talks(talks: list[dict[str, str]]) -> list[str]:
    lines = [r"\section{Invited Talks}", ""]

    for index, talk in enumerate(talks):
        lines.extend(
            [
                r"\needspace{4\baselineskip}",
                r"\begin{shortdateentry}{",
                rf"\textit{{{display_date(talk)}}}}}",
                r"    \begin{itemize}[leftmargin=10pt, nosep]",
                rf"        \item \textit{{{latex_escape(talk['title'])}}}\\[-0.02 cm]",
                rf"        {{\small {linked_venue(talk)}{resource_links(talk)}}}",
                r"    \end{itemize}",
                r"\end{shortdateentry}",
            ]
        )
        if index != len(talks) - 1:
            lines.extend(["", r"\vspace{0.04 cm}", ""])

    return lines


def render_workshops(workshops: list[dict[str, str]]) -> list[str]:
    lines = [r"\section{Academic Service}", ""]

    for index, workshop in enumerate(workshops):
        details = (
            rf"{{\small \textbf{{{linked_text(workshop['title'], workshop.get('url'))}}}"
            rf" -- {latex_escape(workshop['venue'])}"
            rf"\\[-0.02 cm]\textit{{{latex_escape(workshop['role'])}}}}}"
        )
        lines.extend(
            [
                r"\needspace{4\baselineskip}",
                r"\begin{shortdateentry}{",
                rf"\textit{{{workshop['_parsed_date'].strftime('%m/%Y')}}}}}",
                r"    \begin{itemize}[leftmargin=10pt, nosep]",
                rf"        \item {details}",
                r"    \end{itemize}",
                r"\end{shortdateentry}",
            ]
        )
        if index != len(workshops) - 1:
            lines.extend(["", r"\vspace{0.04 cm}", ""])

    return lines


def render_grants(grants: list[dict[str, str]]) -> list[str]:
    lines = [r"\section{Research Grants \& Fellowships}", ""]

    for index, grant in enumerate(grants):
        right_column = rf"\textit{{{display_date(grant)}}}"
        if grant.get("value"):
            value = latex_escape(grant["value"])
            if grant.get("value_qualifier"):
                qualifier = latex_escape(grant["value_qualifier"])
                right_column += (
                    rf"\\[0.02 cm]\mbox{{\small\textbf{{{value}}} {qualifier}}}"
                )
            else:
                right_column += rf"\\[0.02 cm]\textbf{{{value}}}"
        if grant.get("duration"):
            right_column += (
                rf"\\[-0.02 cm]{{\small {latex_escape(grant['duration'])}}}"
            )

        details = (
            rf"\textbf{{{latex_escape(grant['title'])}}}"
            rf" -- {latex_escape(grant['institution'])}"
        )
        if grant.get("project"):
            details += (
                rf"\\[-0.02 cm]{{\small \textit{{{latex_escape(grant['project'])}}}}}"
            )
        if grant.get("description"):
            details += (
                rf"\\[-0.02 cm]{{\small {latex_escape(grant['description'])}}}"
            )

        lines.extend(
            [
                r"\needspace{4\baselineskip}",
                rf"\begin{{grantentry}}{{{right_column}}}",
                r"    \begin{itemize}[leftmargin=10pt, nosep]",
                rf"        \item {details}",
                r"    \end{itemize}",
                r"\end{grantentry}",
            ]
        )
        if index != len(grants) - 1:
            lines.extend(["", r"\vspace{0.06 cm}", ""])

    return lines


def render_awards(awards: list[dict[str, str]]) -> list[str]:
    lines = [r"\section{Awards}", ""]

    for index, award in enumerate(awards):
        details = (
            rf"\textbf{{{latex_escape(award['title'])}}}"
            rf" -- {latex_escape(award['institution'])}"
            rf"\\[-0.02 cm]{{\small {latex_escape(award['description'])}}}"
        )
        lines.extend(
            [
                r"\needspace{4\baselineskip}",
                r"\begin{shortdateentry}{",
                rf"\textit{{{display_date(award)}}}}}",
                r"    \begin{itemize}[leftmargin=10pt, nosep]",
                rf"        \item {details}",
                r"    \end{itemize}",
                r"\end{shortdateentry}",
            ]
        )
        if index != len(awards) - 1:
            lines.extend(["", r"\vspace{0.06 cm}", ""])

    return lines


def render(
    talks: list[dict[str, str]],
    workshops: list[dict[str, str]],
    grants: list[dict[str, str]],
    awards: list[dict[str, str]],
    mentoring: list[dict],
    source: Path,
) -> str:
    lines = [
        "% Generated by generate_cv_outreach.py.",
        f"% Source: {source.as_posix()}",
    ]
    lines.extend(render_mentoring(mentoring))
    lines.extend([""])
    lines.extend(render_grants(grants))
    lines.extend([""])
    lines.extend(render_awards(awards))
    lines.append("")
    lines.extend(render_talks(talks))
    lines.extend([""])
    lines.extend(render_workshops(workshops))
    return "\n".join(lines) + "\n"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()

    talks = load_section(args.source, "talks", TALK_FIELDS)
    workshops = load_section(args.source, "workshops", WORKSHOP_FIELDS)
    grants = load_section(args.source, "research_grants", GRANT_FIELDS)
    awards = load_section(args.source, "awards", AWARD_FIELDS)
    mentoring = load_mentoring(args.source)
    args.output.write_text(
        render(talks, workshops, grants, awards, mentoring, args.source),
        encoding="utf-8",
    )
    print(
        f"Generated {len(talks)} talks, {len(workshops)} workshops, "
        f"{len(grants)} grants, "
        f"{len(awards)} awards, and {len(mentoring)} mentoring entries "
        f"from {args.source}."
    )


if __name__ == "__main__":
    main()
