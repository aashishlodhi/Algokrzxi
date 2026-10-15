import { useReducedMotion } from '../../lib/useReducedMotion.js';
import styles from './FeatureCards.module.css';

function SignalChain({ still }) {
  return (
    <svg viewBox="0 0 400 200" className={styles.svg} role="img" aria-label="Signal flowing from a sensor through a microcontroller to an actuator">
      <path id="sig" d="M104 100 H296" className={styles.wire} />
      {[['Sensor', 20], ['MCU', 155], ['Actuator', 290]].map(([t, x]) => (
        <g key={t}>
          <rect x={x} y="70" width="90" height="60" rx="16" className={t === 'MCU' ? styles.nodeHot : styles.node} />
          <text x={x + 45} y="105" textAnchor="middle" className={styles.label}>{t}</text>
        </g>
      ))}
      {[...Array(4)].map((_, i) => (<g key={i}><rect x={170 + i * 20} y="62" width="6" height="8" rx="2" className={styles.pin} /><rect x={170 + i * 20} y="130" width="6" height="8" rx="2" className={styles.pin} /></g>))}
      {!still && (
        <circle r="6" className={styles.dot}>
          <animateMotion dur="3.2s" repeatCount="indefinite" path="M104 100 H296" />
        </circle>
      )}
    </svg>
  );
}

function RegisterBits() {
  return (
    <div className={styles.regWrap}>
      <div className={styles.regRow} aria-hidden="true">
        {[7, 6, 5, 4, 3, 2, 1, 0].map((b, i) => (
          <span key={b} className={styles.bit} style={{ '--d': `${i * 0.35}s` }}><small>{b}</small></span>
        ))}
      </div>
      <code className={styles.code}>REG |= (1u &lt;&lt; 3);</code>
      <p className={styles.sr}>An eight bit register with individual bits switching on and off.</p>
    </div>
  );
}

function Chat() {
  return (
    <div className={styles.chat}>
      <div className={styles.q}><span className={styles.av}>?</span><p>What if an interrupt and main() update the same variable?</p></div>
      <div className={styles.a}><p>That is a data race. Mark it volatile, keep the access atomic, or briefly disable the interrupt around it.</p></div>
    </div>
  );
}

const cards = [
  { id: 'chain', title: 'See the whole signal chain', text: 'From the sensor to the pin to the actuator, every lesson ties code back to what the hardware really does.', art: (still) => <SignalChain still={still} /> },
  { id: 'reg', title: 'Think in registers and bits', text: 'Masks, shifts and memory-mapped I/O explained until reading a datasheet feels ordinary.', art: () => <RegisterBits /> },
  { id: 'qa', title: 'Prepare for the follow-up question', text: 'Each topic ends with the cross-questions interviewers actually ask, plus short answers you can check yourself against.', badge: 'Interview favourite', art: () => <Chat /> },
];

export default function FeatureCards() {
  const still = useReducedMotion();
  return (
    <div className={styles.grid}>
      {cards.map((c) => (
        <article key={c.id} className={`glass glass--card ${styles.card}`}>
          {c.badge && <span className={`pill pill--danger ${styles.badge}`}>{c.badge}</span>}
          <div className={styles.art}>{c.art(still)}</div>
          <div className={styles.body}>
            <h3>{c.title}</h3>
            <p>{c.text}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
