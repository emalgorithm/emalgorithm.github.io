#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SELF_NAMES = new Set(["emanuele rossi"]);
const DAY_MS = 24 * 60 * 60 * 1000;

function readBracedValue(source, start) {
  let depth = 0;
  let escaped = false;

  for (let index = start; index < source.length; index += 1) {
    const character = source[index];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (character === "\\") {
      escaped = true;
      continue;
    }
    if (character === "{") depth += 1;
    if (character === "}") {
      depth -= 1;
      if (depth === 0) {
        return { value: source.slice(start + 1, index), end: index + 1 };
      }
    }
  }

  throw new Error("Unclosed braced BibTeX value");
}

function readQuotedValue(source, start) {
  let escaped = false;
  for (let index = start + 1; index < source.length; index += 1) {
    const character = source[index];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (character === "\\") {
      escaped = true;
      continue;
    }
    if (character === '"') {
      return { value: source.slice(start + 1, index), end: index + 1 };
    }
  }
  throw new Error("Unclosed quoted BibTeX value");
}

function parseFields(body) {
  const fields = {};
  let index = 0;

  while (index < body.length) {
    while (index < body.length && /[\s,]/.test(body[index])) index += 1;
    const nameStart = index;
    while (index < body.length && /[\w-]/.test(body[index])) index += 1;
    if (index === nameStart) {
      index += 1;
      continue;
    }

    const name = body.slice(nameStart, index).toLowerCase();
    while (index < body.length && /\s/.test(body[index])) index += 1;
    if (body[index] !== "=") continue;
    index += 1;
    while (index < body.length && /\s/.test(body[index])) index += 1;

    let parsed;
    if (body[index] === "{") parsed = readBracedValue(body, index);
    else if (body[index] === '"') parsed = readQuotedValue(body, index);
    else {
      const valueStart = index;
      while (index < body.length && body[index] !== "," && body[index] !== "\n") index += 1;
      parsed = { value: body.slice(valueStart, index).trim(), end: index };
    }

    fields[name] = parsed.value.trim().replace(/\s+/g, " ");
    index = parsed.end;
  }

  return fields;
}

function splitAuthors(authorField) {
  const authors = [];
  let depth = 0;
  let start = 0;

  for (let index = 0; index < authorField.length; index += 1) {
    const character = authorField[index];
    if (character === "{" && authorField[index - 1] !== "\\") depth += 1;
    if (character === "}" && authorField[index - 1] !== "\\") depth -= 1;
    if (depth === 0 && authorField.slice(index, index + 5) === " and ") {
      authors.push(authorField.slice(start, index).trim());
      start = index + 5;
      index += 4;
    }
  }
  authors.push(authorField.slice(start).trim());
  return authors.filter(Boolean);
}

export function parseBibtex(source) {
  const entries = [];
  let index = 0;

  while ((index = source.indexOf("@", index)) !== -1) {
    const header = source.slice(index).match(/^@(\w+)\s*\{\s*([^,]+),/);
    if (!header) {
      index += 1;
      continue;
    }

    const bodyStart = index + header[0].length;
    let depth = 1;
    let escaped = false;
    let end = bodyStart;
    for (; end < source.length; end += 1) {
      const character = source[end];
      if (escaped) {
        escaped = false;
        continue;
      }
      if (character === "\\") {
        escaped = true;
        continue;
      }
      if (character === "{") depth += 1;
      if (character === "}") {
        depth -= 1;
        if (depth === 0) break;
      }
    }

    const fields = parseFields(source.slice(bodyStart, end));
    entries.push({
      key: header[2].trim(),
      type: header[1].toLowerCase(),
      ...fields,
      authors: fields.author ? splitAuthors(fields.author) : [],
    });
    index = end + 1;
  }

  return entries;
}

function latexToText(value) {
  return value
    .replace(/\{\\v\{?([A-Za-z])\}?\}/g, "$1")
    .replace(/\{\\["'`^~=.Hckru]\{?([A-Za-z])\}?\}/g, "$1")
    .replace(/\\["'`^~=.Hckru]\{?([A-Za-z])\}?/g, "$1")
    .replace(/\{\\o\}/gi, "o")
    .replace(/\\o\b/gi, "o")
    .replace(/\\ss\b/g, "ss")
    .replace(/[{}]/g, "")
    .replace(/\\([A-Za-z]+)/g, "$1");
}

export function normalizeName(value) {
  return latexToText(value)
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function validCountryCode(code) {
  if (!/^[A-Z]{2}$/.test(code || "")) return false;
  const displayName = new Intl.DisplayNames(["en"], { type: "region" }).of(code);
  return Boolean(displayName && displayName !== code && displayName !== "Unknown Region");
}

export function auditCollaborations({ bibliography, data, now = new Date() }) {
  const errors = [];
  const warnings = [];
  const entries = parseBibtex(bibliography);
  const entryByKey = new Map(entries.map((entry) => [entry.key, entry]));
  const dataPapers = new Map((data.papers || []).map((paper) => [paper.key, paper]));
  const aliases = new Map();
  const authorOwners = new Map();
  const bibliographyAuthorPapers = new Map();

  for (const entry of entries) {
    for (const author of entry.authors) {
      const normalized = normalizeName(author);
      if (SELF_NAMES.has(normalized)) continue;
      if (!bibliographyAuthorPapers.has(normalized)) bibliographyAuthorPapers.set(normalized, new Set());
      bibliographyAuthorPapers.get(normalized).add(entry.key);
    }
  }

  for (const collaborator of data.collaborators || []) {
    if (!collaborator.id || !collaborator.name) {
      errors.push("Every collaborator needs an id and display name.");
      continue;
    }

    for (const alias of [collaborator.name, ...(collaborator.aliases || [])]) {
      const normalized = normalizeName(alias);
      const existing = aliases.get(normalized);
      if (existing && existing !== collaborator.id) {
        errors.push(`Alias collision for "${alias}" between ${existing} and ${collaborator.id}.`);
      }
      aliases.set(normalized, collaborator.id);
    }

    if (collaborator.country) {
      if (!validCountryCode(collaborator.country.code)) {
        errors.push(`${collaborator.name} has invalid country code "${collaborator.country.code}".`);
      }
      if (!collaborator.institution) errors.push(`${collaborator.name} is missing an institution.`);
      if (!collaborator.affiliation_source) errors.push(`${collaborator.name} is missing affiliation provenance.`);
    } else if (!collaborator.unmapped_reason) {
      errors.push(`${collaborator.name} must have a country or an unmapped_reason.`);
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(collaborator.verified_on || "")) {
      errors.push(`${collaborator.name} has an invalid verification date.`);
    } else {
      const ageDays = Math.floor((now - new Date(`${collaborator.verified_on}T00:00:00Z`)) / DAY_MS);
      if (ageDays > 365) warnings.push(`${collaborator.name}'s affiliation is ${ageDays} days old.`);
    }

    if (!Array.isArray(collaborator.papers) || collaborator.papers.length < 2) {
      errors.push(`${collaborator.name} must link at least two papers to belong to the core network.`);
    }

    for (const paperKey of collaborator.papers || []) {
      if (!entryByKey.has(paperKey)) errors.push(`${collaborator.name} references unknown paper ${paperKey}.`);
      const ownerKey = `${collaborator.id}:${paperKey}`;
      if (authorOwners.has(ownerKey)) errors.push(`${collaborator.name} repeats paper ${paperKey}.`);
      authorOwners.set(ownerKey, true);
    }
  }

  for (const entry of entries) {
    for (const author of entry.authors) {
      const normalized = normalizeName(author);
      if (SELF_NAMES.has(normalized)) continue;
      const owner = aliases.get(normalized);
      if (!owner) {
        if ((bibliographyAuthorPapers.get(normalized)?.size || 0) >= 2) {
          errors.push(`Recurring bibliography author "${author}" is missing from the core collaboration data.`);
        }
        continue;
      }
      const collaborator = data.collaborators.find((item) => item.id === owner);
      if (!collaborator.papers.includes(entry.key)) {
        errors.push(`${collaborator.name} is not linked back to ${entry.key}.`);
      }
    }
  }

  for (const paper of data.papers || []) {
    const entry = entryByKey.get(paper.key);
    if (!entry) {
      errors.push(`Collaboration data includes unknown paper ${paper.key}.`);
      continue;
    }
    if (normalizeName(paper.title) !== normalizeName(entry.title || "")) {
      errors.push(`Title mismatch for paper ${paper.key}.`);
    }
    if (String(paper.year) !== String(entry.year)) errors.push(`Year mismatch for paper ${paper.key}.`);
  }

  for (const collaborator of data.collaborators || []) {
    for (const paperKey of collaborator.papers || []) {
      const entry = entryByKey.get(paperKey);
      if (!entry) continue;
      const normalizedAuthors = new Set(entry.authors.map(normalizeName));
      const collaboratorNames = [collaborator.name, ...(collaborator.aliases || [])].map(normalizeName);
      if (!collaboratorNames.some((name) => normalizedAuthors.has(name))) {
        errors.push(`${collaborator.name} is linked to ${paperKey} but is not an author.`);
      }
    }
  }

  return { errors: [...new Set(errors)], warnings: [...new Set(warnings)], entries };
}

function isMainModule() {
  return process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
}

if (isMainModule()) {
  const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const bibliography = fs.readFileSync(path.join(repositoryRoot, "_bibliography/papers.bib"), "utf8");
  const data = JSON.parse(fs.readFileSync(path.join(repositoryRoot, "_data/collaborations.json"), "utf8"));
  const result = auditCollaborations({ bibliography, data });

  for (const warning of result.warnings) console.warn(`warning: ${warning}`);
  for (const error of result.errors) console.error(`error: ${error}`);

  const mapped = data.collaborators.filter((collaborator) => collaborator.country).length;
  console.log(
    `Collaboration audit: ${result.entries.length} papers, ${data.collaborators.length} collaborators, ${mapped} mapped, ${result.warnings.length} warnings, ${result.errors.length} errors.`
  );
  if (result.errors.length > 0) process.exitCode = 1;
}
