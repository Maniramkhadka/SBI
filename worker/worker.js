// National Mobile Admin API — Cloudflare Worker
// Secrets (Cloudflare): GITHUB_TOKEN, ADMIN_USERNAME, ADMIN_PASSWORD
// Variables (Cloudflare): GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH, DATA_PATH, ALLOWED_ORIGIN

const json = (body, status = 200, headers = {}) => new Response(
  typeof body === 'string' ? body : JSON.stringify(body),
  { status, headers: { 'content-type': 'application/json; charset=UTF-8', ...headers } }
);

function cors(env) {
  return {
    'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Username, X-Admin-Password',
    'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
    'Vary': 'Origin'
  };
}

function auth(req, env) {
  return !!env.ADMIN_USERNAME && !!env.ADMIN_PASSWORD &&
    req.headers.get('X-Admin-Username') === env.ADMIN_USERNAME &&
    req.headers.get('X-Admin-Password') === env.ADMIN_PASSWORD;
}

async function github(env, path, init = {}) {
  const branch = env.GITHUB_BRANCH || 'main';
  const url = `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${path}${init.method ? '' : `?ref=${encodeURIComponent(branch)}`}`;
  return fetch(url, {
    ...init,
    headers: {
      'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'National-Mobile-Admin',
      ...(init.headers || {})
    }
  });
}

function decodeBase64Utf8(value) {
  const binary = atob(value.replace(/\s/g, ''));
  const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function encodeBase64Utf8(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary);
}

export default {
  async fetch(req, env) {
    const h = cors(env);
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: h });

    const u = new URL(req.url);

    // Easy browser test: this must show that the correct Worker is deployed.
    if (u.pathname === '/' || u.pathname === '') {
      return json({ ok: true, service: 'National Mobile Admin API', endpoint: '/products' }, 200, h);
    }

    if (u.pathname !== '/products') return json({ error: 'Not found' }, 404, h);
    if (!auth(req, env)) return json({ error: 'Unauthorized' }, 401, h);
    if (!env.GITHUB_TOKEN || !env.GITHUB_OWNER || !env.GITHUB_REPO) {
      return json({ error: 'Worker GitHub configuration is incomplete' }, 500, h);
    }

    const path = env.DATA_PATH || 'data/products.json';

    if (req.method === 'GET') {
      const r = await github(env, path);
      if (!r.ok) return json({ error: await r.text() }, r.status, h);
      const f = await r.json();
      const content = decodeBase64Utf8(f.content);
      return new Response(content, {
        status: 200,
        headers: { ...h, 'content-type': 'application/json; charset=UTF-8', 'Cache-Control': 'no-store' }
      });
    }

    if (req.method === 'PUT') {
      let body;
      try { body = await req.json(); }
      catch { return json({ error: 'Invalid JSON' }, 400, h); }
      if (!body || !Array.isArray(body.products)) {
        return json({ error: 'products array required' }, 400, h);
      }

      const current = await github(env, path);
      if (!current.ok) return json({ error: await current.text() }, current.status, h);
      const meta = await current.json();
      const content = JSON.stringify(body, null, 2) + '\n';
      const encoded = encodeBase64Utf8(content);
      const branch = env.GITHUB_BRANCH || 'main';

      const r = await github(env, path, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Admin: update price list ${new Date().toISOString()}`,
          content: encoded,
          sha: meta.sha,
          branch
        })
      });
      if (!r.ok) return json({ error: await r.text() }, r.status, h);
      const done = await r.json();
      return json({ ok: true, commit: done.commit?.sha || null }, 200, h);
    }

    return json({ error: 'Method not allowed' }, 405, h);
  }
};
