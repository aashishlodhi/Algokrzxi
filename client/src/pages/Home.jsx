import { Search } from 'lucide-react';
import { usePalette } from '../context/PaletteContext.jsx';
import { modules } from '../lib/modules.js';
import ModuleCard from '../components/home/ModuleCard.jsx';
import FeatureCards from '../components/home/FeatureCards.jsx';
import styles from './Home.module.css';

const steps = [
  { t: 'Read the lesson', d: 'Short, structured pages with diagrams and runnable-style code examples.' },
  { t: 'Mark it and revise', d: 'Complete a lesson, or star it for revision when you need another pass.' },
  { t: 'Keep your own notes', d: 'Write notes beside the lesson. They stay saved on this device and sync when the server is running.' },
];

export default function Home() {
  const { setOpen } = usePalette();
  const isMac = typeof navigator !== 'undefined' && /Mac/i.test(navigator.platform);
  return (
    <>
      <section className={`container ${styles.hero}`}>
        <h1 className={styles.h1}>Master Your <span>Embedded Systems</span> Journey</h1>
        <p className={styles.lead}>Learn C, microcontrollers and embedded operating systems, and build the firmware skills that make teams want to hire you.</p>
        <div className={styles.eyebrow}><i /><span>ONE-STOP PLATFORM FOR EMBEDDED ENGINEERS</span><i /></div>
        <button className={`glass glass--pill ${styles.search}`} onClick={() => setOpen(true)} aria-label="Search topics and resources">
          <Search size={20} aria-hidden="true" />
          <span>Search topics &amp; resources...</span>
          <kbd className="kbd">{isMac ? '\u2318K' : 'Ctrl K'}</kbd>
        </button>
      </section>

      <section className={`container ${styles.section}`}>
        <h2 className={styles.h2}>Start where firmware starts</h2>
        <FeatureCards />
      </section>

      <section className={`container ${styles.section}`} id="modules">
        <h2 className={styles.h2}>Learning modules</h2>
        <div className={styles.modules}>
          {modules.map((m) => <ModuleCard key={m.slug} mod={m} />)}
        </div>
      </section>

      <section className={`container ${styles.section}`}>
        <h2 className={styles.h2}>How it works</h2>
        <ol className={styles.steps}>
          {steps.map((s, i) => (
            <li key={s.t} className="glass glass--card">
              <span className={styles.num}>{i + 1}</span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
