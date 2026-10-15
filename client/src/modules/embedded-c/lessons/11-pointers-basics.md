---
title: Pointers
summary: Addresses, the & and * operators, pointer-to-pointer, NULL, scale factor and pointer arithmetic.
---

## What a pointer is

A pointer is a variable that stores the memory address of another variable. It is a derived data type. The size of a pointer depends on the architecture, not on what it points to: 4 bytes on a 32-bit system, 8 on a 64-bit system (some small microcontrollers use 2).

Two operators:

- `&` is the **address-of** operator.
- `*` is the **dereference** (value-at) operator.

```c
double d = 1.2;
double *p = &d;               /* p holds the address of d */
printf("%lf\n", *p);          /* 1.2 */
*p = 3.4;                     /* changes d */
```

## Pointer to pointer

```c
double  a  = 1.2;
double *p  = &a;
double **pp = &p;

/* a   = 1.2   &a  = 100
   p   = 100   *p  = 1.2   &p  = 200
   pp  = 200   *pp = 100   **pp = 1.2   &pp = 300 */
```

The **level of indirection** is the number of `*` needed to reach the value.

## NULL and wild pointers

- A **wild pointer** is declared but not initialized: `int *p;` holds garbage.
- A **NULL pointer** points to nothing: `int *p = NULL;`. Always initialize pointers, and check for `NULL` before using them.

## Scale factor and pointer arithmetic

The size of the pointed-to type is the **scale factor**. It is how many bytes are read or written when you dereference, and how far arithmetic moves.

| Expression | Meaning |
| --- | --- |
| `ptr + n` | address `ptr + n * sizeof(*ptr)` |
| `ptr - n` | address `ptr - n * sizeof(*ptr)` |
| `ptr1 - ptr2` | number of elements between them (byte difference divided by scale factor) |

You can add or subtract an integer, use `++` and `--`, and subtract two pointers. You cannot add two pointers, and multiplying or dividing pointers is meaningless.

```c
int arr[3] = {10, 20, 30};
int *p = arr;
p++;                 /* now points at arr[1], 4 bytes further on a 4-byte int system */
```

## Common mistakes

::: pitfall
Dereferencing an uninitialized or NULL pointer. On Linux it shows up as a segmentation fault. On a microcontroller without memory protection it may silently corrupt memory.
:::

::: pitfall
Using `ptr1 - ptr2` on pointers that are not into the same array. The result is undefined.
:::

## Practice questions

1. If `int *p` holds address 100 and `int` is 4 bytes, what is `p + 3`?

::: answer
112, because it moves by 3 times the scale factor of 4 bytes.
:::
