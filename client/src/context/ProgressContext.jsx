import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../lib/api.js';

const PKEY = 'algokrzxi:progress';
const NKEY = 'algokrzxi:notes';
const read = (k) => { try { return JSON.parse(localStorage.getItem(k)) || {}; } catch { return {}; } };
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } };
const key = (slug, id) => `${slug}/${id}`;

const Ctx = createContext(null);

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(() => read(PKEY));
  const [notes, setNotes] = useState(() => read(NKEY));
  const ref = useRef(progress);
  ref.current = progress;

  useEffect(() => write(PKEY, progress), [progress]);
  useEffect(() => write(NKEY, notes), [notes]);

  // one-time merge with the server copy (union of flags), if the API is reachable
  useEffect(() => {
    api.getProgress().then((rows) => {
      if (!Array.isArray(rows)) return;
      setProgress((prev) => {
        const next = { ...prev };
        rows.forEach((r) => {
          const k = key(r.moduleSlug, r.lessonId);
          const p = next[k] || {};
          next[k] = { completed: !!(p.completed || r.completed), revision: !!(p.revision || r.revision) };
        });
        return next;
      });
    });
  }, []);

  const update = useCallback((slug, id, patch) => {
    const k = key(slug, id);
    const cur = ref.current[k] || {};
    const next = { completed: !!cur.completed, revision: !!cur.revision, ...patch };
    setProgress((p) => ({ ...p, [k]: next }));
    api.putProgress({ moduleSlug: slug, lessonId: id, ...next });
  }, []);

  const value = useMemo(() => {
    const get = (s, i) => progress[key(s, i)] || {};
    return {
      progress,
      notes,
      isDone: (s, i) => !!get(s, i).completed,
      isRevision: (s, i) => !!get(s, i).revision,
      toggleDone: (s, i) => update(s, i, { completed: !get(s, i).completed }),
      toggleRevision: (s, i) => update(s, i, { revision: !get(s, i).revision }),
      getNote: (s, i) => notes[key(s, i)] || '',
      saveNote: (s, i, text) => { setNotes((n) => ({ ...n, [key(s, i)]: text })); return api.putNote(s, i, text); },
      doneCount: (s, ids) => ids.filter((i) => get(s, i).completed).length,
    };
  }, [progress, notes, update]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useProgress = () => useContext(Ctx);
