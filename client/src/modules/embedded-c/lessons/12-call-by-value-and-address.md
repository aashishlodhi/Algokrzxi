---
title: Call by value and call by address
summary: How arguments are passed, and why scanf needs &.
---

## Call by value

The formal argument has the same type as the actual argument, and the actual value is **copied** into it. Changes made inside the function do not affect the caller's variable. Copying large types costs time and stack space.

```c
void bad_swap(int a, int b)
{
    int t = a; a = b; b = t;     /* swaps only the copies */
}
```

## Call by address (reference)

The formal argument is a **pointer**. The caller passes the address, so the function can read and modify the original variable. A pointer has the same size regardless of the data type it points to.

```c
void swap(int *a, int *b)
{
    int t = *a;
    *a = *b;
    *b = t;
}

int x = 10, y = 20;
swap(&x, &y);                    /* x = 20, y = 10 */
```

`scanf` works the same way: it needs the address of your variable so it can store the input there.

```c
void accept_number(int *p)
{
    printf("Specify number\n");
    scanf("%d", p);              /* p already holds the address */
}

int main(void)
{
    int num;
    accept_number(&num);
    printf("Number = %d\n", num);
    return 0;
}
```

## Comparison

| | By value | By address |
| --- | --- | --- |
| Formal argument | same type as actual | pointer to that type |
| Caller's variable changed? | no | yes |
| Cost | copies the value | copies only an address |
| Used for | most types | outputs, large data, arrays and functions |

Arrays and functions can only be passed by address (an array name becomes a pointer to its first element).

## Common mistakes

::: pitfall
Passing `&x` where `x` is already a pointer, or forgetting `&` for a plain variable. Check each level of indirection.
:::

## Practice questions

1. Why can `swap(int a, int b)` not swap the caller's variables?

::: answer
It receives copies. Only a function that receives addresses can change the originals.
:::
