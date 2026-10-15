import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Compass, Menu, Moon, Smartphone, Sun, Terminal, Users } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';
import { brand, navItems } from '../../config/navigation.js';
import MegaMenu from './MegaMenu.jsx';
import MobileDrawer from './MobileDrawer.jsx';
import styles from './Navbar.module.css';

function Logo() {
  return (
    <Link to="/" className={styles.logo} aria-label={`${brand.name} home`}>
      <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
        <defs>
          <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" style={{ stopColor: 'var(--accent-2)' }} />
            <stop offset="1" style={{ stopColor: 'var(--accent)' }} />
          </linearGradient>
        </defs>
        <rect x="1" y="1" width="32" height="32" rx="10" fill="url(#lg)" />
        <path d="M9 24 17 9l8 15M12.5 19h9" fill="none" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: 'var(--on-accent)' }} />
      </svg>
      <span className={styles.brandText}>
        <span className={styles.wordmark}>Algokrz<em>xi</em></span>
        <span className={styles.tagline}>{brand.tagline}</span>
      </span>
    </Link>
  );
}

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const { pathname } = useLocation();
  const [openId, setOpenId] = useState(null);
  const [drawer, setDrawer] = useState(false);
  const [track, setTrack] = useState('Student');
  const [profile, setProfile] = useState(false);
  const wrap = useRef(null);
  const openItem = navItems.find((n) => n.id === openId);

  useEffect(() => { setOpenId(null); setProfile(false); }, [pathname]);
  useEffect(() => {
    const esc = (e) => { if (e.key === 'Escape') { setOpenId(null); setProfile(false); } };
    const outside = (e) => { if (wrap.current && !wrap.current.contains(e.target)) { setOpenId(null); setProfile(false); } };
    window.addEventListener('keydown', esc);
    document.addEventListener('mousedown', outside);
    return () => { window.removeEventListener('keydown', esc); document.removeEventListener('mousedown', outside); };
  }, []);

  return (
    <header className={styles.wrap} ref={wrap}>
      {openItem && <div className={styles.scrim} aria-hidden="true" />}
      <nav className={`glass ${styles.nav}`} aria-label="Primary">
        <Logo />
        <ul className={styles.items}>
          {navItems.map((item) => {
            const open = openId === item.id;
            const active = item.to !== '/' && pathname.startsWith(item.to);
            return (
              <li key={item.id}>
                <button className={`${styles.item} ${active || open ? styles.itemActive : ''}`} aria-expanded={open} onClick={() => { setProfile(false); setOpenId(open ? null : item.id); }}>
                  <span className={styles.itemText}>
                    <span className={styles.itemTitle}>{item.title}</span>
                    <span className={styles.itemSub}>{item.subtitle}</span>
                  </span>
                  <ChevronDown size={16} className={open ? styles.flip : ''} />
                </button>
              </li>
            );
          })}
        </ul>

        <div className={styles.actions}>
          <div className={`glass glass--pill ${styles.cluster}`}>
            <span className={styles.dotWrap}>
              <button className="icon-btn" aria-label="Mobile app (soon)"><Smartphone size={18} /></button>
              <i className={styles.dot} aria-hidden="true" />
            </span>
            <button className="icon-btn" aria-label="Source code"><Terminal size={18} /></button>
            <button className="icon-btn" aria-label="Community"><Users size={18} /></button>
          </div>
          <button className={styles.track} onClick={() => setTrack((t) => (t === 'Student' ? 'Professional' : 'Student'))} aria-label={`Learning track: ${track}. Click to switch`}>
            {track} <ChevronDown size={14} />
          </button>
          <button className="icon-btn" onClick={toggle} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
            {theme === 'dark' ? <Moon size={19} /> : <Sun size={19} />}
          </button>
          <Link to="/modules" className={`icon-btn ${styles.hideSm}`} aria-label="Explore modules"><Compass size={19} /></Link>
          <div className={styles.profileWrap}>
            <button className={styles.avatar} aria-label="Profile menu" aria-expanded={profile} onClick={() => { setOpenId(null); setProfile((p) => !p); }}>A</button>
            {profile && (
              <div className={`glass ${styles.menu}`}>
                <Link to="/profile">Profile & progress</Link>
                <Link to="/roadmaps">Roadmaps</Link>
                <Link to="/search">Search</Link>
              </div>
            )}
          </div>
          <button className={`icon-btn ${styles.burger}`} aria-label="Open menu" onClick={() => setDrawer(true)}><Menu size={22} /></button>
        </div>
      </nav>
      {openItem && <MegaMenu item={openItem} onNavigate={() => setOpenId(null)} />}
      <MobileDrawer open={drawer} onClose={() => setDrawer(false)} />
    </header>
  );
}
