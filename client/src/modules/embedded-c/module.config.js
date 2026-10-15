export default {
  slug: 'embedded-c',
  title: 'Embedded C',
  subtitle: 'From first program to firmware practice: C fundamentals, memory, bits, tooling and interview prep',
  icon: 'Code2',
  level: 'beginner',
  order: 1,
  status: 'live',
  author: { name: 'Algokrzxi', role: 'Embedded C course notes', avatar: '' },
  sections: [
    {
      id: 'getting-started', title: 'Getting Started', icon: 'Terminal',
      lessons: [
        { id: 'c-and-toolchain', title: 'C and the GNU toolchain', file: '01-c-and-toolchain.md', minutes: 7, tags: ['gcc', 'preprocessor', 'linker'] },
        { id: 'vim-and-first-program', title: 'Writing and running code with vim', file: '02-vim-and-first-program.md', minutes: 5, tags: ['vim', 'compile'] },
        { id: 'variables-and-io', title: 'Variables, data types and basic I/O', file: '03-variables-and-io.md', minutes: 9, tags: ['printf', 'scanf', 'ascii', 'data types'] },
      ],
    },
    {
      id: 'control-flow', title: 'Operators and Control Flow', icon: 'Workflow',
      lessons: [
        { id: 'operators-and-conversion', title: 'Operators, precedence and type conversion', file: '04-operators-and-conversion.md', minutes: 8, tags: ['precedence', 'typecast'] },
        { id: 'decision-control', title: 'Decision control: if, ternary and switch', file: '05-decision-control.md', minutes: 6, tags: ['if', 'switch'] },
        { id: 'loops-and-jumps', title: 'Loops and jump statements', file: '06-loops-and-jumps.md', minutes: 6, tags: ['while', 'for', 'break', 'goto'] },
        { id: 'typedef-and-enum', title: 'typedef and enum', file: '07-typedef-and-enum.md', minutes: 4, tags: ['typedef', 'enum'] },
      ],
    },
    {
      id: 'functions-storage', title: 'Functions and Storage', icon: 'Layers',
      lessons: [
        { id: 'functions-and-call-stack', title: 'Functions and the call stack', file: '08-functions-and-call-stack.md', minutes: 7, tags: ['stack frame', 'prototype'] },
        { id: 'recursion', title: 'Recursion', file: '09-recursion.md', minutes: 6, tags: ['factorial', 'stack overflow'] },
        { id: 'storage-classes', title: 'Storage classes', file: '10-storage-classes.md', minutes: 6, tags: ['static', 'extern', 'register'] },
      ],
    },
    {
      id: 'pointers-memory', title: 'Pointers, Arrays and Memory', icon: 'MemoryStick',
      lessons: [
        { id: 'pointers-basics', title: 'Pointers', file: '11-pointers-basics.md', minutes: 8, tags: ['pointer arithmetic', 'null', 'scale factor'] },
        { id: 'call-by-value-and-address', title: 'Call by value and call by address', file: '12-call-by-value-and-address.md', minutes: 5, tags: ['swap', 'scanf'] },
        { id: 'arrays-and-2d-arrays', title: 'Arrays and 2D arrays', file: '13-arrays-and-2d-arrays.md', minutes: 8, tags: ['array', '2d', 'array of pointers'] },
        { id: 'strings-and-cli-args', title: 'Strings and command-line arguments', file: '14-strings-and-cli-args.md', minutes: 8, tags: ['string', 'argv', 'fgets'] },
        { id: 'type-qualifiers', title: 'const, volatile and void pointers', file: '15-type-qualifiers.md', minutes: 7, tags: ['const', 'void pointer'] },
        { id: 'dynamic-memory-allocation', title: 'Dynamic memory allocation', file: '16-dynamic-memory-allocation.md', minutes: 9, tags: ['malloc', 'calloc', 'realloc', 'leak', 'dangling'] },
        { id: 'function-pointers', title: 'Function pointers', file: '17-function-pointers.md', minutes: 6, tags: ['callback', 'vector table'] },
      ],
    },
    {
      id: 'data-bits', title: 'Data Representation and Bits', icon: 'Binary',
      lessons: [
        { id: 'fixed-width-types', title: 'Fixed-width integer types', file: '18-fixed-width-types.md', minutes: 6, tags: ['stdint', 'overflow'] },
        { id: 'signed-and-unsigned', title: 'Signed and unsigned numbers', file: '19-signed-and-unsigned.md', minutes: 6, tags: ['twos complement'] },
        { id: 'bitwise-operators', title: 'Bitwise operators', file: '20-bitwise-operators.md', minutes: 9, tags: ['and', 'xor', 'shift', 'collatz'] },
        { id: 'bit-manipulation', title: 'Bit manipulation for registers', file: '21-bit-manipulation.md', minutes: 9, tags: ['set bit', 'mask', 'parity'] },
        { id: 'endianness', title: 'Endianness', file: '22-endianness.md', minutes: 5, tags: ['little endian', 'big endian'] },
        { id: 'alignment-and-padding', title: 'Memory alignment, padding and member offsets', file: '23-alignment-and-padding.md', minutes: 8, tags: ['padding', 'offsetof', 'packed'] },
        { id: 'structures-unions-bitfields', title: 'Structures, unions and bit-fields', file: '24-structures-unions-bitfields.md', minutes: 8, tags: ['struct', 'union', 'bitfield'] },
      ],
    },
    {
      id: 'preproc-files', title: 'Preprocessor and Files', icon: 'FileText',
      lessons: [
        { id: 'preprocessor-and-macros', title: 'The preprocessor and macros', file: '25-preprocessor-and-macros.md', minutes: 8, tags: ['define', 'ifdef', 'include guard'] },
        { id: 'file-io', title: 'File handling', file: '26-file-io.md', minutes: 9, tags: ['fopen', 'fread', 'fseek'] },
      ],
    },
    {
      id: 'build-linking', title: 'Build, Debug and Linking', icon: 'Cog',
      lessons: [
        { id: 'gcc-and-makefile', title: 'gcc options and Makefiles', file: '27-gcc-and-makefile.md', minutes: 9, tags: ['make', 'gcc flags'] },
        { id: 'debugging-with-gdb', title: 'Debugging with gdb', file: '28-debugging-with-gdb.md', minutes: 5, tags: ['gdb', 'breakpoint'] },
        { id: 'static-and-dynamic-libraries', title: 'Static and dynamic libraries', file: '29-static-and-dynamic-libraries.md', minutes: 8, tags: ['ar', 'shared object', 'ldd'] },
        { id: 'executables-and-processes', title: 'Executable sections, programs and processes', file: '30-executables-and-processes.md', minutes: 6, tags: ['elf', 'bss', 'loader'] },
        { id: 'calling-conventions', title: 'Function calling conventions and the ABI', file: '31-calling-conventions.md', minutes: 8, tags: ['cdecl', 'abi'] },
        { id: 'variadic-functions', title: 'Variadic functions', file: '32-variadic-functions.md', minutes: 6, tags: ['stdarg', 'printf'] },
      ],
    },
    {
      id: 'embedded-practice', title: 'Embedded Practices', icon: 'Cpu',
      lessons: [
        { id: 'volatile-and-registers', title: 'volatile and memory-mapped registers', file: '33-volatile-and-registers.md', minutes: 8, tags: ['volatile', 'mmio'] },
        { id: 'interrupts-and-shared-data', title: 'Interrupts and shared data', file: '34-interrupts-and-shared-data.md', minutes: 9, tags: ['isr', 'critical section'] },
        { id: 'defensive-programming', title: 'Defensive programming: a safe string copy', file: '35-defensive-programming.md', minutes: 6, tags: ['safe strcpy', 'validation'] },
        { id: 'stack-anatomy-lab', title: 'Stack anatomy lab', file: '36-stack-anatomy-lab.md', minutes: 6, tags: ['stack frame', 'return address'] },
        { id: 'ring-buffer', title: 'Ring buffer (circular queue)', file: '37-ring-buffer.md', minutes: 7, tags: ['fifo', 'circular'] },
        { id: 'state-machines', title: 'Finite state machines: a traffic light', file: '38-state-machines.md', minutes: 7, tags: ['fsm', 'state'] },
        { id: 'misra-c', title: 'MISRA-C and code quality', file: '39-misra-c.md', minutes: 9, tags: ['misra', 'static analysis'] },
      ],
    },
    {
      id: 'interview', title: 'Interview Preparation', icon: 'Bug',
      lessons: [
        { id: 'pointer-declarations', title: 'Reading complex pointer declarations', file: '40-pointer-declarations.md', minutes: 8, tags: ['pointer', 'function pointer', 'trap sheet'] },
        { id: 'rapid-fire-questions', title: 'C interview rapid-fire: 20 questions', file: '41-rapid-fire-questions.md', minutes: 15, tags: ['interview', 'questions'] },
      ],
    },
  ],
};
