---
title: Strings and command-line arguments
summary: Null-terminated character arrays, safe input, the string.h functions, and argc/argv.
---

## Strings in C

A string is a character array ending with the null character `'\0'` (ASCII value 0). There is no string type: the terminator is how functions know where the string ends.

```c
char a[] = "abc";            /* 4 bytes: 'a' 'b' 'c' '\0' */
char b[6] = "abcde";         /* 6 bytes, room for the terminator */
char c[5] = "abcde";         /* legal C, but NO terminator: not a string! */
```

::: pitfall
Always reserve one extra byte for `'\0'`. Printing or measuring an unterminated array reads past its end.
:::

## Input and output

```c
char str[20];
scanf("%19s", str);          /* one word; the width limit prevents overflow */
printf("%s\n", str);
fgets(str, sizeof(str), stdin);   /* a whole line, bounded */
puts(str);
scanf("%[^\n]", str);        /* a whole line, but add a width: %19[^\n] */
```

::: warning
Do not use `gets()`. It has no length limit, and it was removed from the language in C11. Use `fgets()`.
:::

## string.h functions

| Function | Purpose |
| --- | --- |
| `size_t strlen(const char *s)` | length, not counting `'\0'` |
| `char *strcpy(char *dest, const char *src)` | copy `src` into `dest` |
| `char *strcat(char *dest, const char *src)` | append `src` to `dest` |
| `int strcmp(const char *a, const char *b)` | 0 if equal, negative or positive otherwise |
| `char *strchr(const char *s, int ch)` | first occurrence of a character |
| `char *strstr(const char *s, const char *sub)` | first occurrence of a substring |

`strcpy` and `strcat` do not check the destination size. Bounded alternatives or your own checked copy are safer (see the defensive programming lesson).

`strrev` and `strcmpi` appear in some course notes, but they are **not standard C**. Write your own reverse function (the interview lesson has one) and use `strcasecmp` on POSIX systems.

## Array of pointers to strings

```c
const char *arr[] = {"one", "two", "three", "four"};
for (int i = 0; i < 4; i++)
    puts(arr[i]);
```

Use `const char *` because string literals are read-only.

## Command-line arguments

Information passed to the program when it starts.

```c
int main(int argc, char *argv[])
{
    for (int i = 0; i < argc; i++)
        printf("argv[%d] = %s\n", i, argv[i]);
    return 0;
}
```

```bash
./a.out sunbeam pune karad
# argc = 4; argv[0] = "./a.out", argv[1] = "sunbeam", ...
```

- `argc` is the argument count (including the program name).
- `argv` is an array of argument strings, with `argv[argc]` being `NULL`.
- Many systems also pass an environment array as a third parameter (`char *envp[]`), but that form is not part of standard C.
- Arguments are text. Convert numbers with `strtol` or `atoi`.

## Practice questions

1. How many bytes does `char s[] = "hello";` occupy?

::: answer
6: five letters plus the terminating `'\0'`.
:::
