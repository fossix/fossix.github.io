---
layout: default
title: Archive
search_omit: false
---

<div class="container">
  <div class="row">
    <div class="col-md-12">
      {% for post in site.posts reversed %}
      {% capture currentyear %}{{post.date | date: "%Y"}}{% endcapture %}
      {% if currentyear != year %}
      <h3>{{ currentyear }}</h3>
      {% capture year %}{{currentyear}}{% endcapture %}
      {% endif %}
      <ul class="posts-in-year">
        <li>
          <p>
            <a href="{{ post.url | prepend: site.baseurl }}">
              {{ post.title }}
            </a>
            <span class="badge float-right">
              {{ post.date | date: "%B, %Y" }}
            </span>
          </p>
        </li>
      </ul>
      {% endfor %}
    </div>
  </div>
</div>
