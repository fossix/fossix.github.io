---
layout: post
title: "Tags"
---
{% capture site_tags %}{% for tag in site.tags %}
{{ tag | first }}{% unless forloop.last %},{% endunless %}{% endfor %}{% endcapture %}
{% assign tags_list = site_tags | split:',' | sort_natural %}

{% for item in (0..site.tags.size) %}{% unless forloop.last %}
{% capture this_word %}{{ tags_list[item] | strip_newlines }}{% endcapture %}
<article id="{{ this_word }}">
  <h3>
    <span class="badge badge-dark">{{ this_word }}</span>
    <span class="badge badge-secondary float-right">{{site.tags[this_word].size}}</span>
  </h3>
  <ul style="list-style-type:none;margin:0;padding:0;">
    {% for post in site.tags[this_word] reversed %}
      {% if post.title != null %}
        <li style="margin:0;padding:0;">
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
</article>
<hr>
{% endunless %}{% endfor %}
