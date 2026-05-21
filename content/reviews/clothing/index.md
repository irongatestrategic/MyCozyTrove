---
layout: base
title: "Fishing & Camping Clothing Reviews | MyCozyTrove"
description: "Boots, jackets, base layers, and footwear reviewed for real conditions on the water and in camp."
eleventyExcludeFromCollections: true
---

# Fishing & Camping Clothing

What you wear determines how long you stay out. Boots, jackets, waders, and layering systems reviewed against what actually happens in the field.

<ul>
{% for post in collections.clothingReviews %}
  <li><a href="{{ post.url }}">{{ post.data.title }}</a></li>
{% endfor %}
</ul>