---
layout: base
title: "Outdoor Gear Reviews"
description: "Reviews of fishing gear, camping equipment, outdoor apparel [fishing gear reviews](/reviews/fishing/index/) [camping gear reviews](/reviews/camping/index/) [camping gear reviews](/reviews/camping/index/), and backcountry essentials. Bought it, used it, telling you what we actually think."
permalink: /reviews/gear/
---

<div class="container" style="padding-top: 2rem;">

  <h1>Outdoor Gear Reviews</h1>
  <p class="category-intro">Boots, jackets, backpacks, tents — gear that goes where you go. We review what we've actually put to work in the field.</p>

  <div class="review-list">
    {% for review in collections.gearReviews | reverse %}
    <article class="review-card">
      <h2><a href="{{ review.url }}">{{ review.data.title }}</a></h2>
      {% if review.data.description %}<p>{{ review.data.description }}</p>{% endif %}
      <a href="{{ review.url }}" class="read-more">Read full review →</a>
    </article>
    {% endfor %}
  </div>

</div>
