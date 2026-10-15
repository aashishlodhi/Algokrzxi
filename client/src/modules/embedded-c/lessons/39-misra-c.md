---
title: MISRA-C and code quality
summary: The safety-critical C coding standard, its most important rules, and a worked review exercise.
---

## What MISRA-C is

MISRA-C is a set of coding guidelines for safety-critical embedded C. It avoids language features that lead to undefined behavior, makes code clearer, and improves portability. Rules are classified as **Mandatory**, **Required** or **Advisory**, and any deviation must be formally documented. Compliance is checked with static analysis tools such as Polyspace, PC-lint or Coverity.

## Key areas

**Undefined and implementation-defined behavior**
- Rule 1.1: code must conform to the ISO C standard.
- Rule 7.1: octal constants (other than zero) are not allowed.
- Rules 10.x: strict control of implicit and explicit conversions, especially signed/unsigned and floating-point.

**Memory and resources**
- Directive 4.12: no dynamic memory allocation.
- Rule 21.3: `malloc`, `calloc`, `realloc` and `free` shall not be used.
- Rule 17.2: no recursion.

**Functions and errors**
- Directive 4.7: if a function returns error information, check it.
- Rule 17.7: the return value of a non-void function shall be used.
- Rule 8.1 and 8.2: functions need visible prototypes with named, typed parameters.

**Types and naming**
- Directive 4.6: use fixed-width typedefs (`uint32_t`) instead of plain `int`.
- Rule 8.3: declaration and definition types must match exactly.
- Rules 5.x: identifiers must be unique and unambiguous.

**Structure**
- Rule 2.1: assembly must be isolated.
- Rule 8.5: no definitions in header files.
- Rule 8.8: use `static` for internal linkage.
- Rule 8.13: use `const` for pointer parameters that are not modified.
- Rule 15.5: a single point of exit from a function (advisory).
- Rule 21.6: the standard I/O functions (`printf`, and so on) are not used.

Exact numbering differs a little between MISRA-C editions, so check the edition your project uses.

## Review exercise

Review the program below. Find at least 10 to 15 violations and classify each as a safety, maintainability or portability issue. Then rewrite it in a MISRA-friendly style.

```c
#include <stdio.h>
#include <stdlib.h>

#define SIZE 10
#define MAX 100

int global_counter;
int status_flag = 0;

int add(int a, int b);
int add(int a, int b) { return a + b; }

int process(int *arr, int len)
{
    int i;
    int sum = 0;
    if (arr == NULL) return -1;
    for (i = 0; i <= len; i++) { sum += arr[i]; }
    if (sum > MAX) status_flag = 1;
    return sum;
}

void pointer_misuse(void)
{
    int x = 10;
    int *p;
    p = &x;
    *p++;
}

void dangerous_cast(void)
{
    int x = 100;
    char *ptr = (char *)&x;
    *ptr = 0xFF;
}

int main(void)
{
    int arr[SIZE];
    int i;
    for (i = 0; i < SIZE; i++) { arr[i] = i * 2; }
    printf("Sum: %d\n", process(arr, SIZE));
    pointer_misuse();
    dangerous_cast();
    printf("Done\n");
    return 0;
}
```

::: answer
| # | Issue | Category |
| --- | --- | --- |
| 1 | `i <= len` reads one element past the array | Safety |
| 2 | `global_counter` has external linkage, is never used, and is not initialized explicitly | Maintainability |
| 3 | `status_flag` is a global modified as a hidden side effect inside `process` | Safety, maintainability |
| 4 | Magic numbers (`1`, `-1`, `2`) and loose `#define`s without parentheses or type | Maintainability |
| 5 | Plain `int` instead of fixed-width types | Portability |
| 6 | `add` has external linkage but is never used; should be `static` or removed | Maintainability |
| 7 | `process` returns `-1` for an error, which is also a possible valid sum; the caller cannot tell | Safety |
| 8 | No overflow check on `sum` (signed overflow is undefined) | Safety |
| 9 | The `int *arr` parameter is not `const` although it is only read | Maintainability |
| 10 | `*p++` moves a pointer that points to a single object and the read value is unused (pointer arithmetic, dead code) | Safety, maintainability |
| 11 | `(char *)&x` casts between different object pointer types and writes one byte of an `int` | Portability (byte order) |
| 12 | `*ptr = 0xFF` assigns a value outside the range of a signed `char` | Portability |
| 13 | `printf` in embedded code: heavy, needs a runtime, standard I/O is banned | Portability |
| 14 | Return values of `printf` ignored | Maintainability |
| 15 | `<stdlib.h>` included but not used | Maintainability |
:::

A MISRA-friendly rewrite of the useful part:

```c
#include <stddef.h>
#include <stdint.h>

#define ARRAY_LEN  (10U)
#define SUM_LIMIT  (100)

typedef enum { STATUS_OK = 0, STATUS_LIMIT_EXCEEDED, STATUS_BAD_ARG } status_t;

static status_t process(const int32_t *arr, uint32_t len, int32_t *sum_out)
{
    status_t status = STATUS_OK;
    int32_t  sum = 0;
    uint32_t i;

    if ((arr == NULL) || (sum_out == NULL)) {
        status = STATUS_BAD_ARG;
    } else {
        for (i = 0U; i < len; i++) {
            sum += arr[i];
        }
        *sum_out = sum;
        if (sum > SUM_LIMIT) {
            status = STATUS_LIMIT_EXCEEDED;
        }
    }
    return status;              /* single exit */
}

int main(void)
{
    int32_t  data[ARRAY_LEN];
    int32_t  total = 0;
    uint32_t i;
    status_t st;

    for (i = 0U; i < ARRAY_LEN; i++) {
        data[i] = (int32_t)(i * 2U);
    }
    st = process(data, ARRAY_LEN, &total);
    (void)st;                   /* report through the project's UART or log driver */
    return 0;
}
```

The two deliberately bad functions (`pointer_misuse`, `dangerous_cast`) have no valid purpose, so the rewrite drops them. The error code is separate from the result, the loop is bounded, there is no global state, and every parameter and return value is typed and checked.

## Practice questions

1. Why does MISRA ban `malloc` and `free` in embedded code?

::: answer
Heap allocation can fail or fragment at runtime in ways that are hard to predict or test, and a long-running device may eventually run out of memory. Static allocation makes memory use known at build time.
:::
