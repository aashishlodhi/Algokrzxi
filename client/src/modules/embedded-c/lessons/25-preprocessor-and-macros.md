---
title: The preprocessor and macros
summary: #include, #define, function-like macros, # and ##, conditional compilation, and include guards.
---

## What the preprocessor does

It runs before the compiler. It performs text substitution only, with no knowledge of C types. See its output with `gcc -E file.c`.

## #include

```c
#include <stdio.h>      /* searched in the standard directories (or -I paths) */
#include "mymath.h"     /* searched in the current directory first */
```

## #define

```c
#define PI 3.142                       /* symbolic constant */
#define SQUARE(x) ((x) * (x))          /* function-like macro */
#define MAX(a, b) (((a) > (b)) ? (a) : (b))
```

You can also define a symbol on the command line: `gcc -DPI=3.142 main.c`.

::: warning
Always parenthesize macro parameters and the whole body. `#define SQUARE(x) x * x` turns `SQUARE(a + 1)` into `a + 1 * a + 1`.
:::

::: pitfall
Macro arguments are evaluated each time they appear. `SQUARE(i++)` increments `i` twice. A real function does not have this problem.
:::

## Macro versus function

| | Macro | Function |
| --- | --- | --- |
| Expanded | by the preprocessor, before compiling | called at runtime |
| Type checking | none | yes |
| Speed | no call overhead | call overhead (inlining can remove it) |
| Code size | grows at every use | one copy |
| Debugging | harder | easier |

Modern C prefers `static inline` functions and `const` values (or `enum`) over macros, where possible.

## # and ## operators

```c
#define PRINT(var)  printf(#var " = %d\n", var)      /* # turns the argument into a string */
#define JOIN(a, b)  a##b                             /* ## pastes tokens together */

int count = 5;
PRINT(count);              /* prints: count = 5 */
int JOIN(value, 1) = 10;   /* declares: int value1 = 10; */
```

## Predefined macros

`__FILE__`, `__LINE__`, `__DATE__`, `__TIME__`, `__func__` (not a macro but a predefined identifier). Handy for logging.

## Conditional compilation

```c
#ifdef DEBUG
    printf("x = %d\n", x);
#endif

#if defined(ARM) && !defined(AVR)
    /* ... */
#else
    /* ... */
#endif
```

Used to keep one code base for several targets, or to enable debug code with `-DDEBUG`. Also available: `#ifndef`, `#elif`, `#undef`, `#error "message"`, `#pragma`.

## Include guards

A header can be included more than once through other headers. Guard it:

```c
#ifndef MYMATH_H
#define MYMATH_H

int add(int a, int b);

#endif
```

## Practice questions

1. What does `#define DOUBLE(x) x + x` give for `3 * DOUBLE(2)`?

::: answer
`3 * 2 + 2 = 8`, not 12, because the macro body is not parenthesized. The correct macro is `((x) + (x))`.
:::
