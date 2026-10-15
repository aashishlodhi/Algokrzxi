---
title: Arrays and 2D arrays
summary: Contiguous storage, array-pointer equivalence, multi-dimensional arrays and arrays of pointers.
---

## 1D arrays

An array is a collection of elements of the same type in consecutive memory. Elements are numbered from index 0 to n-1. The programmer is responsible for staying inside the bounds, because C does not check them. A static array cannot grow or shrink at runtime.

```c
int arr[5] = {11, 22, 33, 44, 55};   /* at 100, 104, 108, 112, 116 */
int part[5] = {1, 2};                /* the rest are set to 0 */
int auto_size[] = {1, 2, 3};         /* size 3 from the initializer */
```

## Arrays and pointers

In most expressions the array name becomes the address of its first element. Its base address is fixed, so you cannot change it (`arr++` is an error).

| Expression | Value |
| --- | --- |
| `arr` | 100 (address of first element) |
| `*arr` | 11 |
| `arr + 1` | 104 |
| `*(arr + 1)` | 22 |
| `arr[1]` | 22 |
| `1[arr]` | 22 (same as `*(1 + arr)`) |

`a[i]` is defined as `*(a + i)`. That is also why indexes start at 0: the index is the offset from the base address.

## 2D arrays

`int arr[2][3]` is 2 rows of 3 columns, stored row by row.

```c
int arr[2][3] = {{11, 22, 33}, {44, 55, 66}};
int flat[2][3] = {11, 22, 33, 44, 55};      /* fills row by row, the rest 0 */
```

| Expression | Value | Type |
| --- | --- | --- |
| `arr` | 100 | pointer to a row (array of 3 ints) |
| `arr + 1` | 112 | next row (skips 3 ints = 12 bytes) |
| `*(arr + 1)` | 112 | pointer to int (first element of row 1) |
| `*(arr + 1) + 1` | 116 | pointer to int |
| `*(*(arr + 1) + 1)` | 55 | int, same as `arr[1][1]` |

When you leave a dimension out in a declaration or parameter, only the **first** can be omitted: `int a[][3]` is valid, `int a[2][]` is not.

## Array of pointers

```c
int arr[2][3] = {{11, 22, 33}, {44, 55, 66}};
int *p[2] = { *(arr + 1), *arr };       /* p[0] -> row 1, p[1] -> row 0 */
```

Each element of `p` is a pointer, so `p[0][1]` is `55`.

## Common mistakes

::: pitfall
Going past the end of an array (for example `i <= n` instead of `i < n`). It reads or overwrites neighboring memory and is one of the most common firmware bugs.
:::

::: pitfall
Using `sizeof` on an array parameter. Inside a function an array parameter is really a pointer, so `sizeof` gives the pointer size. Pass the length separately.
:::

## Practice questions

1. Given `int a[2][3]` at address 100, what is `a + 1` and what is `*(a + 1) + 1`?

::: answer
`a + 1` is 112 (one row, 12 bytes on). `*(a + 1) + 1` is 116 (second row, one int further).
:::
