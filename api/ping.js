export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ 
      status: 'success', 
      message: 'Vercel serverless function is up and running!' 
    });
  }
  
  return res.status(405).json({ error: 'Method Not Allowed' });
}