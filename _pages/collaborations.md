---
layout: default
permalink: /collaborations/
title: Collaborations
description: Explore my recurring research collaborations around the world.
nav: true
nav_order: 3
---

<div
  class="collaborations-page"
  data-map-url="{{ '/assets/json/natural-earth-countries-110m.geojson' | relative_url }}"
  data-publications-url="{{ '/publications/' | relative_url }}"
>
  <div class="collaborations-layout">
    <section class="collaboration-map-card" aria-labelledby="collaboration-map-heading">
      <div class="collaboration-card-heading">
        <div>
          <p class="collaborations-kicker">Core research network · 2+ joint papers</p>
          <h1 id="collaboration-map-heading">Global collaboration heatmap</h1>
          <p class="collaborations-lede">
            Countries are colored by the number of recurring collaborators at their current primary professional
            institution. Click a country to explore its people and joint papers.
          </p>
        </div>
        <label class="collaboration-country-picker">
          <span>Explore a country</span>
          <select id="collaboration-country-select">
            <option value="">Choose a country</option>
          </select>
        </label>
      </div>

      <section class="collaboration-stats" aria-label="Collaboration summary">
        <article><strong id="collab-stat-countries">—</strong><span>countries</span></article>
        <article><strong id="collab-stat-people">—</strong><span>core collaborators</span></article>
        <article><strong id="collab-stat-papers">—</strong><span>joint papers</span></article>
        <article><strong id="collab-stat-instances">—</strong><span>collaboration instances</span></article>
      </section>

      <div id="collaboration-map" class="collaboration-map" role="group" aria-label="Interactive world collaboration map">
        <p class="collaboration-map-status" role="status">Preparing the map…</p>
      </div>

      <div class="collaboration-legend" aria-label="Legend: unique collaborators from low to high">
        <span>Fewer</span>
        <div class="collaboration-legend-scale">
          <div id="collaboration-legend-ramp" aria-hidden="true"></div>
          <div class="collaboration-legend-ticks" aria-hidden="true">
            <span>1</span><span id="collaboration-legend-midpoint">—</span><span id="collaboration-legend-range">—</span>
          </div>
        </div>
        <span>More collaborators</span>
      </div>
      <p class="collaboration-map-hint">Hover to preview. Click, tap, or use Tab and Enter to open a country.</p>
      <p id="collaboration-coverage-note" class="collaboration-coverage-note"></p>

    </section>

    <aside class="collaboration-sidebar" aria-label="Collaboration details">
      <section class="collaboration-ranking-card collaboration-collaborators-card">
        <p class="collaborations-kicker">By joint papers</p>
        <h3>Top collaborators</h3>
        <ol id="collaboration-collaborator-ranking"></ol>
      </section>

      <section class="collaboration-ranking-card">
        <p class="collaborations-kicker">By activity</p>
        <h3>Leading countries</h3>
        <ol id="collaboration-ranking"></ol>
      </section>

      <section id="collaboration-detail" class="collaboration-detail-card" aria-live="polite">
        <p class="collaborations-kicker">Country detail</p>
        <h3>Select a country</h3>
        <p>Choose a shaded country to see the people and papers connecting this network.</p>
      </section>
    </aside>

  </div>

  <div id="collaboration-tooltip" class="collaboration-tooltip" role="tooltip" hidden></div>

  <details class="collaboration-methodology">
    <summary>How this map is built</summary>
    <div>
      <p>
        This first version shows the <strong>core network</strong>: named collaborators with at least two joint papers in
        my bibliography. Map color represents unique collaborators. A country's activity score is the sum of
        collaborator–paper pairs; papers are counted uniquely in the other totals. Large-team one-off coauthors will be
        added in a later expanded view.
      </p>
      <p>
        Each person is assigned one current primary professional country, based on an institutional profile first and a
        personal profile or recent authoritative affiliation when needed. This is not nationality or inferred residence.
        Affiliations were last verified <strong>7 August 2026</strong>. The map geometry is the public-domain
        <a href="https://www.naturalearthdata.com/about/terms-of-use/">Natural Earth</a> 1:110m country dataset.
      </p>
    </div>
  </details>

<noscript>This interactive map needs JavaScript. The methodology above describes the current core dataset.</noscript>

</div>

<script id="collaborations-data" type="application/json">
  {{ site.data.collaborations | jsonify }}
</script>
<script
  src="https://cdn.jsdelivr.net/npm/d3@7.8.5/dist/d3.min.js"
  integrity="sha256-1rA678n2xEx7x4cTZ5x4wpUCj6kUMZEZ5cxLSVSFWxw="
  crossorigin="anonymous"
></script>
<script src="{{ '/assets/js/collaborations-map.js' | relative_url }}"></script>
