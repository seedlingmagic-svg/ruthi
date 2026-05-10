const https = require('https');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { query, maxPrice, sortBy } = JSON.parse(event.body);

    const encodedQuery = encodeURIComponent(query);
    const storeLinks = {
      'Amazon': `https://www.amazon.com/s?k=${encodedQuery}`,
      'Walmart': `https://www.walmart.com/search?q=${encodedQuery}`,
      'Target': `https://www.target.com/s?searchTerm=${encodedQuery}`,
      'Whole Foods': `https://www.wholefoodsmarket.com/search?text=${encodedQuery}`,
      'Sprouts': `https://www.sprouts.com/search/?q=${encodedQuery}`,
      'Costco': `https://www.costco.com/CatalogSearch?keyword=${encodedQuery}`,
      'eBay': `https://www.ebay.com/sch/i.html?_nkw=${encodedQuery}`,
    };

    const priceInstruction = maxPrice ? `Only include results priced under $${maxPrice}.` : '';
    const sortInstruction = sortBy === 'price'
      ? 'Sort results from lowest to highest price.'
      : 'Sort by most relevant first.';

    const prompt = `You are a price comparison assistant. The user is searching for: "${query}".

Provide estimated prices for this product at these specific retailers: Amazon, Walmart, Target, Whole Foods, Sprouts, Costco, and eBay.

${priceInstruction}
${sortInstruction}

Return ONLY a raw JSON array. Each object must have:
- "store": one of the exact store names listed above
- "title": product name and size
- "price": number only, realistic estimate
- "unit": e.g. "12-pack", "per bottle"
- "inStock": true or false based on your best knowledge
- "note": always include "Estimated price — click to search this store"

Return 6-8 results. Return ONLY the JSON array, no markdown.`;

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
    let results = JSON.parse(clean);

    // Replace AI-generated URLs with real working search URLs
    results = results.map(r => ({
      ...r,
      url: storeLinks[r.store] || `https://www.google.com/search?tbm=shop&q=${encodedQuery}`
    }));

    if (maxPrice) results = results.filter(r => parseFloat(r.price) <= parseFloat(maxPrice));
    if (sortBy === 'price') results.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(results)
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
