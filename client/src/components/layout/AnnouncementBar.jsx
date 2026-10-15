import { useState } from 'react';
import { X } from 'lucide-react';
import { announcement } from '../../config/navigation.js';
import styles from './AnnouncementBar.module.css';

const KEY = 'algokrzxi:announce-dismissed';
const wasDismissed = () => { try { return localStorage.getItem(KEY) === '1'; } catch { return false; } };

export default function AnnouncementBar() {
  const [open, setOpen] = useState(() => !wasDismissed());
  if (!open) return null;

  const close = () => {
    setOpen(false);
    try { localStorage.setItem(KEY, '1'); } catch { /* ignore */ }
  };

  return (
    <div className={styles.bar} role="region" aria-label="Announcement">
      <p className={styles.text}>{announcement}</p>
      <button className={styles.close} onClick={close} aria-label="Dismiss announcement">
        <X size={16} />
      </button>
    </div>
  );
}
