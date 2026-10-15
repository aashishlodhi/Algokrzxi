import { Link } from 'react-router-dom';
import { ArrowUpRight, Lock } from 'lucide-react';
import { Icon } from '../../lib/icons.jsx';
import { lessonCount, modules } from '../../lib/modules.js';
import styles from './MegaMenu.module.css';

export function menuColumns(item) {
  const cols = [...item.columns];
  if (item.autoModules) {
    cols.unshift({
      heading: 'Available now',
      items: modules.map((m) => ({ title: m.title, desc: `${m.subtitle} (${lessonCount(m)} lessons)`, to: `/m/${m.slug}`, icon: m.icon, locked: m.status !== 'live', cta: m.status === 'live' ? 'START LEARNING' : undefined })),
    });
  }
  return cols;
}

export function MenuItem({ item, onNavigate }) {
  const body = (
    <>
      <span className={styles.icon}><Icon name={item.icon} size={18} /></span>
      <span className={styles.text}>
        <span className={styles.title}>
          {item.title}
          {item.badge && <span className={`pill pill--danger ${styles.badge}`}>{item.badge}</span>}
          {item.locked && <Lock size={13} aria-label="Coming soon" />}
          {item.external && <ArrowUpRight size={14} aria-hidden="true" />}
        </span>
        <span className={styles.desc}>{item.desc}</span>
        {item.cta && !item.locked && <span className={styles.cta}>{item.cta} &rarr;</span>}
      </span>
    </>
  );
  if (item.locked) return <div className={`${styles.item} ${styles.locked}`} aria-disabled="true">{body}</div>;
  return item.external
    ? <a className={styles.item} href={item.to} target="_blank" rel="noreferrer">{body}</a>
    : <Link className={styles.item} to={item.to} onClick={onNavigate}>{body}</Link>;
}

export default function MegaMenu({ item, onNavigate }) {
  return (
    <div className={`glass ${styles.panel}`} role="region" aria-label={`${item.title} menu`}>
      {menuColumns(item).map((col) => (
        <div key={col.heading} className={styles.col}>
          <h3 className={styles.heading}>{col.heading}</h3>
          {col.items.map((it) => <MenuItem key={it.title} item={it} onNavigate={onNavigate} />)}
        </div>
      ))}
    </div>
  );
}
