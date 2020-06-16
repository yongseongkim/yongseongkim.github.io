---
layout: page
title: Categories
permalink: /categories/
---

{% if site.posts.size == 0 %}
  <h2>No post found</h2>
{% endif %}

{% capture site_categories %}{% for category in site.categories %}{{ category | first }}{% unless forloop.last %},{% endunless %}{% endfor %}{% endcapture %}
{% assign category_names = site_categories | split:',' | sort %}
<div class="categories">
  <ul class="label">
    {% for idx in (0..site.categories.size) %}{% unless forloop.last %}
      {% capture category_name %}{{ category_names[idx] | strip_newlines }}{% endcapture %}
      <li itemscope class="archive">
        <a href="#{{ category_name }}" class="post-link">
          <p>{{ category_name }}</p>
        </a>
      </li>
    {% endunless %}{% endfor %}
  </ul>

  {% for idx in (0..site.categories.size) %}{% unless forloop.last %}
    {% capture category_name %}{{ category_names[idx] | strip_newlines }}{% endcapture %}
    <h2 id="{{ category_name }}">
      {{ category_name }}
    </h2>
    <ul class="category">
      {% for post in site.categories[category_name] %}{% if post.title != null %}
      <li itemscope class="archive">
        <a href="{{ site.github.url }}{{ post.url }}" class="post-link">
          <p>{{ post.title }}
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span class="archive-meta">{{ post.date | date: "%Y-%m-%d" }}</span>
          </p>
        </a>
      </li>
      {% endif %}{% endfor %}
    </ul>
  {% endunless %}{% endfor %}
</div>
