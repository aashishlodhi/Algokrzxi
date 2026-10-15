---
title: typedef and enum
summary: Naming types for readability and portability, and naming integer constants with enum.
---

## typedef

`typedef` gives an existing type another name.

```c
typedef unsigned char  uint8;
typedef unsigned int   uint32;
typedef struct emp EMPLOYEE;
```

Why it helps:

1. Makes code easier to read.
2. Makes porting easier: if `int` changes size on another platform, you change one `typedef`.
3. Simplifies complicated declarations such as function pointers (see the function pointer lesson).

Prefer the fixed-width types from `<stdint.h>` (`uint8_t`, `int16_t`, `uint32_t`) for hardware-facing code.

## enum

An `enum` defines a set of named integer constants.

```c
enum colors { RED, BLUE, GREEN };    /* RED=0, BLUE=1, GREEN=2 */
enum level  { LOW = 10, MEDIUM, HIGH = 50 };   /* 10, 11, 50 */

enum colors c = BLUE;
```

- Each name is an integer constant.
- If the first name has no value it is `0`, and each following name is the previous value plus one.
- You can assign explicit values.
- Enumerations make code self-documenting, especially with `switch`:

```c
switch (state) {
    case IDLE:    ...; break;
    case RUNNING: ...; break;
}
```

## Common mistakes

::: pitfall
Assuming the compiler stops you from assigning an out-of-range integer to an enum variable. In C an enum is essentially an integer, so `c = 99;` compiles.
:::

## Practice questions

1. What are the values in `enum e { A = 5, B, C = 2, D };`?

::: answer
A=5, B=6, C=2, D=3.
:::
