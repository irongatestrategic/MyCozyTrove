---
layout: base
title: "Outdoor Gear Reviews & Guides | MyCozyTrove"
description: "Outdoor gear reviews and guides for hikers, campers, and backcountry travelers. Covers portable power, navigation, and field equipment evaluated on real-world performance."
eleventyExcludeFromCollections: true
---

# Outdoor

Gear for hikers, campers, and backcountry travelers — evaluated on what it actually does in the field.

<ul>
{% for post in collections.outdoorReviews %}
  <li><a href="{{ post.url }}">{{ post.data.title }}</a></li>
{% endfor %}
</ul>
