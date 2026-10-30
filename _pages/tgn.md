---
layout: page
title: Temporal Graph Networks (TGN)
permalink: /tgn/
description: A framework for deep learning on graphs that change over time, developed at Twitter. Cited over 2,000 times, with 1,200+ stars on GitHub.
nav: false
---

<div class="row justify-content-center mt-2 mb-3">
  <div class="col-sm-10">
    {% include figure.liquid loading="eager" path="assets/img/publication_preview/tgn.png" class="img-fluid rounded" alt="A dynamic social graph: users follow, tweet and retweet over time, and the task is to predict a future edge" %}
  </div>
</div>
<div class="caption">
  A dynamic graph is a stream of timestamped events (follows, tweets, retweets). TGN learns from this stream to predict, for example, which edges will appear next.
</div>

**Emanuele Rossi**, Ben Chamberlain, Fabrizio Frasca, Davide Eynard, Federico Monti, Michael Bronstein<br>
<em>ICML 2020 Workshop on Graph Representation Learning</em>

<div class="links mb-4">
  <a href="https://arxiv.org/abs/2006.10637" class="btn btn-sm z-depth-0" role="button">Paper (arXiv)</a>
  <a href="https://github.com/twitter-research/tgn" class="btn btn-sm z-depth-0" role="button">Code</a>
  <a href="https://towardsdatascience.com/temporal-graph-networks-ab8f327f2efe" class="btn btn-sm z-depth-0" role="button">Blog post</a>
  <a href="https://www.youtube.com/watch?v=W1GvX2ZcUmY" class="btn btn-sm z-depth-0" role="button">Video</a>
  <a href="{{ '/assets/pdf/tgn_aisc_2020.pdf' | relative_url }}" class="btn btn-sm z-depth-0" role="button">Slides</a>
  <a href="#citation" class="btn btn-sm z-depth-0" role="button">Cite</a>
</div>

## In short

Most graph neural networks assume a graph that does not change. Many real systems are not like that: nodes and edges keep appearing over time in social networks, financial transactions and recommender systems, but also across science, from the contact networks through which epidemics spread, to interactions between proteins or brain regions, to the social structure of animal groups. **Temporal Graph Networks (TGN)** learn directly from such a graph seen as a continuous stream of timestamped events.

The key idea is a **memory** for every node: a compact summary of everything that node has been involved in so far, updated each time a new event touches it. When the model needs a representation of a node, it combines this memory with information from the node's recent neighbours through a graph attention layer. This makes TGN both more accurate and more efficient than previous approaches to dynamic graphs.

## How it works

TGN is a framework made of a few interchangeable modules:

- **Memory**: a state vector per node, storing its history in compressed form.
- **Message function**: when an event (e.g. an interaction between two nodes) happens, it computes a message for each node involved.
- **Memory updater**: a recurrent network (such as a GRU) that updates each node's memory with its new messages.
- **Embedding module**: computes up-to-date node embeddings by aggregating memories of temporal neighbours with graph attention. This also handles nodes whose memory is stale because they have not been active recently.

<div class="row justify-content-center mt-3">
  <div class="col-sm-11">
    {% include figure.liquid path="assets/img/tgn_training_flow.png" class="img-fluid rounded" alt="TGN training flow: a batch of timestamped interactions produces node embeddings, edge probabilities and a loss, then messages that update each node's memory" %}
  </div>
</div>
<div class="caption">
  How TGN processes a batch of interactions during training: (1) compute node embeddings from the current memory, (2) decode them into edge probabilities and (3) compute the loss; then (4) build messages from the batch and (5) use them to update the memory of the nodes involved.
</div>

Several earlier models for dynamic graphs, such as JODIE, DyRep and TGAT, can be expressed as particular choices of these modules. The paper includes an ablation study of the different components and identifies the best-performing configuration.

## Code

The official PyTorch implementation is available at [twitter-research/tgn](https://github.com/twitter-research/tgn). TGN is also implemented in [PyTorch Geometric](https://pytorch-geometric.readthedocs.io/en/latest/generated/torch_geometric.nn.models.TGNMemory.html), which makes it easy to use as a building block in other models.

## Talks

{% assign tgn_talks = '' | split: '' %}
{% for item in site.data.outreach.talks %}
{% if item.title contains 'Temporal Graph Networks' or item.title contains 'TGN' %}
{% assign tgn_talks = tgn_talks | push: item %}
{% endif %}
{% endfor %}
{% assign tgn_talks = tgn_talks | sort: 'date' | reverse %}

<div class="table-responsive">
  <table class="table table-sm table-borderless">
    <tbody>
      {% for item in tgn_talks %}
        <tr>
          <td class="text-nowrap" style="width: 6rem">
            <small class="text-muted">{{ item.date | date: '%b %Y' }}</small>
          </td>
          <td>
            <em>{{ item.title }}</em><br>
            <small>
              {%- if item.venue_url -%}
                <a href="{{ item.venue_url }}" target="_blank" rel="noopener noreferrer">{{ item.venue }}</a>
              {%- else -%}
                {{ item.venue }}
              {%- endif -%}
            </small>
            {% if item.slides_pdf_url or item.video_url %}
              <div class="links">
                {% if item.slides_pdf_url %}
                  <a href="{{ item.slides_pdf_url | relative_url }}" class="btn btn-sm z-depth-0" role="button">Slides (PDF)</a>
                {% endif %}
                {% if item.video_url %}
                  <a href="{{ item.video_url }}" target="_blank" rel="noopener noreferrer" class="btn btn-sm z-depth-0" role="button">Video</a>
                {% endif %}
              </div>
            {% endif %}
          </td>
        </tr>
      {% endfor %}
    </tbody>
  </table>
</div>

## Writing

- [Temporal Graph Networks](https://towardsdatascience.com/temporal-graph-networks-ab8f327f2efe), Towards Data Science (2020): the introductory blog post on TGN.
- [Deep Learning on Dynamic Graphs](https://blog.x.com/engineering/en_us/topics/insights/2021/temporal-graph-networks), Twitter Engineering Blog (2021).
- [Accelerating and Scaling Temporal Graph Networks on the Graphcore IPU](https://www.graphcore.ai/posts/accelerating-and-scaling-temporal-graph-networks-on-the-graphcore-ipu), Graphcore Blog (2022).
- [Temporal Graph Learning in 2023](https://towardsdatascience.com/temporal-graph-learning-in-2023-d28d1640dbf2/) and [in 2024](https://towardsdatascience.com/temporal-graph-learning-in-2024-feaa9371b8e2/), Towards Data Science: overviews of where the field has been heading.

## Follow-up work

Later work on temporal graphs that I contributed to, including benchmarks that have become standard for evaluating models like TGN.

<div class="publications">
{% bibliography --query @*[key=tgb_huang_2023 || key=tgb2_gastinger_2024 || key=huang_utg_2024] %}
</div>

## Citation

```bibtex
@article{rossi2020tgn,
  title   = {Temporal Graph Networks for Deep Learning on Dynamic Graphs},
  author  = {Emanuele Rossi and Ben Chamberlain and Fabrizio Frasca and Davide Eynard and Federico Monti and Michael Bronstein},
  journal = {ICML Workshop on Graph Representation Learning},
  year    = {2020}
}
```
