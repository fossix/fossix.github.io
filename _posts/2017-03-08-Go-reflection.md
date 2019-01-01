---
layout: post
title:  "Go's Reflection"
excerpt: "Using the reflect package"
date:   2017-03-08 11:39:17 +0530
categories: golang
tags: [go, golang]
author: sab
---

# Go's reflection

Reflection is used by the Go program to inspect types at runtime. Some
understanding of Go's `interface{}` is required before proceeding.

Consider a hypothetical requirement to build a validation for structures. In
usual case I would prefer a `if-else` statement.

```go
type Employee struct {
	Name    string `json:"name"`
	Address string `json:"address"`
	Age     int    `json:"age"`
}

var e Employee
err := json.Unmarshal(data, &e)

// validate each field

if e.Name == "" {
    log.Fatal("Name cannot be empty")
}

if e.Age < 18 {
    log.Fatal("Should be atleast 18 years old")
}
...
```

This is prefectly fine until the only resource in you web application is
Employee. Life is never made so simple even you wish it could be, If there are
many such struct, aka json contracts that need to be validated a simpler
approach is beneficial. Fortunately, Go's standard library comes with a package
`reflect`, we need a generic validator for all common actions.

So our hypothetical validator will implement a `validator()` function. Which
takes in a interface{} and spews out a interface{} and errors if necessary.

```go
func main() {
	e := Employee{Name: "Sab", Address: "here", Age: 13}
    fmt.Println(validator(e))
}
func validator(e interface{}) []error {
    /* Convert the interface to reflection object -> do some processing -> convert it back to interface{} */
}
```

So the meat of the validator function is to convert the interface to a
validation object and verify validity of data. since I don't know what is the
type of the input; here comes
[reflection](https://en.wikipedia.org/wiki/Reflection_(computer_programming)).

Inorder to convert a interface to a reflection object; We need to know there are
two kinds of reflection objects: `Type` & `Value`; functions `reflect.TypeOf()`,
`reflect.ValueOf()` return `Type` and `Value` respectively. `Type` represents
the Go's type.

First, Our challenge will be to go over each field in the struct. This can be
done with the following:

```go
func validator(e interface{}) []error {
	v := reflect.TypeOf(e) // returns reflect.Type 
	for i := 0; i < v.NumField(); i++ {
		fmt.Println(v.Field(i).Name, v.Field(i).Type.Kind())
	}
    return nil
}
```

Here `Field()` method of the Type object return a `StructField` instance, which
in turn has a reference to the Type of the field. Now that our first part of our
problem is complete, second part of the problem is to identify what kind of
validation should be applied to what kind of data. In our case we will need a
string validator and number validator. We can use a custom struct tag which will
give inputs to our validator.

```go
type Employee struct {
	Name    string `json:"name" validate:"string,min=1,max=0"`
	Address string `json:"address" validate:"string,min=1,max=0"`
	Age     int    `json:"age" validate:"number,min=1,max=0"`
}
```
And our validators will be:

```go
type stringValidator struct {
	MaxLength int
	MinLength int
}

func (s stringValidator) validate(x reflect.Value) error {
	v := x.Interface().(string)
	if len(v) > s.MaxLength {
		return errors.New("exceeds max length")
	}
	if len(v) < s.MinLength {
		return errors.New("Can be this small")
	}
	return nil
}

type numberValidator struct {
	Max int
	Min int
}

func (s numberValidator) validate(x reflect.Value) error {
	v := x.Interface().(int)
	if v > s.Max {
		return errors.New("exceeds max value")
	}
	if v < s.Min {
		return errors.New("Can be this small")
	}
	return nil
}
```

`v` here is converted back to `interface{}` type so that it can be converted
back to it real underlying type. To select one of these validators, our
validator function should use the validate tag's type information. Our validator
function should be extended as following.

```go
func validator(e interface{}) []error {
	v := reflect.ValueOf(e)
	t := v.Type()
	errs := make([]error, 0, t.NumField())
	for i := 0; i < t.NumField(); i++ {
		tag := strings.SplitN(t.Field(i).Tag.Get("validate"), ",", 2)

		switch tag[0] {
		case "number":
			x := numberValidator{}
			fmt.Sscanf(tag[1], "min=%d,max=%d", &x.Min, &x.Max)
			e := x.validate(v.Field(i))
			errs = append(errs, e)
			break
		case "string":
			x := stringValidator{}
			fmt.Sscanf(tag[1], "min=%d,max=%d", &x.MinLength, &x.MaxLength)
			e := x.validate(v.Field(i))
			errs = append(errs, e)
			break
		}
		return errs
	}
	return nil
}
```

Tip: Read this [https://blog.golang.org/laws-of-reflection](https://blog.golang.org/laws-of-reflection)
