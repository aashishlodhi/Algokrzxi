import { Link } from 'react-router-dom';
import { flatLessons, modules } from '../lib/modules.js';
import { navItems } from '../config/navigation.js';
import styles from './Pages.module.css';

export default function Roadmaps() {
  const planned = navItems.flatMap((n) => n.columns.flatMap((c) => c.items.filter((i) => i.locked).map((i) => i.title)));
  return (
    <div className={`container ${styles.wrap}`}>
      <div className={styles.head}>
        <h1>Roadmaps</h1>
        <p>A suggested order for the live modules, followed by what is planned next. Follow it top to bottom.</p>
      </div>
      <div className={styles.line}>
        {modules.map((m, i) => (
          <article key={m.slug} className={`glass glass--card ${styles.node} ${m.status === 'live' ? '' : styles.nodeSoon}`}>
            <h2 style={{ fontSize: '1.3rem' }}>{i + 1}. {m.title}</h2>
            <p className={styles.muted} style={{ marginTop: 6 }}>{m.subtitle}</p>
            <div className={styles.steps}>
              {m.sections.map((s) => <span key={s.id} className="pill">{s.title} ({s.lessons.length})</span>)}
            </div>
            {m.status === 'live' && <Link className="btn" style={{ marginTop: 16 }} to={`/m/${m.slug}`}>Open module ({flatLessons(m).length} lessons)</Link>}
          </article>
        ))}
        <article className={`glass glass--card ${styles.node} ${styles.nodeSoon}`}>
          <h2 style={{ fontSize: '1.3rem' }}>Planned next</h2>
          <div className={styles.steps}>{[...new Set(planned)].map((t) => <span key={t} className="pill">{t}</span>)}</div>
        </article>
      </div>
    </div>
  );
}
