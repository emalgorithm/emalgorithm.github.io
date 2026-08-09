(() => {
  "use strict";

  const root = document.querySelector(".collaborations-page");
  const dataNode = document.getElementById("collaborations-data");
  if (!root || !dataNode) return;

  const mapNode = document.getElementById("collaboration-map");
  const selectNode = document.getElementById("collaboration-country-select");
  const detailNode = document.getElementById("collaboration-detail");
  const rankingNode = document.getElementById("collaboration-ranking");
  const collaboratorRankingNode = document.getElementById("collaboration-collaborator-ranking");
  const tooltipNode = document.getElementById("collaboration-tooltip");
  const publicationsUrl = root.dataset.publicationsUrl;
  const numberFormat = new Intl.NumberFormat("en");
  let selectedCode = null;
  let paths;
  let colorScale;

  const escapeHtml = (value) =>
    String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");

  const plural = (count, singular, pluralForm = `${singular}s`) => `${numberFormat.format(count)} ${count === 1 ? singular : pluralForm}`;

  function aggregate(data) {
    const papers = new Map(data.papers.map((paper) => [paper.key, paper]));
    const countries = new Map();
    const representedPapers = new Set();
    let instances = 0;
    let mapped = 0;

    data.collaborators.forEach((collaborator) => {
      collaborator.papers.forEach((key) => representedPapers.add(key));
      instances += collaborator.papers.length;
      if (!collaborator.country) return;
      mapped += 1;
      const { code, name } = collaborator.country;
      if (!countries.has(code)) {
        countries.set(code, { code, name, score: 0, collaborators: [], paperKeys: new Set() });
      }
      const country = countries.get(code);
      country.score += collaborator.papers.length;
      country.collaborators.push(collaborator);
      collaborator.papers.forEach((key) => country.paperKeys.add(key));
    });

    const ranked = [...countries.values()]
      .map((country) => ({ ...country, papers: [...country.paperKeys].map((key) => papers.get(key)).filter(Boolean) }))
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));

    return { countries: new Map(ranked.map((country) => [country.code, country])), ranked, papers, representedPapers, instances, mapped };
  }

  function countryCode(feature) {
    return feature.properties.iso_a2;
  }

  function configureHeatScale(maximum) {
    const darkTheme = document.documentElement.dataset.theme === "dark";
    const start = darkTheme ? 0.18 : 0.28;
    const span = darkTheme ? 0.56 : 0.68;
    const interpolateHeat = (value) => d3.interpolateBlues(start + value * span);
    colorScale = d3.scaleSequentialSqrt(interpolateHeat).domain([1, Math.max(1, maximum)]);
    const ramp = document.getElementById("collaboration-legend-ramp");
    const stops = d3.range(0, 1.01, 0.2).map((value) => `${interpolateHeat(value)} ${value * 100}%`);
    ramp.style.background = `linear-gradient(90deg, ${stops.join(", ")})`;
  }

  function setTooltip(country, eventTarget, pointerEvent) {
    if (!country) return;
    const names = country.collaborators
      .slice()
      .sort((a, b) => b.papers.length - a.papers.length || a.name.localeCompare(b.name))
      .slice(0, 3)
      .map((person) => escapeHtml(person.name));
    tooltipNode.innerHTML = `
      <strong>${escapeHtml(country.name)}</strong>
      <span>${plural(country.score, "collaboration instance")}</span>
      <span>${plural(country.collaborators.length, "collaborator")} · ${plural(country.papers.length, "paper")}</span>
      <small>${names.join(" · ")}${country.collaborators.length > 3 ? " · …" : ""}</small>`;
    tooltipNode.hidden = false;

    if (pointerEvent) {
      tooltipNode.style.left = `${Math.min(pointerEvent.clientX + 14, window.innerWidth - 300)}px`;
      tooltipNode.style.top = `${Math.max(12, pointerEvent.clientY - 20)}px`;
    } else {
      const rect = eventTarget.getBoundingClientRect();
      tooltipNode.style.left = `${Math.min(rect.left + rect.width / 2 + 12, window.innerWidth - 300)}px`;
      tooltipNode.style.top = `${Math.max(12, rect.top - 12)}px`;
    }
  }

  function hideTooltip() {
    tooltipNode.hidden = true;
  }

  function renderDetail(country, aggregates) {
    selectedCode = country.code;
    selectNode.value = country.code;
    paths?.classed("is-selected", (feature) => countryCode(feature) === country.code);

    const collaborators = country.collaborators.slice().sort((a, b) => b.papers.length - a.papers.length || a.name.localeCompare(b.name));
    const papers = country.papers.slice().sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));

    const peopleMarkup = collaborators
      .map((person) => {
        const name = person.profile_url ? `<a href="${escapeHtml(person.profile_url)}">${escapeHtml(person.name)}</a>` : escapeHtml(person.name);
        const institution = person.affiliation_source
          ? `<a class="collaboration-source-link" href="${escapeHtml(person.affiliation_source)}" aria-label="Affiliation source for ${escapeHtml(person.name)}">${escapeHtml(person.institution)}</a>`
          : escapeHtml(person.institution);
        return `<li><div><strong>${name}</strong><span>${institution}</span></div><b>${person.papers.length}</b></li>`;
      })
      .join("");

    const papersMarkup = papers
      .map(
        (paper) =>
          `<li><a href="${escapeHtml(publicationsUrl)}#${encodeURIComponent(paper.key)}">${escapeHtml(paper.title)}</a><span>${escapeHtml(paper.year)}</span></li>`
      )
      .join("");

    detailNode.innerHTML = `
      <p class="collaborations-kicker">Country detail</p>
      <div class="collaboration-detail-title">
        <h3>${escapeHtml(country.name)}</h3>
        <strong>${numberFormat.format(country.score)}</strong>
      </div>
      <p class="collaboration-detail-summary">${plural(country.collaborators.length, "collaborator")} across ${plural(country.papers.length, "joint paper")}.</p>
      <h4>People <span>joint papers</span></h4>
      <ul class="collaboration-people-list">${peopleMarkup}</ul>
      <h4>Publications</h4>
      <ul class="collaboration-paper-list">${papersMarkup}</ul>`;

    const rankingButton = rankingNode.querySelector(`[data-country="${CSS.escape(country.code)}"]`);
    rankingNode.querySelectorAll("button").forEach((button) => button.classList.toggle("is-active", button === rankingButton));
  }

  function renderSummary(data, aggregates) {
    document.getElementById("collab-stat-countries").textContent = numberFormat.format(aggregates.countries.size);
    document.getElementById("collab-stat-people").textContent = numberFormat.format(data.collaborators.length);
    document.getElementById("collab-stat-papers").textContent = numberFormat.format(aggregates.representedPapers.size);
    document.getElementById("collab-stat-instances").textContent = numberFormat.format(aggregates.instances);
    document.getElementById("collaboration-coverage-note").textContent =
      `Coverage: ${aggregates.mapped} of ${data.collaborators.length} core collaborators have a verified country.`;
  }

  function renderControls(data, aggregates) {
    aggregates.ranked
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((country) => selectNode.add(new Option(`${country.name} — ${plural(country.collaborators.length, "collaborator")}`, country.code)));

    selectNode.addEventListener("change", () => {
      const country = aggregates.countries.get(selectNode.value);
      if (country) renderDetail(country, aggregates);
    });

    const largest = aggregates.ranked[0]?.score || 1;
    rankingNode.innerHTML = aggregates.ranked
      .slice(0, 6)
      .map(
        (country, index) => `
          <li>
            <button type="button" data-country="${country.code}">
              <span class="collaboration-rank-number">${String(index + 1).padStart(2, "0")}</span>
              <span class="collaboration-rank-country">${escapeHtml(country.name)}<i style="--rank-width: ${(country.score / largest) * 100}%"></i></span>
              <strong>${country.score}</strong>
            </button>
          </li>`
      )
      .join("");

    rankingNode.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-country]");
      if (!button) return;
      renderDetail(aggregates.countries.get(button.dataset.country), aggregates);
      detailNode.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    const rankedCollaborators = data.collaborators
      .slice()
      .sort((a, b) => b.papers.length - a.papers.length || a.name.localeCompare(b.name))
      .slice(0, 6);
    const mostJointPapers = rankedCollaborators[0]?.papers.length || 1;
    collaboratorRankingNode.innerHTML = rankedCollaborators
      .map(
        (collaborator, index) => `
          <li>
            <button type="button" data-collaborator-country="${escapeHtml(collaborator.country?.code || "")}" aria-label="${escapeHtml(collaborator.name)}, ${plural(collaborator.papers.length, "joint paper")}. Open ${escapeHtml(collaborator.country?.name || "country")} details.">
              <span class="collaboration-rank-number">${String(index + 1).padStart(2, "0")}</span>
              <span class="collaboration-rank-country">${escapeHtml(collaborator.name)}<small>${escapeHtml(collaborator.country?.name || "Unmapped")}</small><i style="--rank-width: ${(collaborator.papers.length / mostJointPapers) * 100}%"></i></span>
              <strong>${collaborator.papers.length}</strong>
            </button>
          </li>`
      )
      .join("");

    collaboratorRankingNode.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-collaborator-country]");
      const country = aggregates.countries.get(button?.dataset.collaboratorCountry);
      if (!country) return;
      renderDetail(country, aggregates);
      detailNode.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  function renderMap(geojson, aggregates) {
    mapNode.replaceChildren();
    const width = 960;
    const height = 520;
    const svg = d3
      .select(mapNode)
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("role", "img")
      .attr("aria-labelledby", "collaboration-map-title collaboration-map-description");
    svg.append("title").attr("id", "collaboration-map-title").text("World map of recurring research collaborations");
    svg
      .append("desc")
      .attr("id", "collaboration-map-description")
      .text("Countries are shaded by their number of recurring collaborators. Shaded countries can be selected for details.");

    const projection = d3.geoNaturalEarth1().fitExtent(
      [
        [18, 14],
        [width - 18, height - 14],
      ],
      geojson
    );
    const path = d3.geoPath(projection);
    const maximumCollaborators = d3.max(aggregates.ranked, (country) => country.collaborators.length) || 1;
    configureHeatScale(maximumCollaborators);

    svg.append("path").datum({ type: "Sphere" }).attr("class", "collaboration-sphere").attr("d", path);
    paths = svg
      .append("g")
      .attr("class", "collaboration-countries")
      .selectAll("path")
      .data(geojson.features)
      .join("path")
      .attr("d", path)
      .attr("data-country", countryCode)
      .classed("has-collaborations", (feature) => aggregates.countries.has(countryCode(feature)))
      .attr("fill", (feature) => {
        const country = aggregates.countries.get(countryCode(feature));
        return country ? colorScale(country.collaborators.length) : null;
      })
      .attr("tabindex", (feature) => (aggregates.countries.has(countryCode(feature)) ? 0 : null))
      .attr("role", (feature) => (aggregates.countries.has(countryCode(feature)) ? "button" : null))
      .attr("aria-label", (feature) => {
        const country = aggregates.countries.get(countryCode(feature));
        return country
          ? `${country.name}: ${plural(country.collaborators.length, "core collaborator")}. Press Enter for details.`
          : `${feature.properties.name}: no recurring collaborations in this view.`;
      });

    paths
      .filter((feature) => aggregates.countries.has(countryCode(feature)))
      .on("pointerenter pointermove", function (event, feature) {
        setTooltip(aggregates.countries.get(countryCode(feature)), this, event);
      })
      .on("pointerleave", hideTooltip)
      .on("focus", function (_event, feature) {
        setTooltip(aggregates.countries.get(countryCode(feature)), this);
      })
      .on("blur", hideTooltip)
      .on("click", (_event, feature) => renderDetail(aggregates.countries.get(countryCode(feature)), aggregates))
      .on("keydown", (event, feature) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        renderDetail(aggregates.countries.get(countryCode(feature)), aggregates);
      });

    document.getElementById("collaboration-legend-midpoint").textContent = Math.round((maximumCollaborators + 1) / 2);
    document.getElementById("collaboration-legend-range").textContent = maximumCollaborators;

    const observer = new MutationObserver(() => {
      configureHeatScale(maximumCollaborators);
      paths
        .transition()
        .duration(220)
        .attr("fill", (feature) => {
          const country = aggregates.countries.get(countryCode(feature));
          return country ? colorScale(country.collaborators.length) : null;
        });
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  }

  async function initialize() {
    try {
      if (!window.d3) throw new Error("The visualization library did not load.");
      const data = JSON.parse(dataNode.textContent);
      const aggregates = aggregate(data);
      renderSummary(data, aggregates);
      renderControls(data, aggregates);
      const response = await fetch(root.dataset.mapUrl);
      if (!response.ok) throw new Error(`Map request failed (${response.status}).`);
      renderMap(await response.json(), aggregates);
    } catch (error) {
      mapNode.innerHTML = `<p class="collaboration-map-error" role="alert">The map could not be loaded. ${escapeHtml(error.message)}</p>`;
    }
  }

  initialize();
})();
