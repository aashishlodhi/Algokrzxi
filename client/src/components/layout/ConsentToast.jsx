import { useState } from 'react';
import { Cookie } from 'lucide-react';
import styles from './ConsentToast.module.css';

const KEY = 'algokrzxi:consent';
const has = () => { try { return !!localStorage.getItem(KEY); } catch { return false; } };

export default function ConsentToast() {
  const [show, setShow] = useState(() => !has());
  if (!show) return null;
  const choose = (v) => { try { localStorage.setItem(KEY, v); } catch { /* ignore */ } setShow(false); };
  return (
    <div className={`glass glass--pill ${styles.toast}`} role="dialog" aria-label="Storage notice">
      <span className={styles.icon}><Cookie size={20} /></span>
      <p className={styles.text}>
        We save your theme, progress and notes on this device so lessons pick up where you left off.
      </p>
      <div className={styles.actions}>
        <button className="btn" onClick={() => choose('rejected')}>Reject</button>
        <button className="btn btn--solid" onClick={() => choose('accepted')}>Accept all</button>
      </div>
    </div>
  );
}
