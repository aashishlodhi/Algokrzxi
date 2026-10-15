---
title: const, volatile and void pointers
summary: How const behaves with pointers (and with ++ and *), what volatile promises, and generic void pointers.
---

## const

`const` tells the compiler the object is not meant to be modified, so operators like `=`, `++` and `+=` on it are rejected. It must be initialized at declaration.

```c
const int num = 11;
/* num = 20;  num++;  num += 20;   -> compile errors */
```

::: note
A const object can still be changed through a pointer after a cast, but that is undefined behavior if the object was defined `const`. Do not do it.
:::

## const with pointers

Read the declaration from the name outward. What touches `const` is the thing that is constant.

| Declaration | Meaning | Change data? | Change pointer? |
| --- | --- | --- | --- |
| `const int *p` (or `int const *p`) | pointer to constant int | no | yes |
| `int * const p` | constant pointer to int | yes | no |
| `const int * const p` | constant pointer to constant int | no | no |

## Operator combinations

`++` after (postfix) binds tighter than `*`. Prefix `++` and `*` group right to left.

| Expression | Means | `const int *p` | `int * const p` | `const int * const p` |
| --- | --- | --- | --- | --- |
| `*p++` | read `*p`, then `p++` | ok | error | error |
| `++*p` | increment the data | error | ok | error |
| `*++p` | move pointer, then read | ok | error | error |
| `++*p++` | increment data at old `p`, then move `p` | error | error | error |

## void pointer

A `void *` is a generic pointer that can hold the address of any type. It has no scale factor, so you must cast it before dereferencing, and you cannot do arithmetic on it in standard C.

```c
int num = 10;
void *vp = &num;
printf("%d\n", *(int *)vp);     /* cast, then dereference */
```

`malloc` returns `void *`, and `NULL` is conventionally `((void *)0)`.

## volatile

`volatile` tells the compiler a value can change outside the program's control (a hardware register, or a variable changed in an interrupt), so every access must really happen. It is covered in detail in the volatile and registers lesson.

## Practice questions

1. What is the difference between `const char *s` and `char * const s`?

::: answer
The first points to constant characters (you can repoint `s`, not change the text). The second is a constant pointer (you can change the text, not repoint `s`).
:::
