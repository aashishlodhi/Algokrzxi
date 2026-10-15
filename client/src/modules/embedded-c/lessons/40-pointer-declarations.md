---
title: Reading complex pointer declarations
summary: A method for decoding declarations, and 21 examples explained in plain English.
---

## How to read a declaration

Start at the **name**, then read outward: first go right, then left, and treat parentheses as grouping. `[]` means "array of", `()` means "function returning", `*` means "pointer to". Qualifiers (`const`, `volatile`) apply to what is on their left, or to the type if nothing is.

For `int (*fp)(int, int);`: `fp` is (parentheses first) a pointer to (going right) a function taking two ints returning (going left) an `int`.

## The 21 examples

| # | Declaration | In plain English |
| --- | --- | --- |
| 1 | `int *p;` | pointer to int |
| 2 | `int **pp;` | pointer to a pointer to int |
| 3 | `int * const p;` | constant pointer to int (the pointer cannot change, the int can) |
| 4 | `const int *p;` | pointer to a constant int (the int cannot be changed through `p`) |
| 5 | `int const * const p;` | constant pointer to a constant int |
| 6 | `int (*fp)(int, int);` | pointer to a function taking two ints and returning int |
| 7 | `void (*handler)(void);` | pointer to a function taking nothing and returning nothing |
| 8 | `void (*signal(int sig, void (*func)(int)))(int);` | `signal` is a function taking an int and a pointer to a function (int to void), and returning a pointer to a function (int to void) |
| 9 | `int (*p)[10];` | pointer to an array of 10 ints |
| 10 | `int *p[10];` | array of 10 pointers to int |
| 11 | `int (*operations[5])(int, int);` | array of 5 pointers to functions (int, int) returning int |
| 12 | `int (*(*p)[5])(int, int);` | pointer to an array of 5 pointers to functions (int, int) returning int |
| 13 | `int *(*fp)(void);` | pointer to a function taking nothing and returning a pointer to int |
| 14 | `int (*func(void))[10];` | `func` is a function taking nothing and returning a pointer to an array of 10 ints |
| 15 | `int (*(*complex_func(void))(int))(float);` | `complex_func` takes nothing and returns a pointer to a function (int) that returns a pointer to a function (float) returning int |
| 16 | `volatile unsigned int * const UART_DR;` | constant pointer to a volatile unsigned int: a fixed register address whose value can change on its own |
| 17 | `unsigned char * volatile p;` | volatile pointer to an unsigned char: the pointer itself can change unexpectedly (not the data) |
| 18 | `unsigned char **buffer_list;` | pointer to a pointer to unsigned char, such as a list of buffers |
| 19 | `void (* const * const table)(void);` | constant pointer to a constant pointer to a function taking nothing and returning nothing |
| 20 | `int *(*funcs[3])(double);` | array of 3 pointers to functions (double) returning pointer to int |
| 21 | `int (*(*p)[3])(char *);` | pointer to an array of 3 pointers to functions (char pointer) returning int |

## Hints

- `int *p[10]` versus `int (*p)[10]`: `[]` binds tighter than `*`, so without parentheses it is an array of pointers.
- Use `typedef` to tame the hard ones:

```c
typedef int (*binop_t)(int, int);
binop_t operations[5];           /* same as #11, much easier to read */

typedef void (*sighandler_t)(int);
sighandler_t signal(int sig, sighandler_t func);    /* same as #8 */
```

- Tools such as `cdecl` (or the website cdecl.org) decode declarations for you.

## Practice questions

1. What is the difference between #16 and #17?

::: answer
In #16 the `const` pointer is fixed and the thing it points to is volatile (typical for a hardware register). In #17 the data is normal but the pointer variable itself is volatile (rare: for example a pointer modified in an interrupt).
:::
