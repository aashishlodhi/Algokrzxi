export const slugify = (s) => s.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');

export function parseFrontmatter(raw) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!m) return { meta: {}, body: raw };
  const meta = {};
  m[1].split('\n').forEach((line) => {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, '');
  });
  return { meta, body: raw.slice(m[0].length) };
}

// ::: type ... :::  ->  [{kind:'md',text} | {kind:'callout',type,text}]
export function splitCallouts(body) {
  const re = /^:::\s*(note|warning|pitfall|tip|interview|answer)[^\S\n]*\n([\s\S]*?)\n:::[^\S\n]*$/gm;
  const out = [];
  let last = 0;
  let m;
  while ((m = re.exec(body))) {
    if (m.index > last) out.push({ kind: 'md', text: body.slice(last, m.index) });
    out.push({ kind: 'callout', type: m[1], text: m[2] });
    last = re.lastIndex;
  }
  if (last < body.length) out.push({ kind: 'md', text: body.slice(last) });
  return out;
}

export function extractToc(body) {
  let fenced = false;
  const toc = [];
  body.split('\n').forEach((line) => {
    if (/^```/.test(line)) fenced = !fenced;
    const m = !fenced && /^##\s+(.+)$/.exec(line);
    if (m) toc.push({ id: slugify(m[1]), text: m[1].trim() });
  });
  return toc;
}
