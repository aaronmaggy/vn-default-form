// Vercel serverless function — proxies Jira issue creation server-side (no CORS issues)
// Place this file at: api/create-issue.js in your repo root

export default async function handler(req, res) {
  // Allow the browser to call this endpoint
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const auth = req.headers['authorization'];
  if (!auth) return res.status(400).json({ error: 'Missing Authorization header' });

  const jiraRes = await fetch('https://centerfieldmedia.atlassian.net/rest/api/3/issue', {
    method: 'POST',
    headers: {
      'Authorization': auth,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(req.body),
  });

  const data = await jiraRes.json();
  return res.status(jiraRes.status).json(data);
}
