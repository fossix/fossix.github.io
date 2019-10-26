---
layout: master
title: "Random thoughts"
---

<ul style="list-style-type:none;">
{% for post in site.categories.blogs limit:10 %}
{% if post.title != null %}
<li style="padding-bottom: 15px;">
  <div>
    <span class="badge">
      {{ post.date | date: "%B, %Y" }}
    </span>

    <div class="float-right">
      {% for tag in post.tags %}
      <a href="/tags/#{{ tag | slugify }}" class="badge badge-dark">
        {{ tag }}
      </a>
      {% endfor %}
    </div>

    <div>
      <a href="{{ site.url }}{{ post.url }}" title="{{ post.title }}" >
        <h4>{{ post.title }}</h4>
      </a>
    </div>
  </div>
</li>
{% endif %}
{% endfor %}
</ul>
