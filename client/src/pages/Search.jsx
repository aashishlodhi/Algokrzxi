import { useState } from 'react';
import { Link } from 'react-router-dom';
import { searchAll } from '../lib/modules.js';
import styles from './Pages.module.css';

export default function Search() {
  const [q, setQ] = useState('');
  const results = searchAll(q);
  return (
    <div className={`container ${styles.wrap}`}>
      <div className={styles.head}><h1>Search</h1><p>Find any module or lesson. Tip: press Ctrl K (or Cmd K) anywhere to search faster.</p></div>
      <input className={styles.input} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Try: volatile, bit masks, interrupts" aria-label="Search" autoFocus />
      <ul className={`glass glass--card ${styles.list}`} style={{ padding: 8 }}>
        {results.length === 0 && <li className={styles.empty}>Nothing matches "{q}". Try a shorter word.</li>}
        {results.map((r) => (
          <li key={r.to + r.title}>
            <Link className={styles.row} to={r.to}>
              <span className="pill">{r.type}</span>
              <span className={styles.rowMain}><span className={styles.rowTitle}>{r.title}</span><span className={styles.rowSub}>{r.sub}</span></span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
