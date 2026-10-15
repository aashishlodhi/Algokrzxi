import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const Ctx = createContext({ open: false, setOpen: () => {} });

export function PaletteProvider({ children }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen((o) => !o); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  const value = useMemo(() => ({ open, setOpen }), [open]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const usePalette = () => useContext(Ctx);
