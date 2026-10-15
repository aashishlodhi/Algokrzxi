// Every call fails soft: the app works fully offline from localStorage.
async function req(path, opts = {}) {
  try {
    const r = await fetch(`/api${path}`, { headers: { 'Content-Type': 'application/json' }, ...opts });
    return r.ok ? await r.json() : null;
  } catch {
    return null;
  }
}
const send = (method, body) => ({ method, body: JSON.stringify(body) });

export const api = {
  getProgress: () => req('/progress'),
  putProgress: (b) => req('/progress', send('PUT', b)),
  getNote: (m, l) => req(`/notes/${m}/${l}`),
  putNote: (m, l, body) => req(`/notes/${m}/${l}`, send('PUT', { body })),
  postFeedback: (b) => req('/feedback', send('POST', b)),
};
