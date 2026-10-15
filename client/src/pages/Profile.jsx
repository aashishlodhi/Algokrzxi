import { Link } from 'react-router-dom';
import { Star, StickyNote } from 'lucide-react';
import { allLessonRefs, flatLessons, modules } from '../lib/modules.js';
import { useProgress } from '../context/ProgressContext.jsx';
import styles from './Pages.module.css';

export default function Profile() {
  const { isDone, isRevision, doneCount, notes } = useProgress();
  const refs = allLessonRefs();
  const total = refs.length;
  const done = refs.filter((r) => isDone(r.slug, r.id)).length;
  const revise = refs.filter((r) => isRevision(r.slug, r.id));
  const noted = refs.filter((r) => (notes[`${r.slug}/${r.id}`] || '').trim());
  return (
    <div className={`container ${styles.wrap}`}>
      <div className={styles.head}><h1>Your progress</h1><p>Saved on this device. It syncs to the server when the API is running.</p></div>
      <div className={styles.stats}>
        <div className={`glass glass--card ${styles.stat}`}><b>{done}/{total}</b><span>Lessons completed</span></div>
        <div className={`glass glass--card ${styles.stat}`}><b>{revise.length}</b><span>Marked for revision</span></div>
        <div className={`glass glass--card ${styles.stat}`}><b>{noted.length}</b><span>Lessons with notes</span></div>
      </div>
      <section className={`glass glass--card ${styles.section}`}>
        <div className={styles.sectionHead}><h2>By module</h2></div>
        <ul className={styles.list}>
          {modules.map((m) => {
            const ids = flatLessons(m).map((l) => l.id);
            return <li key={m.slug}><Link className={styles.row} to={`/m/${m.slug}`}><span className={styles.rowMain}><span className={styles.rowTitle}>{m.title}</span></span><span className={styles.rowSub}>{doneCount(m.slug, ids)} / {ids.length}</span></Link></li>;
          })}
        </ul>
      </section>
      <section className={`glass glass--card ${styles.section}`}>
        <div className={styles.sectionHead}><Star size={18} /><h2>Revision list</h2></div>
        <ul className={styles.list}>
          {revise.length === 0 && <li className={styles.empty}>Nothing starred yet. Use the star in a lesson's action bar to add it here.</li>}
          {revise.map((r) => <li key={r.slug + r.id}><Link className={styles.row} to={`/m/${r.slug}/${r.id}`}><span className={styles.rowMain}><span className={styles.rowTitle}>{r.title}</span><span className={styles.rowSub}>{r.moduleTitle}</span></span></Link></li>)}
        </ul>
      </section>
      <section className={`glass glass--card ${styles.section}`}>
        <div className={styles.sectionHead}><StickyNote size={18} /><h2>Your notes</h2></div>
        <ul className={styles.list}>
          {noted.length === 0 && <li className={styles.empty}>No notes yet. Open Note in any lesson to write one.</li>}
          {noted.map((r) => <li key={r.slug + r.id}><Link className={styles.row} to={`/m/${r.slug}/${r.id}`}><span className={styles.rowMain}><span className={styles.rowTitle}>{r.title}</span><span className={styles.rowSub}>{(notes[`${r.slug}/${r.id}`] || '').slice(0, 90)}</span></span></Link></li>)}
        </ul>
      </section>
    </div>
  );
}
