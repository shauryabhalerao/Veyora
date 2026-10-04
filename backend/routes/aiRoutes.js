import express from 'express';
import { GoogleGenAI } from '@google/genai';
import prisma from '../lib/prisma.js';
import { initialProducts } from '../data/initialCatalog.js';

const router = express.Router();

const getGenAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

// Resilient list of Gemini models for automatic failover
const CANDIDATE_MODELS = [
  'gemini-3.5-flash',
  'gemini-3.8-flash',
  'gemini-flash-latest',
  'gemini-3.1-flash-lite'
];

/**
 * Helper to call Gemini API with automatic candidate model failover and retries
 */
const generateGeminiContent = async (ai, contents) => {
  let lastErr = null;
  
  for (const modelName of CANDIDATE_MODELS) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents
        });
        if (response && response.text) {
          return { text: response.text, model: modelName };
        }
      } catch (err) {
        lastErr = err;
        console.warn(`Gemini model ${modelName} (attempt ${attempt}) warning:`, err.message || err);
        if (attempt === 1 && (err.status === 503 || err.message?.includes('503'))) {
          await new Promise(res => setTimeout(res, 300));
        }
      }
    }
  }

  throw lastErr || new Error('All candidate Gemini models failed to respond.');
};

/**
 * TASK 7: Simple Test Endpoint
 * GET /api/ai/test
 */
router.get('/test', async (req, res) => {
  try {
    const ai = getGenAIClient();
    if (!ai) {
      return res.status(401).json({
        success: false,
        error: 'GEMINI_API_KEY is missing from server configuration.'
      });
    }

    const { text, model } = await generateGeminiContent(ai, 'Reply with: Veyora AI is working.');

    return res.json({
      success: true,
      message: text.trim(),
      model,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in /api/ai/test:', error.message || error);
    
    if (error.status === 429 || error.message?.includes('429') || error.message?.includes('quota')) {
      return res.status(429).json({
        success: false,
        error: 'Gemini API rate limit or quota exceeded. Please try again shortly.'
      });
    }

    if (error.status === 503 || error.message?.includes('503')) {
      return res.status(503).json({
        success: false,
        error: 'Gemini AI service is experiencing temporary high demand. Please retry.'
      });
    }

    return res.status(500).json({
      success: false,
      error: `Gemini API test failed: ${error.message || 'Server error'}`
    });
  }
});

/**
 * TASK 3 & 4: AI Fashion Stylist Endpoint
 * POST /api/ai/stylist
 */
router.post('/stylist', async (req, res) => {
  try {
    const { message, prompt, gender, occasion, budget } = req.body;
    const userPrompt = message || prompt || 'I need a stylish outfit recommendation.';

    if (!userPrompt || typeof userPrompt !== 'string' || userPrompt.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid styling request message or prompt.'
      });
    }

    // 1. Fetch Real Veyora Products from Database (or Fallback Catalog)
    let catalogItems = [];
    try {
      const dbProducts = await prisma.product.findMany({
        take: 30,
        select: {
          id: true,
          name: true,
          brand: true,
          gender: true,
          category: true,
          subcategory: true,
          price: true,
          image: true,
          colors: true,
          sizes: true
        }
      });
      if (dbProducts && dbProducts.length > 0) {
        catalogItems = dbProducts;
      }
    } catch (dbError) {
      console.warn('Prisma DB fetch fallback to local catalog:', dbError.message);
    }

    // Fallback to static catalog if DB is empty
    if (catalogItems.length === 0 && initialProducts && initialProducts.length > 0) {
      catalogItems = initialProducts.map(p => ({
        id: p.id,
        name: p.name,
        brand: p.brand || 'Veyora',
        gender: p.gender,
        category: p.category,
        subcategory: p.subcategory || p.category,
        price: p.price,
        image: typeof p.image === 'string' ? p.image : '/assets/placeholder.jpg'
      }));
    }

    const catalogContext = JSON.stringify(catalogItems.slice(0, 30));

    // 2. Initialize Gemini AI Client
    const ai = getGenAIClient();
    if (!ai) {
      console.error('Stylist Error: GEMINI_API_KEY is missing');
      return res.status(500).json({
        success: false,
        error: 'GEMINI_API_KEY is not configured on the backend server.'
      });
    }

    // 3. System Prompt Enforcing Catalog Constraints (TASK 3 & 4)
    const systemInstruction = `You are Veyora's AI Fashion Stylist. Help customers choose clothing from the Veyora catalog. Give practical outfit recommendations. Do not invent products that do not exist in the supplied catalog.

AVAILABLE VEYORA CATALOG INVENTORY:
${catalogContext}

USER REQUEST METADATA:
- User Message: "${userPrompt}"
- Target Gender: "${gender || 'Any'}"
- Occasion: "${occasion || 'General'}"
- Maximum Budget: "${budget ? '₹' + budget : 'Flexible'}"

CRITICAL STYLING RULES:
1. Recommend ONLY items present in the SUPPLIED CATALOG INVENTORY above. Do not invent new item names or IDs.
2. Match requested Gender (Men / Women / Kids), Occasion, and Budget limits strictly.
3. Select 2-3 complimentary items that form a complete look (e.g. Top + Bottom, or Dress + Jacket).
4. Respond strictly in raw JSON format (no markdown code blocks, no trailing comments) with this structure:
{
  "title": "Short, elegant outfit title",
  "whyItWorks": "2 sentences explaining silhouette balance, color harmony, and suitability",
  "items": [
    {
      "id": "exact_catalog_id",
      "name": "exact_catalog_name",
      "category": "category_name",
      "price": 1499,
      "image": "image_url_or_path"
    }
  ],
  "totalPrice": 2998,
  "alternatives": [
    { "name": "Alternative Item Name", "price": 999 }
  ]
}`;

    // 4. Generate Content with Gemini AI using resilient model failover
    let rawText = '';
    let usedModel = '';
    try {
      const resResult = await generateGeminiContent(ai, `${systemInstruction}\n\nCustomer Request: ${userPrompt}`);
      rawText = resResult.text;
      usedModel = resResult.model;
    } catch (apiError) {
      console.error('Gemini API call failed across all candidate models:', apiError.message || apiError);

      if (apiError.status === 429 || apiError.message?.includes('429') || apiError.message?.includes('quota')) {
        return res.status(429).json({
          success: false,
          error: 'Gemini AI rate limit reached. Please wait a moment and try again.'
        });
      }

      if (apiError.status === 503 || apiError.message?.includes('503')) {
        return res.status(503).json({
          success: false,
          error: 'Gemini AI service is experiencing high demand. Please try clicking Generate again.'
        });
      }

      return res.status(500).json({
        success: false,
        error: `Failed to generate styling advice from Gemini AI: ${apiError.message || 'Service error'}`
      });
    }

    // 5. Clean & Parse JSON Output
    try {
      const cleaned = rawText.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      if (parsed && parsed.title && Array.isArray(parsed.items)) {
        // Hydrate items with actual images from catalog if missing
        parsed.items = parsed.items.map(item => {
          const match = catalogItems.find(c => c.id === item.id || c.name.toLowerCase() === item.name.toLowerCase());
          return {
            id: match?.id || item.id,
            name: match?.name || item.name,
            category: match?.subcategory || match?.category || item.category || 'Garment',
            price: match?.price || item.price || 999,
            image: match?.image || item.image || '/assets/placeholder.jpg'
          };
        });

        parsed.totalPrice = parsed.items.reduce((sum, item) => sum + (item.price || 0), 0);

        return res.json({
          success: true,
          model: usedModel,
          ...parsed
        });
      }
    } catch (parseError) {
      console.warn('Failed to parse Gemini JSON output:', parseError.message);
    }

    return res.status(500).json({
      success: false,
      error: 'Received invalid response structure from Gemini AI.'
    });

  } catch (error) {
    console.error('Server error in /api/ai/stylist:', error);
    return res.status(500).json({
      success: false,
      error: 'An internal server error occurred while processing your AI request.'
    });
  }
});

/**
 * Find Look Endpoint
 * POST /api/ai/find-look
 */
router.post('/find-look', async (req, res) => {
  try {
    const { query } = req.body;
    const searchPrompt = query || 'Casual outfit for college';

    const ai = getGenAIClient();
    if (!ai) {
      return res.status(500).json({ success: false, error: 'GEMINI_API_KEY is not configured.' });
    }

    const { text } = await generateGeminiContent(ai, `You are Veyora's AI Visual Look Finder. Analyze "${searchPrompt}" and return raw valid JSON:
{
  "analysis": {
    "identifiedItems": ["Classic Black Top", "Urban Cropped Jacket"],
    "dominantColors": ["Black", "Beige"],
    "styleCategory": "Casual / Streetwear"
  },
  "products": [
    { "id": "W001", "name": "Classic Black Long-Sleeve Top", "brand": "Veyora Studio", "price": 899 }
  ],
  "totalPrice": 899
}`);

    if (text) {
      try {
        const cleaned = text.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        return res.json({ success: true, ...parsed });
      } catch (err) {
        console.warn('Failed to parse Find Look response:', err.message);
      }
    }

    return res.status(500).json({ success: false, error: 'Failed to process visual look request.' });
  } catch (err) {
    console.error('Error in /api/ai/find-look:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
