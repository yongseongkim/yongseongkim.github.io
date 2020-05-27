---
layout: page
title: Archive
permalink: /archive/
tags: archive
---

<ul class="posts">
  {% for post in site.posts %}
    {% unless post.next %}
      <h3>{{ post.date | date: '%Y' }}</h3>
    {% else %}
      {% capture year %}{{ post.date | date: '%Y' }}{% endcapture %}
      {% capture nyear %}{{ post.next.date | date: '%Y' }}{% endcapture %}
      {% if year != nyear %}
        <h3>{{ post.date | date: '%Y' }}</h3>
      {% endif %}
    {% endunless %}
    <li itemscope class="archive">
      <a href="{{ site.github.url }}{{ post.url }}" class="post-link">
        <p>{{ post.title }}
          &nbsp;&nbsp;&nbsp;&nbsp;
          <span class="archive-meta">{{ post.date | date: "%Y-%m-%d" }}</span>
        </p>
      </a>
    </li>

  {% endfor %}
</ul>
