---
title: C interview rapid-fire: 20 questions
summary: The 20 classic C interview questions for embedded roles, with concise model answers. Try each before opening the answer.
---

## Questions 1 to 10

### 1. Explain the compilation and execution flow. What do the preprocessor, compiler, linker and loader do?

::: answer
The **preprocessor** expands `#include` and macros and strips comments (`.i`). The **compiler** checks syntax and translates C to assembly (`.s`). The **assembler** produces machine code in an object file (`.o`). The **linker** combines object files and libraries into one executable, resolving symbols. The **loader** (part of the OS) reads the executable into memory, creates the process (text, data, BSS, heap, stack) and starts it at `main`.
:::

### 2. What is the difference between declaration and definition?

::: answer
A declaration introduces a name and its type (`extern int x;`, `int add(int, int);`) and allocates nothing; it may appear many times. A definition allocates storage for a variable (`int x;`) or supplies the body of a function, and must appear exactly once in the program.
:::

### 3. Static versus dynamic memory allocation?

::: answer
Static allocation (globals, statics, locals) has a size fixed at compile time, and the memory is managed automatically (data section or stack). Dynamic allocation (`malloc`, `calloc`, `realloc`) gets heap memory at runtime, in any size, and you must `free` it. Dynamic memory is flexible but can leak, fragment or fail.
:::

### 4. What is the significance of a storage class? Which ones exist?

::: answer
A storage class defines a variable's storage location, initial value, lifetime and scope. The four standard ones are `auto`, `register`, `static` and `extern`.
:::

### 5. Explain `static` for functions and variables. How can you access a static variable from another file?

::: answer
A `static` local keeps its value between calls (stored in the data section, zero by default). A `static` global or function has internal linkage, so it is private to its file. You cannot name a file-static variable from another file. Either remove `static`, or provide a public accessor function in the owning file (a getter/setter, or one that returns a pointer to it).
:::

### 6. What is a pointer? How and when is `const` used with a pointer?

::: answer
A pointer stores a memory address. `const int *p` makes the data read-only through `p`, `int * const p` fixes the pointer, and `const int * const p` fixes both. Use `const` on pointer parameters that the function only reads (for example `const char *src`), and on pointers to read-only tables.
:::

### 7. What are a dangling pointer and a memory leak? How to detect and avoid them?

::: answer
A dangling pointer holds an address that is no longer valid (after `free`, or the address of a returned local). A leak is allocated memory whose address was lost without freeing. Avoid both by setting pointers to `NULL` after `free`, having clear ownership, and freeing on every path. Detect with `valgrind`, AddressSanitizer (`-fsanitize=address`) and static analysis.
:::

### 8. Difference between passing by value and by address? Which arguments cannot be passed by value?

::: answer
By value copies the argument, so the callee cannot modify the caller's variable. By address passes a pointer, so it can. Arrays and functions cannot be passed by value; an array argument becomes a pointer to its first element and a function becomes a function pointer.
:::

### 9. What are the function calling conventions in C and why do they matter?

::: answer
They define argument order, who cleans the stack (caller or callee) and which registers carry arguments and the return value: `cdecl`, `stdcall`, `fastcall` and `thiscall` on 32-bit x86, and the System V and Microsoft ABIs on x86-64. Caller and callee must agree, which is what makes separately compiled code and libraries work together.
:::

### 10. What are structure member alignment, padding and data packing? Why are slack bytes added?

::: answer
Alignment places each member at an address that is a multiple of its size so the CPU can access it in one cycle. The compiler adds unused slack (padding) bytes between members, and at the end of the struct so arrays stay aligned. Packing (`__attribute__((packed))`) removes the padding at the cost of slower, possibly faulting, access.
:::

## Questions 11 to 20

### 11. What is an array? What are its limitations? Why does the index begin at zero?

::: answer
An array is a collection of same-typed elements in contiguous memory. Limits: fixed size, one type, no bounds checking, cannot be assigned or passed by value. The index starts at 0 because `a[i]` means `*(a + i)`: the index is the offset from the base address, and the first element is at offset 0.
:::

### 12. Write a function to reverse a string and check for a palindrome.

::: answer
```c
#include <string.h>

void reverse(char *s)
{
    size_t i = 0U, j = strlen(s);
    if (j == 0U) { return; }
    j--;
    while (i < j) {
        char t = s[i]; s[i] = s[j]; s[j] = t;
        i++; j--;
    }
}

int is_palindrome(const char *s)
{
    size_t lo = 0U, hi = strlen(s);
    if (hi == 0U) { return 1; }
    hi--;
    while (lo < hi) {
        if (s[lo] != s[hi]) { return 0; }
        lo++; hi--;
    }
    return 1;
}
```
:::

### 13. What is the difference between a macro and a function?

::: answer
A macro is text substitution by the preprocessor: no type checking, no call overhead, code repeated at each use, and arguments may be evaluated more than once. A function is compiled once, type-checked, easier to debug, and has call overhead (which `inline` can remove).
:::

### 14. Which are the bitwise operators? Write macros to set, clear and toggle the nth bit.

::: answer
`&`, `|`, `^`, `~`, `<<`, `>>`.
```c
#define SET_BIT(x, n)    ((x) |=  (1u << (n)))
#define CLEAR_BIT(x, n)  ((x) &= ~(1u << (n)))
#define TOGGLE_BIT(x, n) ((x) ^=  (1u << (n)))
```
:::

### 15. What is the difference between a structure and a union?

::: answer
In a struct every member has its own storage and the size is at least the sum of the members. In a union all members share one block of memory, the size is that of the largest member, and only the last written member is meaningful.
:::

### 16. What is a function pointer? How do you declare and use one?

::: answer
A variable holding a function's address. `int (*fp)(int, int) = add;` then `fp(2, 3)` or `(*fp)(2, 3)`. Used for callbacks, interrupt vector tables, state machines and driver interfaces.
:::

### 17. Explain `volatile`. What is the significance of the "static extern volatile" combination?

::: answer
`volatile` tells the compiler a variable may change outside normal program flow (hardware register, ISR, another thread), so every read and write must actually be performed and not optimized away. Note that `static` and `extern` cannot appear together on one declaration (a declaration has only one storage class). The meaningful combinations are `static volatile` (a file-private variable shared with an ISR or hardware) and `extern volatile` (a volatile object defined in another file, for example a hardware register or flag shared across modules).
:::

### 18. What is an optimization flag in GCC? What types of optimization exist?

::: answer
A flag that tells the compiler how hard to optimize. `-O0` none (best for debugging), `-O1` basic, `-O2` more (common for release), `-O3` most aggressive (inlining, loop transformations), `-Os` optimize for size (typical for firmware), and `-Og` for debugging-friendly optimization. Optimizations include constant folding, dead-code elimination, inlining, loop unrolling and register allocation.
:::

### 19. Write a function to print the Fibonacci series with and without recursion.

::: answer
```c
void fib_loop(int n)
{
    unsigned a = 0U, b = 1U;
    for (int i = 0; i < n; i++) {
        printf("%u ", a);
        unsigned next = a + b;
        a = b;
        b = next;
    }
}

unsigned fib_rec(int n)           /* n-th term; print in a loop */
{
    return (n < 2) ? (unsigned)n : fib_rec(n - 1) + fib_rec(n - 2);
}
/* for (i = 0; i < n; i++) printf("%u ", fib_rec(i)); */
```
:::

### 20. Write a function to swap two arguments without using arithmetic or assignment operators.

::: answer
Strictly, you cannot use `=` or `^=`, so copy memory with `memcpy`:
```c
#include <string.h>

void swap(int *a, int *b)
{
    int tmp;
    memcpy(&tmp, a, sizeof tmp);
    memcpy(a, b, sizeof tmp);
    memcpy(b, &tmp, sizeof tmp);
}
```
The usual textbook answer is the XOR swap (`*a ^= *b; *b ^= *a; *a ^= *b;`), which uses no arithmetic but does use compound assignment, and fails when `a` and `b` point to the same object.
:::
