---
layout: base
title: Outdoor Gear Reviews
description: Technical reviews of portable power stations, solar panels, and outdoor energy gear for camping and off-grid use.
permalink: /reviews/outdoor/
---

# Outdoor Gear Reviews

<p class="category-intro">Technical analysis of portable power [portable power stations](/reviews/power/index/) and outdoor energy gear — specs, real-world runtime, and honest trade-offs for camp setups and off-grid use [camp power setup decisions](/reviews/outdoor/solar-panels-vs-portable-power-stations-camp-setup/).</p>

<div class="review-list">
  {% for review in collections.outdoorReviews %}
    {% if review.url != page.url %}
    <div class="review-card">
      <h2><a href="{{ review.url }}">{{ review.data.title }}</a></h2>
      <time datetime="{{ review.date | dateToRfc3339 }}">{{ review.date | dateToRfc3339 | truncate(10, true, '') }}</time>
      {% if review.data.description %}
        <p>{{ review.data.description }}</p>
      {% endif %}
      <a href="{{ review.url }}" class="read-more">Read Review →</a>
    </div>
    {% endif %}
  {% endfor %}
</div>
