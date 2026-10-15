// Mega menu content. Item fields: title, desc, to, icon, badge ('NEW'), locked, external, cta.
// Anything in /modules is discovered automatically and listed under "Available now" in the first menu.
export const brand = { name: 'Algokrzxi', tagline: 'BUILT BY ENGINEERS, FOR ENGINEERS' };

export const announcement = 'Learn embedded systems in a systematic way. You are on the right path, stay consistent. More modules are coming soon.';

const soon = (title, desc, icon) => ({ title, desc, icon, locked: true });

export const navItems = [
  {
    id: 'modules', title: 'Modules', subtitle: 'All learning tracks', to: '/modules', autoModules: true,
    columns: [
      { heading: 'Planned', items: [soon('C++ for Embedded', 'Classes, templates and what to avoid on small targets', 'Code2'), soon('Python for Hardware', 'Scripting, test rigs and serial tooling', 'Terminal'), soon('Programming Fundamentals', 'Logic, data structures and problem solving', 'Brackets')] },
    ],
  },
  {
    id: 'micro', title: 'Microcontrollers', subtitle: 'Peripherals, registers & drivers', to: '/modules',
    columns: [
      { heading: 'Architectures', items: [soon('ARM Cortex-M', 'Core, exceptions, NVIC and startup code', 'Cpu'), soon('AVR', '8-bit basics, fuses and timers', 'CircuitBoard'), soon('ESP32', 'Dual-core SoC, FreeRTOS and wireless', 'Radio')] },
      { heading: 'Peripherals', items: [soon('GPIO & Timers', 'Pins, PWM, input capture', 'Zap'), soon('ADC & DAC', 'Sampling, resolution and noise', 'Binary'), soon('UART, SPI, I2C', 'Serial buses and their trade-offs', 'Network')] },
    ],
  },
  {
    id: 'os', title: 'Embedded OS', subtitle: 'RTOS concepts & scheduling', to: '/modules',
    columns: [
      { heading: 'RTOS fundamentals', items: [soon('Tasks & Scheduling', 'Priorities, preemption and time slicing', 'Layers'), soon('Synchronization', 'Mutexes, semaphores, priority inversion', 'Workflow'), soon('Memory & Timing', 'Static allocation, ticks and deadlines', 'Clock')] },
    ],
  },
  {
    id: 'prep', title: 'Interview Prep', subtitle: 'Questions & core concepts', to: '/roadmaps',
    columns: [
      { heading: 'Practice', items: [{ title: 'Search all topics', desc: 'Find any lesson or concept in seconds', to: '/search', icon: 'FileText', cta: 'OPEN SEARCH' }, { title: 'Roadmaps', desc: 'A suggested order for every module', to: '/roadmaps', icon: 'Workflow', badge: 'NEW' }, soon('Top Questions', 'Curated interview questions by topic', 'Bug')] },
    ],
  },
];

export const footerLinks = {
  Learn: [{ label: 'All modules', to: '/modules' }, { label: 'Roadmaps', to: '/roadmaps' }, { label: 'Search', to: '/search' }],
  You: [{ label: 'Profile & progress', to: '/profile' }],
};
