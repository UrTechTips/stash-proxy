// api/github-issue.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (req.headers['x-app-identifier'] !== 'stash-mobile-v1') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { title, body } = req.body;

  try {
    const githubRes = await fetch(`https://api.github.com/repos/YOUR_USERNAME/Stash/issues`, {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${process.env.GITHUB_PAT}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, body, labels: ['user-feedback'] })
    });

    if (!githubRes.ok) throw new Error('GitHub API failed');
    
    const data = await githubRes.json();
    return res.status(200).json({ url: data.html_url });

  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}