---
layout: base
title: "Tent Reviews & Buying Guides | MyCozyTrove"
description: "Tent reviews for solo backpackers, car campers, and families. Specs, weight, waterproofing, and setup tested against real camping conditions."
eleventyExcludeFromCollections: true
---

# Tents

Shelter reviews evaluated on weight, waterproofing specs, setup time, and how they actually perform when weather turns.

<ul>
{% for post in collections.tentReviews %}
  <li><a href="{{ post.url }}">{{ post.data.title }}</a></li>
{% endfor %}
</ul>
