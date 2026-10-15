import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { usePalette } from '../../context/PaletteContext.jsx';
import { searchAll } from '../../lib/modules.js';
import styles from './CommandPalette.module.css';

export default function CommandPalette() {
  const { open, setOpen } = usePalette();
  const [q, setQ] = useState('');
  const [cursor, setCursor] = useState(0);
  const input = useRef(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const results = searchAll(q);

  useEffect(() => { setOpen(false); }, [pathname, setOpen]);
  useEffect(() => { if (open) { setQ(''); setCursor(0); setTimeout(() => input.current?.focus(), 0); } }, [open]);
  useEffect(() => setCursor(0), [q]);

  if (!open) return null;
  const go = (r) => { if (r) { setOpen(false); navigate(r.to); } };
  const onKey = (e) => {
    if (e.key === 'Escape') setOpen(false);
    else if (e.key === 'ArrowDown') { e.preventDefault(); setCursor((c) => Math.min(c + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)); }
    else if (e.key === 'Enter') go(results[cursor]);
  };

  return (
    <div className={styles.root} onMouseDown={() => setOpen(false)}>
      <div className={`glass ${styles.box}`} role="dialog" aria-modal="true" aria-label="Search" onMouseDown={(e) => e.stopPropagation()} onKeyDown={onKey}>
        <label className={styles.field}>
          <Search size={18} aria-hidden="true" />
          <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search modules and lessons" aria-label="Search modules and lessons" />
          <kbd className="kbd">Esc</kbd>
        </label>
        <ul className={styles.list} role="listbox">
          {results.length === 0 && <li className={styles.empty}>Nothing matches "{q}". Try a shorter word, like "volatile" or "bits".</li>}
          {results.map((r, i) => (
            <li key={r.to + r.title} role="option" aria-selected={i === cursor}>
              <button className={`${styles.row} ${i === cursor ? styles.on : ''}`} onMouseEnter={() => setCursor(i)} onClick={() => go(r)}>
                <span className={styles.type}>{r.type}</span>
                <span className={styles.main}><span className={styles.title}>{r.title}</span><span className={styles.sub}>{r.sub}</span></span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
