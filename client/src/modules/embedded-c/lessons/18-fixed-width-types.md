---
title: Fixed-width integer types
summary: Why int is risky in firmware and how stdint.h fixes it.
---

## Why it matters

The C standard only guarantees minimum sizes for `int`, `short` and `long`. On one target `int` is 16 bits, on another it is 32. Firmware talks to registers and protocols with exact widths, so the code must state them.

## Learning objectives

- Use `uint8_t`, `int16_t`, `uint32_t` and friends from `<stdint.h>`.
- Predict what happens on unsigned wrap-around and integer promotion.
- Avoid signed/unsigned comparison bugs.

## Core ideas

`<stdint.h>` provides types whose width is part of the name. Use them whenever a variable maps to hardware, a buffer, or a wire format.

| Type | Meaning |
| --- | --- |
| `uint8_t` | unsigned, exactly 8 bits |
| `int16_t` | signed, exactly 16 bits |
| `uint32_t` | unsigned, exactly 32 bits |
| `size_t` | result type of `sizeof` |

Unsigned arithmetic wraps modulo 2^N by definition. Signed overflow is undefined behavior, so the compiler may assume it never happens.

```c
#include <stdint.h>

uint8_t counter = 255u;
counter++;              /* wraps to 0, well defined */

int8_t  s = 127;
/* s++ would overflow a signed type: do not rely on any result */
```

Small types are promoted to `int` before arithmetic, which surprises people:

```c
uint8_t a = 200u, b = 100u;
uint16_t sum = a + b;   /* computed as int: 300, then stored */
uint8_t  low = a + b;   /* 300 truncated to 8 bits: 44 */
```

## Common mistakes

::: pitfall
Comparing a signed value with an unsigned one. In `if (-1 < 1u)` the `-1` is converted to a huge unsigned number, so the test is false.
:::

::: warning
Do not assume `char` is signed or unsigned. It is implementation-defined. Use `uint8_t` for raw bytes.
:::

## Interview angle

::: interview
"Why not just use `int`?" A strong answer: its size is implementation-defined, so behavior and memory use change between targets, and fixed-width types make the intent and the layout explicit.
:::

## Summary

Use `<stdint.h>` types for anything tied to hardware or data formats. Know that unsigned wraps, signed overflow is undefined, and small types are promoted to `int`.

## Practice questions

1. What does `uint8_t x = 250u; x += 10u;` leave in `x`?

::: answer
`x` becomes 4. The sum 260 does not fit in 8 bits, and unsigned conversion keeps the value modulo 256.
:::

2. Why is `if (len - 1 < limit)` risky when `len` is `size_t` and can be 0?

::: answer
`len - 1` wraps to a very large unsigned value when `len` is 0, so the comparison is false when you expected true.
:::
