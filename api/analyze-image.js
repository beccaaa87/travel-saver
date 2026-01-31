export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image, mediaType } = req.body;

    // Call Anthropic API from server side (no CORS issues)
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType,
                  data: image
                }
              },
              {
                type: 'text',
                text: `Analyze this Instagram/TikTok screenshot and extract place information. Look for location tags, place names in captions, text overlays, addresses, and restaurant/hotel/attraction names.

Return ONLY valid JSON (no markdown, no code fences, no extra text) with this exact structure:
{
  "placeName": "Name of the place",
  "city": "City name",
  "country": "Country",
  "description": "Brief description from caption or context",
  "category": "restaurant/hotel/attraction/cafe/bar/other"
}

If no clear place is found, set placeName to null.`
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();
    
    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }

    return res.status(200).json(data);
    
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
