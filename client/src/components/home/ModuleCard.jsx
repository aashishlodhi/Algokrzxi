import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { Icon } from '../../lib/icons.jsx';
import { flatLessons } from '../../lib/modules.js';
import { useProgress } from '../../context/ProgressContext.jsx';
import styles from './ModuleCard.module.css';

export default function ModuleCard({ mod }) {
  const { doneCount } = useProgress();
  const ids = flatLessons(mod).map((l) => l.id);
  const done = doneCount(mod.slug, ids);
  const pct = ids.length ? Math.round((done / ids.length) * 100) : 0;
  const live = mod.status === 'live';
  const inner = (
    <>
      <div className={styles.top}>
        <span className={styles.icon}><Icon name={mod.icon} size={22} /></span>
        <span className="pill">{mod.level}</span>
        {!live && <Lock size={15} aria-label="Coming soon" className={styles.lock} />}
      </div>
      <h3 className={styles.title}>{mod.title}</h3>
      <p className={styles.sub}>{mod.subtitle}</p>
      <div className={styles.foot}>
        <span>{ids.length} lessons</span>
        <span>{live ? `${pct}% done` : 'Coming soon'}</span>
      </div>
      <div className={styles.bar} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${mod.title} progress`}><i style={{ width: `${pct}%` }} /></div>
    </>
  );
  return live
    ? <Link to={`/m/${mod.slug}`} className={`glass glass--card ${styles.card}`}>{inner}</Link>
    : <div className={`glass glass--card ${styles.card} ${styles.soon}`}>{inner}</div>;
}
