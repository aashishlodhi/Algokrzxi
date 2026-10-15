import { Link } from 'react-router-dom';
import { brand, footerLinks } from '../../config/navigation.js';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.about}>
          <strong className={styles.name}>{brand.name}</strong>
          <p>Structured, no-fluff lessons for people who write firmware for a living, or want to.</p>
        </div>
        {Object.entries(footerLinks).map(([group, links]) => (
          <nav key={group} aria-label={group}>
            <h2 className={styles.heading}>{group}</h2>
            <ul>
              {links.map((l) => (
                <li key={l.label}><Link to={l.to}>{l.label}</Link></li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className={`container ${styles.base}`}>
        <small>© {new Date().getFullYear()} {brand.name}. All rights reserved.</small>
      </div>
    </footer>
  );
}
