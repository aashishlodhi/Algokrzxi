---
title: Variadic functions
summary: Writing functions that take a variable number of arguments with stdarg.h, and a custom printf.
---

## The stdarg.h macros

A variadic function has at least one named parameter, then `...`.

| Macro | Purpose |
| --- | --- |
| `va_list` | the type that walks the arguments |
| `va_start(ap, last)` | start, where `last` is the last named parameter |
| `va_arg(ap, type)` | fetch the next argument as `type` |
| `va_end(ap)` | clean up |

## Sum of N numbers

```c
#include <stdarg.h>
#include <stdio.h>

int sum(int count, ...)
{
    va_list args;
    va_start(args, count);

    int total = 0;
    for (int i = 0; i < count; i++)
        total += va_arg(args, int);

    va_end(args);
    return total;
}

printf("%d\n", sum(3, 3, 4, 5));        /* 12 */
printf("%d\n", sum(4, 10, 20, 30, 40)); /* 100 */
```

The function cannot know how many arguments follow, so you must tell it: here with `count`, in `printf` through the format string.

## Mixed types and promotions

Arguments matched by `...` go through the default promotions: `char` and `short` become `int`, and `float` becomes `double`. So you fetch them as `int` and `double`:

```c
void print_values(int n, ...)
{
    va_list args;
    va_start(args, n);
    printf("int: %d\n",    va_arg(args, int));
    printf("double: %f\n", va_arg(args, double));
    printf("char: %c\n",   va_arg(args, int));     /* char arrives as int */
    va_end(args);
}

print_values(3, 42, 3.14, 'A');
```

## A small printf

```c
void my_printf(const char *format, ...)
{
    va_list args;
    va_start(args, format);

    for (const char *p = format; *p != '\0'; p++) {
        if (*p == '%' && *(p + 1) != '\0') {
            p++;
            switch (*p) {
                case 'd': printf("%d", va_arg(args, int));              break;
                case 'f': printf("%f", va_arg(args, double));           break;
                case 'c': putchar(va_arg(args, int));                   break;
                case 's': printf("%s", va_arg(args, const char *));     break;
                default:  putchar('%'); putchar(*p);                    break;
            }
        } else {
            putchar(*p);
        }
    }
    va_end(args);
}

my_printf("Hello %s! Score %d, %f, grade %c\n", "Alice", 95, 92.5, 'A');
```

## Limitations

- No type safety: asking for the wrong type is undefined behavior.
- No built-in way to know the argument count.
- You cannot pass a struct directly by `va_arg` conveniently across ABIs; pass a pointer.

::: warning
In embedded and MISRA-C code variadic functions are restricted, because the compiler cannot check them. If you write one, annotate it so the compiler checks calls, for example `__attribute__((format(printf, 1, 2)))` with GCC.
:::

## Practice questions

1. Why do you read a `char` argument with `va_arg(args, int)`?

::: answer
Because a `char` passed through `...` is promoted to `int`. Reading it as `char` is undefined behavior.
:::
