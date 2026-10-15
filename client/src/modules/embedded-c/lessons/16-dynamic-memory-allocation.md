---
title: Dynamic memory allocation
summary: malloc, calloc, realloc and free, plus memory leaks, dangling pointers, memcpy and memmove.
---

## Why and where

Dynamic allocation gets memory at runtime, from the **heap**, using functions declared in `stdlib.h`. You decide the size while the program runs, and you are responsible for giving it back.

| Function | What it does | Initial contents |
| --- | --- | --- |
| `void *malloc(size_t bytes)` | allocate a block | garbage |
| `void *calloc(size_t count, size_t size)` | allocate `count` items of `size` bytes | zero |
| `void *realloc(void *ptr, size_t new_size)` | resize a block | old data kept, new part is garbage |
| `void free(void *ptr)` | release a block | |

All allocators return the base address as `void *`, or `NULL` on failure. The pointer variable itself lives on the stack, and points into the heap.

```c
int *p = malloc(5 * sizeof(int));
if (p == NULL) { /* handle failure */ }
for (int i = 0; i < 5; i++) p[i] = i;
free(p);
p = NULL;
```

In C you do not need to cast the result of `malloc`.

## realloc behavior

- **Shrink** (`new_size < old_size`): the data up to the new size is unchanged.
- **Grow**: the old data is unchanged and the added memory is uninitialized.
- If there is free space right after the block, it is extended in place and the same address returns. Otherwise a new block is allocated, the old content is copied, the old block is freed, and the new address returns.
- `realloc(NULL, n)` behaves like `malloc(n)`.

```c
int *tmp = realloc(p, 10 * sizeof(int));
if (tmp != NULL) p = tmp;      /* keep p valid if realloc fails */
```

::: warning
Do not assign `p = realloc(p, n)` directly. If it fails you lose the only pointer to the old block. Also, do not rely on `realloc(p, 0)` acting like `free`: that behavior is implementation-defined.
:::

## Memory leak

Memory that was allocated but never freed, and whose address is lost, is a **leak**. Nothing can use it. A modern OS reclaims it when the program ends, but long-running programs (servers, firmware that never reboots) slowly run out of memory.

```c
int *p = malloc(20);
p = &num;          /* address lost, the 20 bytes can never be freed */
```

On Linux, `valgrind ./a.out` reports leaks.

## Dangling pointer

A pointer holding an address that is no longer valid: after `free`, an uninitialized local pointer, or the address of a local variable returned from a function. Using it can crash (segmentation fault) or silently corrupt data.

```c
free(p);
p = NULL;          /* the fix: no longer dangling */
```

## memcpy and memmove

`memcpy(dest, src, n)` copies `n` bytes. If the regions overlap the behavior is **undefined**. `memmove` handles overlap correctly, as if it used a temporary buffer.

```c
int a[5] = {10, 20, 30, 40, 50};
memmove(a + 2, a, 3 * sizeof(int));   /* a = 10 20 10 20 30 */
```

::: note
In embedded and safety-critical code (MISRA-C), dynamic allocation is usually banned, because it can fragment or fail unpredictably. Static buffers are preferred.
:::

## Practice questions

1. What is the difference between `malloc(n * 4)` and `calloc(n, 4)`?

::: answer
Both allocate `n * 4` bytes, but `calloc` fills the memory with zeros and `malloc` leaves it uninitialized.
:::
