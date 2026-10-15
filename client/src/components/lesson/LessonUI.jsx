import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, FileText, Flag, Search, Star, StickyNote, X } from 'lucide-react';
import { Icon } from '../../lib/icons.jsx';
import { api } from '../../lib/api.js';
import { useProgress } from '../../context/ProgressContext.jsx';
import styles from './Lesson.module.css';

export function ProgressRing({ pct }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <svg width="68" height="68" viewBox="0 0 68 68" role="img" aria-label={`${pct}% complete`}>
      <circle cx="34" cy="34" r={r} className={styles.ringBg} />
      <circle cx="34" cy="34" r={r} className={styles.ringFg} strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} transform="rotate(-90 34 34)" />
      <text x="34" y="39" textAnchor="middle" className={styles.ringText}>{pct}%</text>
    </svg>
  );
}

export function LessonSidebar({ mod, flat, activeId, open, collapsed, onClose, onCollapse }) {
  const { isDone, doneCount } = useProgress();
  const [q, setQ] = useState('');
  const activeSection = flat.find((l) => l.id === activeId)?.sectionId;
  const [openSec, setOpenSec] = useState(() => ({ [activeSection]: true }));
  useEffect(() => setOpenSec((o) => ({ ...o, [activeSection]: true })), [activeSection]);
  const done = doneCount(mod.slug, flat.map((l) => l.id));
  const pct = flat.length ? Math.round((done / flat.length) * 100) : 0;
  const query = q.trim().toLowerCase();

  return (
    <>
      <div className={`${styles.scrim} ${open ? styles.scrimOn : ''}`} onClick={onClose} />
      <aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : ''} ${collapsed ? styles.sidebarHidden : ''}`} aria-label="Lessons">
        <button className={`${styles.collapse}`} onClick={onCollapse} aria-label="Hide lesson list"><ChevronLeft size={16} /></button>
        <button className={`icon-btn ${styles.closeSm}`} onClick={onClose} aria-label="Close lesson list"><X size={20} /></button>
        <div className={styles.sideHead}>
          <Link to={`/m/${mod.slug}`} className={styles.courseTitle}>{mod.title}</Link>
          <p>{mod.subtitle}</p>
        </div>
        <div className={`glass ${styles.progCard}`}>
          <ProgressRing pct={pct} />
          <div><span className={styles.progLabel}>Overall progress</span><b className={styles.progNum}>{done}<small> / {flat.length}</small></b><span className={styles.progLabel}>Lessons completed</span></div>
        </div>
        <label className={styles.search}><Search size={16} aria-hidden="true" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search topics..." aria-label="Search topics" /></label>
        <nav>
          {mod.sections.map((s) => {
            const lessons = s.lessons.filter((l) => !query || l.title.toLowerCase().includes(query));
            if (!lessons.length) return null;
            const expanded = query ? true : !!openSec[s.id];
            return (
              <div key={s.id} className={styles.sec}>
                <button className={styles.secBtn} aria-expanded={expanded} onClick={() => setOpenSec((o) => ({ ...o, [s.id]: !o[s.id] }))}>
                  <Icon name={s.icon} size={18} /><span>{s.title}</span><ChevronDown size={16} className={expanded ? styles.flip : ''} />
                </button>
                {expanded && (
                  <ul>
                    {lessons.map((l) => (
                      <li key={l.id}>
                        <Link to={`/m/${mod.slug}/${l.id}`} className={`${styles.lessonLink} ${l.id === activeId ? styles.lessonOn : ''}`} aria-current={l.id === activeId ? 'page' : undefined} onClick={onClose}>
                          {isDone(mod.slug, l.id) ? <Check size={16} className={styles.tick} aria-label="Completed" /> : <FileText size={16} aria-hidden="true" />}
                          <span>{l.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

export function RightRail({ toc, active, pct }) {
  return (
    <aside className={styles.rail} aria-label="On this page">
      <div className={styles.readRow}><span>Reading progress</span><b>{pct}%</b></div>
      <div className={styles.readBar} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}><i style={{ width: `${pct}%` }} /></div>
      <h2 className={styles.tocHead}>On this page</h2>
      <ol className={styles.toc}>
        {toc.map((t) => (<li key={t.id}><a href={`#${t.id}`} className={active === t.id ? styles.tocOn : ''}>{t.text}</a></li>))}
      </ol>
    </aside>
  );
}

export function TocInline({ toc }) {
  if (!toc.length) return null;
  return (
    <details className={`glass ${styles.tocInline}`}>
      <summary>On this page</summary>
      <ol>{toc.map((t) => <li key={t.id}><a href={`#${t.id}`}>{t.text}</a></li>)}</ol>
    </details>
  );
}

export function ActionBar({ prev, next, slug, lessonId, onNote, onReport }) {
  const { isDone, isRevision, toggleDone, toggleRevision } = useProgress();
  const [hidden, setHidden] = useState(false);
  const done = isDone(slug, lessonId);
  const rev = isRevision(slug, lessonId);
  if (hidden) return <button className={`glass glass--pill ${styles.showChip}`} onClick={() => setHidden(false)}>Show actions</button>;
  return (
    <div className={`glass glass--pill ${styles.bar}`} role="toolbar" aria-label="Lesson actions">
      {prev ? <Link className={styles.act} to={`/m/${slug}/${prev.id}`}><ChevronLeft size={18} /><span>Prev</span></Link> : <span className={`${styles.act} ${styles.actOff}`}><ChevronLeft size={18} /><span>Prev</span></span>}
      <i className={styles.sep} />
      <button className={`${styles.act} ${done ? styles.actOn : ''}`} aria-pressed={done} onClick={() => toggleDone(slug, lessonId)}><CheckCircle2 size={18} /><span>{done ? 'Completed' : 'Complete'}</span></button>
      <button className={`${styles.act} ${rev ? styles.actOn : ''}`} aria-pressed={rev} onClick={() => toggleRevision(slug, lessonId)}><Star size={18} fill={rev ? 'currentColor' : 'none'} /><span>Revision</span></button>
      <button className={styles.act} onClick={onNote}><StickyNote size={18} /><span>Note</span></button>
      <button className={styles.act} onClick={onReport}><Flag size={18} /><span>Report</span></button>
      <i className={styles.sep} />
      {next ? <Link className={styles.act} to={`/m/${slug}/${next.id}`}><span>Next</span><ChevronRight size={18} /></Link> : <span className={`${styles.act} ${styles.actOff}`}><span>Next</span><ChevronRight size={18} /></span>}
      <button className={styles.hide} onClick={() => setHidden(true)} aria-label="Hide action bar">Hide</button>
    </div>
  );
}

export function NotesDrawer({ open, onClose, slug, lessonId, title }) {
  const { getNote, saveNote } = useProgress();
  const [text, setText] = useState('');
  const [state, setState] = useState('');
  useEffect(() => {
    if (!open) return;
    setText(getNote(slug, lessonId));
    setState('');
    api.getNote(slug, lessonId).then((r) => { if (r && r.body && !getNote(slug, lessonId)) setText(r.body); });
  }, [open, slug, lessonId]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!open) return undefined;
    const esc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open, onClose]);
  if (!open) return null;
  const save = async () => { const ok = await saveNote(slug, lessonId, text); setState(ok ? 'Saved' : 'Saved on this device. The server is not reachable.'); };
  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <aside className={`glass ${styles.drawer}`} role="dialog" aria-modal="true" aria-label="Notes" onMouseDown={(e) => e.stopPropagation()}>
        <div className={styles.dHead}><h2>Notes</h2><button className="icon-btn" onClick={onClose} aria-label="Close notes"><X size={20} /></button></div>
        <p className={styles.dSub}>{title}</p>
        <textarea value={text} onChange={(e) => { setText(e.target.value); setState(''); }} placeholder="Write what you want to remember about this lesson." aria-label="Lesson notes" autoFocus />
        <div className={styles.dFoot}><span role="status">{state}</span><button className="btn btn--primary" onClick={save}>Save note</button></div>
      </aside>
    </div>
  );
}

export function ReportModal({ open, onClose, slug, lessonId }) {
  const [type, setType] = useState('error');
  const [message, setMessage] = useState('');
  const [state, setState] = useState('');
  useEffect(() => { if (open) { setMessage(''); setState(''); } }, [open]);
  useEffect(() => {
    if (!open) return undefined;
    const esc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open, onClose]);
  if (!open) return null;
  const send = async () => {
    if (message.trim().length < 3) return setState('Add a few words describing the problem.');
    const r = await api.postFeedback({ moduleSlug: slug, lessonId, type, message: message.trim() });
    if (r) { setState('Sent. Thank you.'); setMessage(''); } else setState('Could not reach the server. Your message was not sent, try again later.');
  };
  return (
    <div className={`${styles.overlay} ${styles.center}`} onMouseDown={onClose}>
      <div className={`glass ${styles.modal}`} role="dialog" aria-modal="true" aria-label="Report a problem" onMouseDown={(e) => e.stopPropagation()}>
        <div className={styles.dHead}><h2>Report or suggest</h2><button className="icon-btn" onClick={onClose} aria-label="Close"><X size={20} /></button></div>
        <label className={styles.field}>What kind of feedback?
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="error">Something is wrong</option>
            <option value="unclear">Something is unclear</option>
            <option value="suggestion">Suggestion</option>
          </select>
        </label>
        <label className={styles.field}>Details
          <textarea value={message} onChange={(e) => { setMessage(e.target.value); setState(''); }} rows={5} placeholder="Say what you saw and where in the lesson." />
        </label>
        <div className={styles.dFoot}><span role="status">{state}</span><button className="btn btn--primary" onClick={send}>Send</button></div>
      </div>
    </div>
  );
}
