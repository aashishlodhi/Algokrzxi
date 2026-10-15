---
title: Memory alignment, padding and member offsets
summary: Why the compiler inserts slack bytes in structures, and how to reason about struct size and layout.
---

## Alignment

A CPU reads memory in **words** (for example 4 bytes). Data is **aligned** when its address is a multiple of its size:

| Data | Size | Address must be divisible by |
| --- | --- | --- |
| byte | 1 | any address |
| half word | 2 | 2 |
| word | 4 | 4 |
| double word | 8 | 8 |

Aligned access takes one memory cycle. A 4-byte value at address `0x1001` crosses a word boundary, so the CPU needs two reads and has to combine the pieces. Some processors do not allow it at all and raise a fault (for example a HardFault on Cortex-M0).

## Member offset

The **offset** of a member is its distance from the start of the structure.

```c
struct student {
    int   rollno;      /* offset 0,  4 bytes  */
    char  name[20];    /* offset 4,  20 bytes */
    float marks;       /* offset 24, 4 bytes  */
};                     /* total 28 bytes      */
```

You can compute it with the standard macro: `offsetof(struct student, marks)` (from `<stddef.h>`) gives 24.

## Structure padding

To keep every member aligned, the compiler inserts unused **slack bytes** (padding) between members, and at the end.

```c
struct test1 { char a; short b; int c; };   /* a@0, 1 pad, b@2, c@4 -> size 8  */
struct test2 { char a; int c; short b; };   /* a@0, 3 pad, c@4, b@8, 2 pad -> size 12 */
```

The size is rounded up to a multiple of the largest member's alignment so that every element of a **struct array** is also aligned. Without the trailing padding, the `int` in the second element would be misaligned.

::: tip
Order members from largest to smallest to waste less space. `test1` is 8 bytes, while `test2` holds the same members in 12.
:::

## Packing

You can ask the compiler to remove padding:

```c
struct __attribute__((packed)) packet { uint8_t type; uint32_t value; };   /* 5 bytes */
```

Packing saves space and matches wire formats exactly, but access to misaligned members is slower and can fault on some CPUs.

## Common mistakes

::: pitfall
Writing a struct to a file or sending it over a network with `fwrite` or `send`. Padding and byte order differ between compilers and systems, so the other side may misread it. Serialize field by field instead.
:::

## Practice questions

1. What is `sizeof` for `struct { char a; double b; char c; }` on a system where `double` is 8 bytes and 8-aligned?

::: answer
24: `a` at 0, 7 padding, `b` at 8, `c` at 16, then 7 trailing bytes so the size is a multiple of 8.
:::
