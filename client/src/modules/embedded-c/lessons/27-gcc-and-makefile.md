---
title: gcc options and Makefiles
summary: The compiler flags you use every day, and a real Makefile with build, clean, debug and release targets.
---

## The GCC toolchain

GCC is a set of tools used in sequence (a **tool-chain**): preprocessor (`cpp`), compiler (`cc1`), assembler (`as`), linker (`ld`), debugger (`gdb`), `objdump` and more. The command `gcc` is a front end that drives them.

| Flag | Effect |
| --- | --- |
| `-o file` | name the output file |
| `-E` | stop after preprocessing |
| `-S` | stop after compiling, give assembly (`.s`) |
| `-c` | stop after assembling, give an object file (`.o`) |
| `-std=c89`, `c99`, `gnu99` | pick the C standard (`gnu` variants add GNU extensions) |
| `-g` | include debug information |
| `-Wall` | show common warnings |
| `-Werror` | treat warnings as errors (the build fails) |
| `-O0` to `-O3`, `-Os` | optimization: none, ..., most, optimize for size |
| `-DNAME=value` | define a macro, for example `-DPI=3.142` |
| `-I dir` | add a header search directory |
| `-L dir` | add a library search directory |
| `-lname` | link `libname` (`-lm` for the math library, `libm.so`) |

`libc` is linked by default. The math library is not, so a program using `sqrt` or `pow` needs `-lm`.

## Makefile basics

`make` rebuilds only what changed, based on file timestamps. A rule looks like:

```make
target: prerequisites
	recipe
```

Recipe lines **must start with a Tab**.

Automatic variables are recomputed for each rule and work only in the recipe:

| Variable | Meaning |
| --- | --- |
| `$@` | the target of the rule |
| `$<` | the first prerequisite |
| `$^` | all the prerequisites, separated by spaces |

`%` in a pattern rule matches one or more characters (the stem), for example `%.o: %.c`.

## A project Makefile

For a project laid out as `src/`, `include/` and `tests/`:

```make
CC      = gcc
CFLAGS  = -Wall -Wextra -I include
SRC     = $(wildcard src/*.c)
OBJ     = $(patsubst src/%.c,build/%.o,$(SRC))
TARGET  = app.out

.PHONY: all build debug release clean builddir

all: build
build: $(TARGET)

debug: CFLAGS += -g -O0
debug: clean $(TARGET)

release: CFLAGS += -O2 -DNDEBUG
release: clean $(TARGET)

$(TARGET): $(OBJ)
	$(CC) $^ -o $@

build/%.o: src/%.c | builddir
	$(CC) $(CFLAGS) -c $< -o $@

builddir:
	mkdir -p build

clean:
	rm -rf build $(TARGET)
```

Use `make debug` for a debuggable build, `make release` for an optimized one, and `make clean` to remove build output.

## Common mistakes

::: pitfall
Spaces instead of a Tab before a recipe line gives "missing separator". Configure your editor to insert a real Tab in Makefiles.
:::

::: pitfall
Forgetting header dependencies. If `foo.o` depends on `foo.h`, list it, or let GCC generate dependencies with `-MMD`. Otherwise editing a header does not rebuild.
:::

## Practice questions

1. What does `gcc -Wall -Werror -O2 -g main.c -o main.out` do?

::: answer
Compiles with common warnings turned into errors, level 2 optimization and debug information, producing `main.out`. If any warning occurs, no output is produced.
:::
