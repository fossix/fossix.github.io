---
layout: master
title: "Latest Posts"
---

<ul style="list-style-type:none;">
{% for post in site.posts limit:10 %}
{% if post.title != null %}
  <li>
    <a href="{{ site.url }}{{ post.url }}" title="{{ post.title }}" >
      {{ post.title }}
    </a>
    <span class="badge float-right">
      {{ post.date | date: "%B, %Y" }}
    </span>
  </li>
{% endif %}
{% endfor %}
</ul>
