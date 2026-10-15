---
title: Static and dynamic libraries
summary: How linking works, how to build both kinds of library with gcc, and how they compare.
---

## Libraries, headers and linking

A **header file** (`.h`) **declares** functions. A **library file** (`.a` or `.so`) **defines** them. A call to `printf` needs `stdio.h` at compile time and `libc` at link time. Likewise `sqrt` needs `math.h` and `libm`.

Linking combines object files into the final executable. It can happen at two times:

- **Static linking** (compile time): the linker copies the library code used by the program into the executable. The file is larger, but needs nothing else to run.
- **Dynamic linking** (run time): the executable only records the library name. The library is loaded and linked when the program starts, and several programs share one copy in memory. The executable is smaller.

| | Static (`.a`, `.lib`) | Dynamic (`.so`, `.dll`) |
| --- | --- | --- |
| Also called | archive | shared object |
| Linked | at build time | at program start |
| Executable size | larger | smaller |
| Update a library | rebuild every program | replace the library file |
| Needs library at runtime | no | yes |

## Build a static library

```bash
gcc -c add.c sub.c                       # compile sources
ar rs libmymath.a add.o sub.o            # archive the object files
gcc -I . -c demo.c                       # compile the program (mymath.h is in .)
gcc -o demo demo.o libmymath.a           # link the library
# or:  gcc -o demo -L . demo.o -lmymath
./demo
```

## Build a shared library

```bash
gcc -fPIC -c add.c sub.c                 # position-independent code
gcc -shared -o libmymath.so add.o sub.o  # create the shared object
gcc -o demo demo.o -L . -lmymath         # link against it
```

At run time the loader must find `libmymath.so`. Either install it in a standard directory (such as `/usr/local/lib`) and run `sudo ldconfig`, or point to it while testing:

```bash
LD_LIBRARY_PATH=. ./demo
```

`ldd ./demo` lists the shared libraries a program needs.

## Comparing the two

```bash
gcc demo.c -o demo_dyn
gcc -static demo.c -o demo_static
ls -l demo_dyn demo_static               # compare file sizes
ldd demo_dyn                             # lists libc.so.6 and friends
ldd demo_static                          # "not a dynamic executable"
```

The static one is much larger because libc is inside it. This is a good experiment to run yourself.

## Common mistakes

::: pitfall
Putting the library before the object that needs it: `gcc -lmymath demo.o`. With static libraries the linker scans left to right, so list objects first and libraries after.
:::

::: pitfall
"error while loading shared libraries: libmymath.so". The loader cannot find the library. Use `ldconfig`, `LD_LIBRARY_PATH` or an rpath.
:::

## Practice questions

1. Why is `-fPIC` needed for a shared library?

::: answer
The library can be loaded at a different address in each process, so its code must not depend on a fixed address. Position-independent code works at any address.
:::
