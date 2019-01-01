---
layout: post
title:  "Concurrency notes"
excerpt: "Make two go goutines wait on each other"
date:   2018-11-14 11:29:17 +0530
categories: golang
tags: [golang, concurrency]
author: sab
---

## Deadlock


```go
package main

import (
	"fmt"
	"sync"
	"time"
)

type value struct {
	mu sync.Mutex
	v  int
}

var wg sync.WaitGroup

func print(i, j *value) {
	defer wg.Done()
	i.mu.Lock()
	defer i.mu.Unlock()

	time.Sleep(2 * time.Second)

	j.mu.Lock()
	defer j.mu.Unlock()

	fmt.Print(i.v + j.v)
}

func main() {
	a := &value{v: 1}
	b := &value{v: 2}
	var wg sync.WaitGroup
	wg.Add(2)
	go print(a, b)
	go print(b, a)
	wg.Wait()
	fmt.Println("reached here?")
}
```

Are they meeting coffman conditions:
- Mutual exclusion: data access is synchronized with mutexes, atleast one resource is held in non shareable mode.
- Hold & wait, a process already hold a resource and waiting for additional resource.
- resource should be voluntarily released by a process holding it.
- circular wait.

So the answer is yes.

### Other issues on concurrent code

#### Livelocking
todo

#### Starvation
A greedy process might take more time required. But
having too many memory access sync could degrade performance, on the
other hand a larger critical section could lead to starvation.
