import { Link, useParams } from 'react-router-dom';
import { Check, FileText } from 'lucide-react';
import { Icon } from '../lib/icons.jsx';
import { flatLessons, getModule } from '../lib/modules.js';
import { useProgress } from '../context/ProgressContext.jsx';
import NotFound from './NotFound.jsx';
import styles from './Pages.module.css';

export default function ModuleOverview() {
  const { slug } = useParams();
  const mod = getModule(slug);
  const { isDone, doneCount } = useProgress();
  if (!mod) return <NotFound />;
  const flat = flatLessons(mod);
  const done = doneCount(slug, flat.map((l) => l.id));
  const next = flat.find((l) => !isDone(slug, l.id)) || flat[0];
  return (
    <div className={`container ${styles.wrap}`}>
      <div className={styles.head}>
        <p className={styles.crumb}><Link to="/modules">Modules</Link> / {mod.title}</p>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: 14 }}><Icon name={mod.icon} size={34} /> {mod.title}</h1>
        <p>{mod.subtitle}</p>
        <div className={styles.cta}>
          {next && mod.status === 'live' && <Link className="btn btn--primary" to={`/m/${slug}/${next.id}`}>{done ? 'Continue learning' : 'Start learning'}</Link>}
          <span className="pill" style={{ alignSelf: 'center' }}>{done} / {flat.length} completed</span>
        </div>
      </div>
      {mod.sections.map((s) => (
        <section key={s.id} className={`glass glass--card ${styles.section}`}>
          <div className={styles.sectionHead}><Icon name={s.icon} size={20} /><h2>{s.title}</h2></div>
          <ul className={styles.list}>
            {s.lessons.map((l) => (
              <li key={l.id}>
                <Link className={styles.row} to={`/m/${slug}/${l.id}`}>
                  {isDone(slug, l.id) ? <Check size={18} className={styles.done} aria-label="Completed" /> : <FileText size={18} className={styles.muted} aria-hidden="true" />}
                  <span className={styles.rowMain}><span className={styles.rowTitle}>{l.title}</span></span>
                  <span className={styles.rowSub}>{l.minutes} min</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
