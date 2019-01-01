---
layout: post
title:  "Elegant Time"
excerpt: "Timing function runtime"
date:   2017-12-25 11:29:17 +0530
categories: golang
tags: [golang, time]
author: sab
---

I often write debug logs with this below piece of code to print how much time a
function took

```go
func upload() {
	start := time.Now()
	// processing
	fmt.Println("uploaded in %s secs", time.Now().Sub(start))
}
```

thats two lines, plus I should always remember to write that last line of code,
With Golang's deferred function it just one line

```go
func totalTime(t time.Time) {
	fmt.Print(time.Now().Sub(t))
}

func main() {
	defer totalTime(time.Now())
	time.Sleep(1*time.Second)
	fmt.Println("Hello, playground")
}
```

Here we use the fact of deferred function that arguments are evaluated first and
the function is called after return of callee.
