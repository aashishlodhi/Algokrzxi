import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { PanelLeft } from 'lucide-react';
import { flatLessons, getModule, loadLesson } from '../lib/modules.js';
import { extractToc, parseFrontmatter } from '../lib/markdown.js';
import LessonContent from '../components/lesson/LessonContent.jsx';
import { ActionBar, LessonSidebar, NotesDrawer, ReportModal, RightRail, TocInline } from '../components/lesson/LessonUI.jsx';
import NotFound from './NotFound.jsx';
import styles from '../components/lesson/Lesson.module.css';

function LessonView({ mod, flat, idx }) {
  const lesson = flat[idx];
  const [doc, setDoc] = useState({ status: 'loading', meta: {}, body: '' });
  const [drawer, setDrawer] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [notes, setNotes] = useState(false);
  const [report, setReport] = useState(false);
  const [pct, setPct] = useState(0);
  const [active, setActive] = useState('');

  useEffect(() => {
    let dead = false;
    loadLesson(mod.slug, lesson.file).then((raw) => {
      if (dead) return;
      if (!raw) return setDoc({ status: 'missing', meta: {}, body: '' });
      const { meta, body } = parseFrontmatter(raw);
      setDoc({ status: 'ready', meta, body });
    }).catch(() => !dead && setDoc({ status: 'error', meta: {}, body: '' }));
    return () => { dead = true; };
  }, [mod.slug, lesson.file]);

  const toc = useMemo(() => extractToc(doc.body), [doc.body]);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setPct(max > 0 ? Math.min(100, Math.round((window.scrollY / max) * 100)) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [doc.body]);

  useEffect(() => {
    if (!toc.length) return undefined;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
    }, { rootMargin: '-96px 0px -70% 0px' });
    toc.forEach((t) => { const el = document.getElementById(t.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [toc]);

  const author = mod.author || {};
  return (
    <div className={`${styles.page} ${collapsed ? styles.collapsed : ''}`}>
      <LessonSidebar mod={mod} flat={flat} activeId={lesson.id} open={drawer} collapsed={collapsed} onClose={() => setDrawer(false)} onCollapse={() => setCollapsed(true)} />
      <article className={styles.main}>
        <button className={`btn ${styles.lessonsBtn} ${collapsed ? styles.show : ''}`} onClick={() => (collapsed ? setCollapsed(false) : setDrawer(true))}><PanelLeft size={18} /> Lessons</button>
        <h1 className={styles.title}>{lesson.title}</h1>
        <div className={styles.byline}>
          <span className={styles.avatar} aria-hidden="true">{(author.name || 'A')[0]}</span>
          <div><b>{author.name || 'Algokrzxi'}</b><span>{author.role || 'Author'} / {lesson.minutes} min read</span></div>
        </div>
        <TocInline toc={toc} />
        <div className={styles.panel}>
          {doc.status === 'loading' && <p className={styles.state}>Loading lesson...</p>}
          {doc.status === 'missing' && <p className={styles.state}>This lesson's file ({lesson.file}) was not found. Check the filename in module.config.js.</p>}
          {doc.status === 'error' && <p className={styles.state}>The lesson could not be loaded. Refresh the page to try again.</p>}
          {doc.status === 'ready' && <LessonContent body={doc.body} />}
        </div>
      </article>
      <RightRail toc={toc} active={active} pct={pct} />
      <ActionBar prev={flat[idx - 1]} next={flat[idx + 1]} slug={mod.slug} lessonId={lesson.id} onNote={() => setNotes(true)} onReport={() => setReport(true)} />
      <button className={styles.feedbackTab} onClick={() => setReport(true)}>FEEDBACK</button>
      <NotesDrawer open={notes} onClose={() => setNotes(false)} slug={mod.slug} lessonId={lesson.id} title={lesson.title} />
      <ReportModal open={report} onClose={() => setReport(false)} slug={mod.slug} lessonId={lesson.id} />
    </div>
  );
}

export default function Lesson() {
  const { slug, lessonId } = useParams();
  const mod = getModule(slug);
  if (!mod) return <NotFound />;
  const flat = flatLessons(mod);
  const idx = flat.findIndex((l) => l.id === lessonId);
  if (idx < 0) return <Navigate to={`/m/${slug}`} replace />;
  return <LessonView key={`${slug}/${lessonId}`} mod={mod} flat={flat} idx={idx} />;
}
