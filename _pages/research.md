---
layout: page
permalink: /research/
title: Research
years: [2023, 2022, 2021, 2020, 2019]
nav: true
sort_menu: 1
---
My research focuses on bridging the gap between purely academic research and real-world applications of Graph Neural Networks. In the real-world, graphs are often extremely large, dynamic, directed, and have nodes with partially missing features. This raises the following research questions:

- **Scalability**: How can we scale GNNs to handle billion-node graphs and beyond?
- **Dynamic Graphs**: How can we learn from graphs that change over time, such as social or transaction networks?
- **Directionality**: How can we learn from graphs that have directed edges, such as transportation or citation networks?
- **Missing Node Features**: How can we apply GNNs to graphs where we only observe a subset of features for each node?

Through my research, I aim to develop solutions to these challenges and enable GNNs to be used more widely and effectively in real-world applications.

### Publications
Below is a list of my publications in reversed chronological order. 

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
