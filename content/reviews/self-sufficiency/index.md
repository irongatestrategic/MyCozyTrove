---
layout: base
title: "Self-Sufficiency Reviews"
description: "Reviews of books, tools, and resources for living more independently — homesteading, foraging, food preservation, and off-grid skills."
permalink: /reviews/self-sufficiency/
---

<div class="container" style="padding-top: 2rem;">

  <h1>Self-Sufficiency Reviews</h1>
  <p class="category-intro">Guides, books, and tools for doing more yourself — from growing food to preserving it, and building skills that don't depend on a supply chain.</p>

  <div class="review-list">
    {% for review in collections.selfSufficiencyReviews | reverse %}
    <article class="review-card">
      <h2><a href="{{ review.url }}">{{ review.data.title }}</a></h2>
      {% if review.data.description %}<p>{{ review.data.description }}</p>{% endif %}
      <a href="{{ review.url }}" class="read-more">Read full review →</a>
    </article>
    {% endfor %}
    {% if collections.selfSufficiencyReviews.length == 0 %}
    <p class="coming-soon">Self-sufficiency reviews coming soon.</p>
    {% endif %}
  </div>

</div>
