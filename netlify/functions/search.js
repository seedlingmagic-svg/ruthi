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
  'Sprouts': `https://shop.sprouts.com/search?search=${encodedQuery}`,
  'Costco': `https://www.costco.com/CatalogSearch?keyword=${encodedQuery}`,
  'eBay': `https://www.ebay.com/sch/i.html?_nkw=${encodedQuery}`,
  'HEB': `https://www.heb.com/search/?q=${encodedQuery}`,
  'Kroger': `https://www.kroger.com/search?query=${encodedQuery}`,
  'Randalls': `https://www.randalls.com/search?q=${encodedQuery}`,
  'Central Market': `https://www.centralmarket.com/search?q=${encodedQuery}`,
  'Sams Club': `https://www.samsclub.com/s/${encodedQuery}`,
  'Walgreens': `https://www.walgreens.com/search/results.jsp?Ntt=${encodedQuery}`,
  'CVS': `https://www.cvs.com/search/${encodedQuery}`,
  'Dollar Tree': `https://www.dollartree.com/search/results/${encodedQuery}`,
  'Family Dollar': `https://www.familydollar.com/search?q=${encodedQuery}`,
  'Best Buy': `https://www.bestbuy.com/site/searchpage.jsp?st=${encodedQuery}`,
  'Staples': `https://www.staples.com/search?query=${encodedQuery}`,
  'Office Depot': `https://www.officedepot.com/catalog/search.do?Ntt=${encodedQuery}`,
  'Home Depot': `https://www.homedepot.com/s/${encodedQuery}`,
  'Lowes': `https://www.lowes.com/search?searchTerm=${encodedQuery}`,
  'Kohls': `https://www.kohls.com/search/submit.jsp?search=${encodedQuery}`,
  'Dillards': `https://www.dillards.com/search?q=${encodedQuery}`,
  'Michaels': `https://www.michaels.com/search?q=${encodedQuery}`,
  'Dicks Sporting Goods': `https://www.dickssportinggoods.com/search?q=${encodedQuery}`,
  'At Home': `https://www.athome.com/search?q=${encodedQuery}`,
  'Container Store': `https://www.containerstore.com/search?q=${encodedQuery}`,
  'Vitamin Shoppe': `https://www.vitaminshoppe.com/search?q=${encodedQuery}`,
  'Camping World': `https://www.campingworld.com/search?q=${encodedQuery}`,
  'Finish Line': `https://www.finishline.com/store/search?query=${encodedQuery}`,
  'Specs': `https://www.specsonline.com/search?q=${encodedQuery}`,
  'HMart': `https://www.hmart.com/search?q=${encodedQuery}`,
  'Fiesta Market': `https://www.fiestamartllc.com/search?q=${encodedQuery}`,
  'El Rancho': `https://www.elranchosupermercado.com/search?q=${encodedQuery}`,
  'Wild Fork': `https://wildforkfoods.com/search?q=${encodedQuery}`,
  'Restaurant Depot': `https://www.restaurantdepot.com/search?q=${encodedQuery}`,
  '99 Ranch': `https://www.99ranch.com/search?q=${encodedQuery}`,
  'Georgetown Market': `https://www.instacart.com/store/georgetown/storefront`,
  'Harvest Market': `https://www.goharvestmarket.com/search?q=${encodedQuery}`,
  'The Fresh Market': `https://www.thefreshmarket.com/search?q=${encodedQuery}`,
  'Meijer': `https://www.meijer.com/shopping/search.html?text=${encodedQuery}`,
  'Fresh Thyme': `https://www.freshthyme.com/search?q=${encodedQuery}`,
  'Market District': `https://www.marketdistrict.com/search?q=${encodedQuery}`,
  'Sur La Table': `https://www.surlatable.com/search?q=${encodedQuery}`, 
  'Foot Locker': `https://www.footlocker.com/search?q=${encodedQuery}`,
  'Macys': `https://www.macys.com/search?q=${encodedQuery}`,
  'Erewhon': `https://www.erewhonmarket.com/search?q=${encodedQuery}`,
  'Gelsons': `https://www.gelsons.com/search?q=${encodedQuery}`,
  'Ralphs': `https://www.ralphs.com/search?query=${encodedQuery}`,
  'Food4Less': `https://www.food4less.com/search?query=${encodedQuery}`,
  'Vons': `https://www.vons.com/search?query=${encodedQuery}`,
  'Albertsons': `https://www.albertsons.com/search?query=${encodedQuery}`,
  'Pavilions': `https://www.pavilions.com/search?query=${encodedQuery}`,
  'Northgate Market': `https://www.northgatemarket.com/search?q=${encodedQuery}`,
  'Super King': `https://www.superkingmarkets.com/search?q=${encodedQuery}`,
  'El Super': `https://www.elsupermarkets.com/search?q=${encodedQuery}`,
  'Bristol Farms': `https://www.bristolfarms.com/search?q=${encodedQuery}`,
  'Lazy Acres': `https://www.lazyacres.com/search?q=${encodedQuery}`,
  'Smart and Final': `https://www.smartandfinal.com/search?q=${encodedQuery}`,
  'Mothers Market': `https://www.mothersmarket.com/search?q=${encodedQuery}`,
  'Jons Fresh Marketplace': `https://www.jonsmarketplace.com/search?q=${encodedQuery}`,
  'Seafood City': `https://www.seafoodcity.com/search?q=${encodedQuery}`,
  'Grocery Outlet': `https://www.groceryoutlet.com/search?q=${encodedQuery}`,
  'Mitsuwa Marketplace': `https://www.mitsuwa.com/search?q=${encodedQuery}`,
  'Tokyo Central': `https://www.tokyocentral.com/search?q=${encodedQuery}`,
  'BevMo': `https://www.bevmo.com/search?q=${encodedQuery}`,
  'Petco': `https://www.petco.com/shop/en/petcostore/search?query=${encodedQuery}`,
  'PetSmart': `https://www.petsmart.com/search?q=${encodedQuery}`,
  'Pet Food Express': `https://www.petfoodexpress.com/search?q=${encodedQuery}`,
  'Co-opportunity Market': `https://www.coopportunity.com/search?q=${encodedQuery}`,
  'Western Kosher': `https://www.westernkosher.com/search?q=${encodedQuery}`,   
   };

    const priceInstruction = maxPrice ? `Only include results priced under $${maxPrice}.` : '';
    const sortInstruction = sortBy === 'price'
      ? 'Sort results from lowest to highest price.'
      : 'Sort by most relevant first.';

    const prompt = `You are a price comparison assistant. The user is searching for: "${query}".

Provide estimated prices for this product at the most relevant retailers from this list: Amazon, Walmart, Target, HEB, Kroger, Sprouts, Whole Foods, Central Market, Costco, Sams Club, Best Buy, Staples, Office Depot, Home Depot, Lowes, CVS, Walgreens, Dollar Tree, Dicks Sporting Goods, Michaels, Kohls, Dillards, At Home, Vitamin Shoppe, eBay, Randalls, Family Dollar, Container Store, Camping World, Finish Line, Specs, HMart, Fiesta Market, El Rancho, Wild Fork, Restaurant Depot, 99 Ranch, Georgetown Market, Harvest Market, The Fresh Market, Meijer, Fresh Thyme, Market District, Sur La Table, Foot Locker, Macys, Erewhon, Co-opportunity Market, Gelsons, Ralphs, Food4Less, Vons, Albertsons, Pavilions, Northgate Market, Super King, El Super, Bristol Farms, Lazy Acres, Petco, Petsmart, Smart and Final, Smart & Final, Mother’s Market, Jons Fresh Marketplace, Seafood City Supermarket, Grocery Outlet, Western Kosher, Pet Food Express, BevMo, Mitsuwa Marketplace, Tokyo Central, and other relevant stores from the list. Only include stores that very likely carry this specific product based on their known inventory. Do not include a store if there is reasonable doubt they carry it. Fewer accurate results are better than more inaccurate ones.

${priceInstruction}
${sortInstruction}

Return ONLY a raw JSON array. Each object must have:
- "store": one of the exact store names listed above
- "title": product name and size
- "price": number only, realistic estimate
- "unit": e.g. "12-pack", "per bottle"
- "inStock": true or false based on your best knowledge
- "note": always include "Estimated price — click to search this store"

Return 6-12 results. Return ONLY the JSON array, no markdown.`;

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
