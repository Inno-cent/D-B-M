// NEW FILE — api/publish-site.ts
//
// Triggers a Vercel redeploy so the prerendered (SEO) pages pick up catalog
// edits. Called by the "Publish changes" button in the admin screens.
//
// The deploy hook URL is a secret, so it lives only here (server side).
// Only signed-in admins may call it: we verify the caller's Supabase token
// and check their profile role.
//
// Env vars (Vercel project settings; for `vercel dev` also in .env.local):
//   VERCEL_DEPLOY_HOOK_URL   Project → Settings → Git → Deploy Hooks
//   VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY   (already set for the app)

import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' })

  // Local dev safety net, same as api/travo-quote.ts
  if (!process.env.VERCEL_DEPLOY_HOOK_URL) {
    for (const file of ['.env.local', '.env']) {
      try {
        ;(process as any).loadEnvFile(file)
      } catch {
        /* ignore */
      }
    }
  }

  const hook = process.env.VERCEL_DEPLOY_HOOK_URL
  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY
  if (!hook || !supabaseUrl || !anonKey) {
    console.error('publish-site: missing VERCEL_DEPLOY_HOOK_URL / Supabase env vars')
    return res.status(500).json({ error: 'Publishing is not configured.' })
  }

  const token = (req.headers.authorization ?? '').replace(/^Bearer\s+/i, '')
  if (!token) return res.status(401).json({ error: 'Not signed in.' })

  try {
    // 1) Who is this?
    const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { apikey: anonKey, Authorization: `Bearer ${token}` },
    })
    if (!userRes.ok) return res.status(401).json({ error: 'Not signed in.' })
    const user = (await userRes.json()) as { id?: string }
    if (!user.id) return res.status(401).json({ error: 'Not signed in.' })

    // 2) Are they an admin? (RLS lets a user read their own profile row.)
    const profRes = await fetch(
      `${supabaseUrl}/rest/v1/profiles?select=role&id=eq.${encodeURIComponent(user.id)}`,
      { headers: { apikey: anonKey, Authorization: `Bearer ${token}` } },
    )
    const rows = (await profRes.json()) as Array<{ role?: string }>
    if (!profRes.ok || rows[0]?.role !== 'admin') {
      return res.status(403).json({ error: 'Admins only.' })
    }

    // 3) Kick off the redeploy.
    const deploy = await fetch(hook, { method: 'POST' })
    if (!deploy.ok) {
      console.error('publish-site: deploy hook failed', deploy.status)
      return res.status(502).json({ error: 'Vercel did not accept the deploy request.' })
    }
    return res.status(200).json({ ok: true })
  } catch (e) {
    console.error('publish-site error', e)
    return res.status(502).json({ error: 'Could not start the publish.' })
  }
}
