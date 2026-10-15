import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { AlertTriangle, Bug, Check, ChevronRight, Copy, Info, Lightbulb, Target } from 'lucide-react';
import { slugify, splitCallouts } from '../../lib/markdown.js';
import { useTheme } from '../../context/ThemeContext.jsx';
import styles from './Content.module.css';

const textOf = (n) => (typeof n === 'string' ? n : Array.isArray(n) ? n.map(textOf).join('') : n?.props ? textOf(n.props.children) : '');

function Mermaid({ code }) {
  const ref = useRef(null);
  const { theme } = useTheme();
  const [err, setErr] = useState('');
  useEffect(() => {
    let dead = false;
    import('mermaid')
      .then(({ default: m }) => {
        m.initialize({ startOnLoad: false, theme: theme === 'dark' ? 'dark' : 'neutral', securityLevel: 'strict' });
        return m.render(`mm-${Math.random().toString(36).slice(2)}`, code);
      })
      .then(({ svg }) => { if (!dead && ref.current) { ref.current.innerHTML = svg; setErr(''); } })
      .catch((e) => !dead && setErr(String(e.message || e)));
    return () => { dead = true; };
  }, [code, theme]);
  return err ? <pre className={styles.mermaidErr}>Diagram error: {err}</pre> : <figure className={styles.mermaid} ref={ref} aria-label="Diagram" />;
}

function Pre({ children }) {
  const [copied, setCopied] = useState(false);
  const code = Array.isArray(children) ? children[0] : children;
  const lang = (/language-([\w+-]+)/.exec(code?.props?.className || '') || [])[1];
  const text = textOf(code?.props?.children).replace(/\n$/, '');
  if (lang === 'mermaid') return <Mermaid code={text} />;
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch { /* clipboard blocked */ }
  };
  return (
    <div className={styles.code}>
      <div className={styles.codeHead}>
        <span>{lang || 'text'}</span>
        <button onClick={copy} aria-label="Copy code">{copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}</button>
      </div>
      <pre>{children}</pre>
    </div>
  );
}

const head = (Tag) => ({ children }) => <Tag id={slugify(textOf(children))}>{children}</Tag>;
const components = {
  pre: Pre,
  h2: head('h2'),
  h3: head('h3'),
  table: ({ children }) => <div className={styles.tableWrap}><table>{children}</table></div>,
  a: ({ href, children }) => <a href={href} target={/^https?:/.test(href || '') ? '_blank' : undefined} rel="noreferrer">{children}</a>,
};

function Md({ text }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[[rehypeHighlight, { detect: false, ignoreMissing: true, plainText: ['mermaid', 'text', 'txt'] }]]}
      components={components}
    >
      {text}
    </ReactMarkdown>
  );
}

const CALLOUTS = {
  note: { Icon: Info, label: 'Note' },
  warning: { Icon: AlertTriangle, label: 'Warning' },
  pitfall: { Icon: Bug, label: 'Common pitfall' },
  tip: { Icon: Lightbulb, label: 'Tip' },
  interview: { Icon: Target, label: 'Interview angle' },
};

export default function LessonContent({ body }) {
  return (
    <div className={styles.prose}>
      {splitCallouts(body).map((seg, i) => {
        if (seg.kind === 'md') return <Md key={i} text={seg.text} />;
        if (seg.type === 'answer') {
          return (
            <details key={i} className={styles.answer}>
              <summary><ChevronRight size={16} /> Show answer</summary>
              <Md text={seg.text} />
            </details>
          );
        }
        const { Icon, label } = CALLOUTS[seg.type];
        return (
          <aside key={i} className={`${styles.callout} ${styles[seg.type]}`}>
            <div className={styles.calloutHead}><Icon size={16} /> {label}</div>
            <Md text={seg.text} />
          </aside>
        );
      })}
    </div>
  );
}
