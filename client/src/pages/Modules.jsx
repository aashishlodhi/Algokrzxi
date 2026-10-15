import { useState } from 'react';
import { modules } from '../lib/modules.js';
import ModuleCard from '../components/home/ModuleCard.jsx';
import styles from './Pages.module.css';

const levels = ['all', 'beginner', 'intermediate', 'advanced'];

export default function Modules() {
  const [level, setLevel] = useState('all');
  const list = modules.filter((m) => level === 'all' || m.level === level);
  return (
    <div className={`container ${styles.wrap}`}>
      <div className={styles.head}>
        <h1>Modules</h1>
        <p>Each module is a self-contained track. New ones appear here as soon as they are added.</p>
      </div>
      <div className={styles.chips} role="group" aria-label="Filter by level">
        {levels.map((l) => (
          <button key={l} className={`${styles.chip} ${level === l ? styles.chipOn : ''}`} aria-pressed={level === l} onClick={() => setLevel(l)}>{l === 'all' ? 'All levels' : l[0].toUpperCase() + l.slice(1)}</button>
        ))}
      </div>
      {list.length ? <div className={styles.grid}>{list.map((m) => <ModuleCard key={m.slug} mod={m} />)}</div> : <p className={styles.empty}>No {level} modules yet. Try another level.</p>}
    </div>
  );
}
