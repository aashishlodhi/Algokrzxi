// Substring match ranks first; otherwise ordered-subsequence match ("rtos" ~ "Real-Time OS").
export function score(query, text) {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  const at = t.indexOf(q);
  if (at >= 0) return 100 - Math.min(at, 90);
  let i = 0;
  for (const ch of t) if (ch === q[i] && ++i === q.length) return 10 + (q.length / t.length) * 10;
  return 0;
}
