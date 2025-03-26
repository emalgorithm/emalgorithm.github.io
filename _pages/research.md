---
layout: page
permalink: /research/
title: Research
description: "My research spans from machine learning for biology to graph neural networks"
keywords: "graph neural networks, directed graphs, temporal graphs, machine learning, feature propagation, biology, drug discovery, generative models"
years: [2024, 2023, 2022, 2021, 2020, 2019]
nav: true
sort_menu: 1
---
Below is a list of my publications in reversed chronological order, with links to all the relevant resources such as arXiv, GitHub, slides, etc. An always up-to-date list of my papers is available on [Google Scholar](https://scholar.google.com/citations?user=DHlkBOYAAAAJ).

<div class="publications">

<br/>
{% for y in page.years %}
  <div class="row m-0 p-0" style="border-top: 1px solid #ddd; flex-direction: row-reverse;">
    <div class="col-sm-1 mt-2 p-0 pr-1">
      <h3 class="bibliography-year">{{y}}</h3>
    </div>
    <div class="col-sm-11 p-0">
      {% bibliography -f papers -q @*[year={{y}}]* %}
    </div>
  </div>
{% endfor %}
