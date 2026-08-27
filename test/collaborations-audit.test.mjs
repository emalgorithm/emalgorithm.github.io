import test from "node:test";
import assert from "node:assert/strict";

import { auditCollaborations, normalizeName, parseBibtex } from "../scripts/collaborations-audit.mjs";

const bibliography = `
@article{paper_one,
  title = {A Multiline Collaboration},
  author = {
    Shenyang Huang and Ga{\\v{s}}per Begu{\\v{s}} and Michael M. Bronstein and Emanuele Rossi},
  year = {2026}
}

@article{paper_two,
  title = {Alias-aware Research},
  author = {Shenyang Huang and Ga{\\v{s}}per Begu{\\v{s}} and Michael M. Bronstein and Emanuele Rossi},
  year = {2025}
}
`;

const data = {
  papers: [
    { key: "paper_one", title: "A Multiline Collaboration", year: 2026 },
    { key: "paper_two", title: "Alias-aware Research", year: 2025 },
  ],
  collaborators: [
    {
      id: "shenyang-huang",
      name: "Shenyang Huang",
      aliases: [],
      country: { code: "CA", name: "Canada" },
      institution: "Example University",
      affiliation_source: "https://example.edu/huang",
      verified_on: "2026-08-07",
      papers: ["paper_one", "paper_two"],
    },
    {
      id: "gasper-begus",
      name: "Gašper Beguš",
      aliases: ["Ga{\\v{s}}per Begu{\\v{s}}"],
      country: { code: "US", name: "United States" },
      institution: "Example Institute",
      affiliation_source: "https://example.edu/begus",
      verified_on: "2026-08-07",
      papers: ["paper_one", "paper_two"],
    },
    {
      id: "michael-bronstein",
      name: "Michael Bronstein",
      aliases: ["Michael M. Bronstein"],
      country: { code: "GB", name: "United Kingdom" },
      institution: "Example Lab",
      affiliation_source: "https://example.edu/bronstein",
      verified_on: "2026-08-07",
      papers: ["paper_one", "paper_two"],
    },
  ],
};

test("parses multiline authors and nested LaTeX braces", () => {
  const entries = parseBibtex(bibliography);
  assert.equal(entries.length, 2);
  assert.deepEqual(entries[0].authors, ["Shenyang Huang", "Ga{\\v{s}}per Begu{\\v{s}}", "Michael M. Bronstein", "Emanuele Rossi"]);
});

test("normalizes whitespace, accents, LaTeX, and aliases", () => {
  assert.equal(normalizeName("  Ga{\\v{s}}per   Begu{\\v{s}}  "), "gasper begus");
  assert.equal(normalizeName("Gašper Beguš"), "gasper begus");
});

test("accepts complete collaboration data and excludes self", () => {
  const result = auditCollaborations({ bibliography, data, now: new Date("2026-08-07T00:00:00Z") });
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.warnings, []);
});

test("detects stale records, alias collisions, and missing recurring authors", () => {
  const broken = structuredClone(data);
  broken.collaborators[0].verified_on = "2024-01-01";
  broken.collaborators[1].aliases.push("Shenyang Huang");
  broken.collaborators = broken.collaborators.filter((item) => item.id !== "michael-bronstein");
  const result = auditCollaborations({ bibliography, data: broken, now: new Date("2026-08-07T00:00:00Z") });

  assert.ok(result.warnings.some((warning) => warning.includes("affiliation is")));
  assert.ok(result.errors.some((error) => error.includes("Alias collision")));
  assert.ok(result.errors.some((error) => error.includes("Michael M. Bronstein")));
});

test("ignores one-off coauthors in the core-only prototype", () => {
  const oneOffBibliography = bibliography.replace("Michael M. Bronstein and Emanuele Rossi", "One Off Author and Emanuele Rossi");
  const withoutMichael = structuredClone(data);
  withoutMichael.collaborators = withoutMichael.collaborators.filter((item) => item.id !== "michael-bronstein");
  const result = auditCollaborations({
    bibliography: oneOffBibliography,
    data: withoutMichael,
    now: new Date("2026-08-07T00:00:00Z"),
  });

  assert.ok(!result.errors.some((error) => error.includes("One Off Author")));
});
