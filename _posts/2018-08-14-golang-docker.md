---
layout: post
title:  "dockerize go programs"
date:   2018-08-14 11:29:17 +0530
categories: golang
tags: [golang, docker]
author: sab
---

again this is for my self reference:

Assume this is the production grade program we need to dockerize and run. 

```go
package main

import "fmt"

func main() {
     fmt.Println("saying hello to the world")
}

```

```docker
FROM golang:1.10-alpine as builder
WORKDIR /go/src/github.com/shabinesh/prog
COPY main.go  .
COPY vendor ./vendor
RUN CGO_ENABLED=0 go build -o main .

FROM alpine:latest 
RUN apk --no-cache add ca-certificates
WORKDIR /
COPY --from=0 /go/src/github.com/shabinesh/prog/main .
CMD ["./main"] 
```
