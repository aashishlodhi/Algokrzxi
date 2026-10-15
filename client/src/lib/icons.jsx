import { BookOpen, Binary, Brackets, Bug, CircuitBoard, Clock, Code2, Cog, Cpu, FileText, HardDrive, Layers, MemoryStick, Network, Radio, Terminal, Workflow, Zap } from 'lucide-react';

const map = { BookOpen, Binary, Brackets, Bug, CircuitBoard, Clock, Code2, Cog, Cpu, FileText, HardDrive, Layers, MemoryStick, Network, Radio, Terminal, Workflow, Zap };

// module.config.js and navigation.js refer to icons by name; unknown names fall back to BookOpen.
export function Icon({ name, size = 20, ...rest }) {
  const C = map[name] || BookOpen;
  return <C size={size} aria-hidden="true" {...rest} />;
}
