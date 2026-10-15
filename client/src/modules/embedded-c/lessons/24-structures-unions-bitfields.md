---
title: Structures, unions and bit-fields
summary: Grouping data with struct, overlapping it with union, and packing flags with bit-fields.
---

## Structures

A `struct` groups variables of different types under one name. Members are stored one after another (with padding). Use `.` on a variable and `->` on a pointer.

```c
typedef struct {
    int   roll;
    char  name[20];
    float per;
} stud_t;

stud_t s = { 1, "Ann", 90.5f };
stud_t *p = &s;
printf("%d %s\n", s.roll, p->name);     /* p->name is (*p).name */
```

A struct can be copied by assignment (`s2 = s;`), passed to a function by value, or passed by pointer to avoid copying. Arrays of structures work like any array.

## Unions

All members of a `union` share the **same memory**. Its size is that of the largest member (plus any padding). Only one member holds a meaningful value at a time.

```c
union data {
    uint32_t word;
    uint8_t  bytes[4];
};

union data d;
d.word = 0x11223344u;
printf("%02X\n", d.bytes[0]);     /* 44 on a little-endian system */
```

Use a union to view the same bytes in different ways (for example, to inspect byte order), or to store alternatives that never occur together.

| | struct | union |
| --- | --- | --- |
| Memory | sum of members (plus padding) | size of the largest member |
| Members at same time | all valid | only the last written |
| Offsets | increasing | all 0 |

## Bit-fields

A bit-field lets you name a group of bits inside a struct or union.

```c
struct flags {
    unsigned int ready   : 1;
    unsigned int error   : 1;
    unsigned int mode    : 3;
    unsigned int         : 3;     /* unnamed padding */
};

struct flags f = {0};
f.mode = 5;
f.ready = 1;
```

Rules to remember:

- The value must fit in the width (assigning 8 to a 3-bit field is wrong).
- You cannot take the address of a bit-field.
- Bit order, padding and packing are **implementation-defined**.

::: warning
Do not use bit-fields to match a hardware register layout if you need the code to be portable across compilers. The standard does not fix their layout. Masks and shifts are the portable way, which is why many drivers use them instead.
:::

## Common mistakes

::: pitfall
Reading a different union member than the one last written and expecting a specific number. You are reinterpreting the bytes, so the result depends on size and byte order.
:::

## Practice questions

1. What is the size of `union { char c; int i; double d; }` where `double` is 8 bytes?

::: answer
8 bytes, the size of the largest member.
:::
