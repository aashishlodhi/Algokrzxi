---
title: Function calling conventions and the ABI
summary: How arguments are passed, who cleans the stack, and how 32-bit and 64-bit x86 differ.
---

## What a calling convention decides

1. In what order arguments are pushed on the stack (left to right or right to left).
2. Who removes them afterwards: the **caller** or the **callee**.
3. Which CPU registers carry arguments and the return value.

For `int fun(int n1, int n2, int n3)` called as `fun(10, 20, 30)`, the caller and callee must agree on these rules, or the call breaks.

## 32-bit x86

| Convention | Argument order | Cleanup | Notes |
| --- | --- | --- | --- |
| `cdecl` | right to left | caller | default for C. Return value in `EAX` |
| `stdcall` | right to left | callee | used by the Windows API |
| `fastcall` | first two in `ECX`, `EDX`, rest on the stack | callee | |
| `thiscall` | `this` in `ECX`, rest on the stack | callee | C++ member functions only |
| `pascal` | left to right | callee | old, no longer used |

In `cdecl` the caller does the cleanup, which is what makes variable-argument functions like `printf` possible: only the caller knows how many arguments it pushed.

```text
push 30        ; last argument first
push 20
push 10
call fun
add  esp, 16   ; caller removes the arguments (cdecl)
```

In `stdcall` the callee removes the arguments itself (with `ret n`), and the caller does nothing after the call.

## 64-bit x86: two ABIs

On x86-64 most arguments go in registers, so there is less stack traffic.

| | System V (Linux, macOS, BSD) | Microsoft x64 (Windows) |
| --- | --- | --- |
| Integer and pointer arguments | `RDI, RSI, RDX, RCX, R8, R9` | `RCX, RDX, R8, R9` |
| Floating-point arguments | `XMM0` to `XMM7` | `XMM0` to `XMM3` |
| Extra arguments | stack | stack |
| Stack cleanup | caller | caller |
| Shadow space | none | 32 bytes reserved by the caller |
| Return value | `RAX` (`XMM0` for floating-point) | `RAX` (`XMM0` for floating-point) |

```text
mov edi, 3     ; first argument  (System V)
mov esi, 4     ; second argument
call sum
```

## ABI

An **Application Binary Interface** is the low-level contract between compiled code and the system: calling conventions, which registers must be preserved across calls, stack frame layout, data alignment and padding, exception handling and the system-call interface. Code compiled by different compilers can work together only if they follow the same ABI. On embedded ARM this is the **ARM EABI**.

## Observing a convention

```bash
gcc -m32 -S test.c -o test.s      # look at the generated assembly (needs 32-bit support installed)
objdump -d ./test                 # disassemble
```

or run the program in gdb, break in the function and use `info registers` or look at the stack.

## Practice questions

1. Why can `printf` use `cdecl` but a `stdcall` function cannot take a variable number of arguments?

::: answer
In `stdcall` the callee must know how many bytes to remove, which is fixed at compile time. In `cdecl` the caller removes them, and the caller knows how many it pushed.
:::
