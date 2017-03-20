---
layout: post
title: Generate unique IDs
excerpt: "The aritcle talks about a simple way to generate meaningful unique ids. Typical application is with database shards."
categories: articles
tags: [c, database, algorithm]
image:
  feature: so-simple-sample-image-5.jpg
  credit: WeGraphics
  creditlink: http://wegraphics.net/downloads/free-ultimate-blurred-background-pack/
comments: true
share: true
modified: 2017-03-18T14:11:53+05:30
author: sab
---

Inspired by Instagram’s method to generate unique id’s. I just tried to write a
program which does the same. Before that, why this? In the case of Instagram,
they had their database sharded, with so many insertions in a second, each new
record needs a unique id where databases auto increment doesn’t work and also
place where you need to have id which are time sortable. The below is the
program and it’s explanation.

```c
#include<stdio.h>
#include<sys/time.h>

int main()
{
    int i;

    for(i =0;i < 32; i++)
      func(i);

    return 0;
}

int func(unsigned long u_id)
{
    struct timeval t;
    unsigned long id;

    gettimeofday(&t,NULL);
    id = (t.tv_sec * 1000 * 1000) + (t.tv_usec * 1000) << 42;
    id |= (u_id % 16777216) << 24;
    printf("%lu\n ",id);

    return 0;
}
```

The `main()` is self explanatory. `func()` uses the gettimeofday function to get
the time in seconds and microseconds (I am not sure about the epoch), both the
values are converted in milliseconds. I have used 42 bits to save the
milliseconds which roughly gives more than 4 years of unique ids, now that we
have a time sortable id, we can add the last 22 bits with a unique id like a
database generated one or a user-id. But managing the last few bits with other
attributes solves the real purpose.
