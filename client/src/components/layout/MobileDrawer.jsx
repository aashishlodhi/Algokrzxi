import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, X } from 'lucide-react';
import { navItems } from '../../config/navigation.js';
import { MenuItem, menuColumns } from './MegaMenu.jsx';
import styles from './MobileDrawer.module.css';

export default function MobileDrawer({ open, onClose }) {
  const [openId, setOpenId] = useState(null);
  const { pathname } = useLocation();

  useEffect(onClose, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = 'hidden';
    const esc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', esc); };
  }, [open, onClose]);

  return (
    <div className={`${styles.root} ${open ? styles.open : ''}`} aria-hidden={!open}>
      <div className={styles.scrim} onClick={onClose} />
      <aside className={`glass ${styles.sheet}`} role="dialog" aria-modal="true" aria-label="Menu">
        <div className={styles.head}>
          <strong>Menu</strong>
          <button className="icon-btn" onClick={onClose} aria-label="Close menu" tabIndex={open ? 0 : -1}><X size={20} /></button>
        </div>
        {navItems.map((item) => (
          <div key={item.id} className={styles.group}>
            <button className={styles.trigger} aria-expanded={openId === item.id} tabIndex={open ? 0 : -1} onClick={() => setOpenId(openId === item.id ? null : item.id)}>
              <span><span className={styles.t}>{item.title}</span><span className={styles.s}>{item.subtitle}</span></span>
              <ChevronDown size={18} className={openId === item.id ? styles.flip : ''} />
            </button>
            {openId === item.id && (
              <div className={styles.body}>
                {menuColumns(item).map((col) => (
                  <div key={col.heading}>
                    <h3 className={styles.h}>{col.heading}</h3>
                    {col.items.map((it) => <MenuItem key={it.title} item={it} onNavigate={onClose} />)}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        <Link to="/profile" className="btn" style={{ marginTop: 16 }} tabIndex={open ? 0 : -1}>Profile & progress</Link>
      </aside>
    </div>
  );
}
