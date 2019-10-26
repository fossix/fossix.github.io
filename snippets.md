---
layout: master
title: "Code snippets"
---

<ul style="list-style-type:none;">
  {% for s in site.categories.snippets %}
  <li style="padding-bottom: 15px;">
    <div>
      <a href="{{ s.url | prepend: site.baseurl }}">
        <h5>{{ s.title }}</h5>
      </a>
      <span class="badge float-right">
        {{ s.date | date: "%B, %Y" }}
      </span>
    </div>

    <div>
      {% for tag in s.tags %}
      <a href="/tags/#{{ tag | slugify }}" class="badge badge-dark">
        {{ tag }}
      </a>
      {% endfor %}
    </div>

  </li>
  {% endfor %}

</ul>
