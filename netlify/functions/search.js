const https = require('https');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    if (!process.env.ANTHROPIC_API_KEY) { return { statusCode: 500, body: JSON.stringify({ error: 'API key not found in environment' }) }; }
    const { query, maxPrice, sortBy } = JSON.parse(event.body);

    const priceInstruction = maxPrice ? `Only include results priced under $${maxPrice}.` : '';
    const sortInstruction = sortBy === 'price'
      ? 'Sort results from lowest to highest price.'
      : 'Sort by most relevant first.';

    const prompt = `You are a price comparison assistant. The user is searching for: "${query}". Find this product across major retailers: Amazon, Walmart, Target, Whole Foods, Sprouts, Costco, and eBay. ${priceInstruction} ${sortInstruction} Return ONLY a raw JSON array. Each object must have: "store", "title", "price" (number only), "unit", "url", "inStock" (true/false), "note". Provide realistic estimates if exact prices unknown, note "Estimated price" in note field. Return 6-8 results. Return ONLY the JSON array.`;

    const requestBody = JSON.stringify({
      model: 'claude-sonnet-4-5',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }]
    });

    const result = await new Promise((resolve, reject) => {
      const req = https.request({
        hostname: 'api.anthropic.com',
        path: '/v1/messages',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'Content-Length': Buffer.byteLength(requestBody)
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      });
      req.on('error', reject);
      req.write(requestBody);
      req.end();
    });

    if (result.error) throw new Error(result.error.message);

    const raw = result.content.map(b => b.text || '').join('');
    const clean = raw.replace(/```json|```/g, '').trim();
    const results = JSON.parse(clean);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(results)
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message, stack: err.stack, key_exists: !!process.env.ANTHROPIC_API_KEY })
    };
  }
};
