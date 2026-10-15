import { Link } from 'react-router-dom';
import styles from './Pages.module.css';

export default function NotFound() {
  return (
    <div className={`container ${styles.center}`}>
      <h1>404</h1>
      <p className={styles.muted}>That page does not exist. It may have moved, or the link is mistyped.</p>
      <Link className="btn btn--primary" to="/modules">Browse modules</Link>
    </div>
  );
}
