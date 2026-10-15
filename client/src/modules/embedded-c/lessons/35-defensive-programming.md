---
title: Defensive programming: a safe string copy
summary: Validate arguments, prevent overflow, guarantee termination, and return clear error codes.
---

## The idea

Defensive programming assumes callers will make mistakes and bad input will arrive. The function protects itself: it validates every argument, never writes outside its buffer, and tells the caller what went wrong.

## The task

Implement `safe_strcpy` without using `strcpy`:

```c
int safe_strcpy(char *dest, size_t dest_size, const char *src);
```

Requirements: return error codes for NULL pointers, prevent buffer overflow, always null-terminate, and validate arguments at runtime.

## A solution

```c
#include <stddef.h>

#define SAFE_OK          0
#define SAFE_ERR_NULL   (-1)
#define SAFE_ERR_SIZE   (-2)
#define SAFE_ERR_TRUNC  (-3)

int safe_strcpy(char *dest, size_t dest_size, const char *src)
{
    size_t i;

    if ((dest == NULL) || (src == NULL)) {
        return SAFE_ERR_NULL;
    }
    if (dest_size == 0U) {
        return SAFE_ERR_SIZE;                 /* no room even for '\0' */
    }

    for (i = 0U; i < (dest_size - 1U); i++) {
        dest[i] = src[i];
        if (src[i] == '\0') {
            return SAFE_OK;                   /* whole string fit */
        }
    }

    dest[dest_size - 1U] = '\0';              /* always terminate */
    return (src[dest_size - 1U] == '\0') ? SAFE_OK : SAFE_ERR_TRUNC;
}
```

Why this works:

- At most `dest_size - 1` characters are written in the loop, leaving room for the terminator.
- If `src` is longer, the copy is cut and the result is still a valid string. The caller learns about it through `SAFE_ERR_TRUNC`.
- The checks happen before any memory is touched.

## Using it

```c
char name[8];
int rc = safe_strcpy(name, sizeof(name), "Sunbeam Institute");
if (rc != SAFE_OK) {
    /* handle: truncated, null pointer, etc. */
}
```

::: tip
Always check the return value. MISRA-C requires it (Directive 4.7 and Rule 17.7), and an error code nobody reads is the same as having none.
:::

## Other defensive habits

- Validate array indexes and lengths before use.
- Initialize every variable and pointer.
- Use `const` for data a function must not change.
- Keep functions small, and return early on invalid input.

## Practice questions

1. Why does the function write `dest[dest_size - 1U] = '\0'` after the loop?

::: answer
If the source is too long, the loop ends without copying a terminator. Setting the last byte guarantees the result is still a valid string.
:::
