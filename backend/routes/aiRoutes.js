import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  return apiKey ? new GoogleGenerativeAI(apiKey) : null;
};

// 1. AI Personal Stylist Endpoint
router.post('/stylist', async (req, res) => {
  const { prompt } = req.body;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      const genAI = getGeminiClient();
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const systemPrompt = `You are Veyora's Senior AI Fashion Concierge.
Given the user request: "${prompt}", curate an outfit recommendation in JSON format:
{
  "title": "Short elegant title",
  "whyItWorks": "1-2 sentences on drape, texture and silhouette balance",
  "items": [
    {"name": "Item 1", "category": "Top", "price": 2499, "image": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80"},
    {"name": "Item 2", "category": "Bottom", "price": 1899, "image": "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=600&q=80"}
  ],
  "totalPrice": 4398
}`;

      const result = await model.generateContent(systemPrompt);
      const text = result.response.text();
      try {
        const json = JSON.parse(text.replace(/```json|```/g, '').trim());
        return res.json(json);
      } catch (parseErr) {
        console.warn('Gemini text parse fallback:', text);
      }
    }
  } catch (err) {
    console.warn('Gemini API call warning:', err.message);
  }

  // Smart fallback recommendation if Gemini API key not present or rate limited
  return res.json({
    title: "The Classy Farewell Silhouette",
    whyItWorks: "This ensemble balances rich textures with fluid tailoring. The deep tones create an elongated classy frame, perfect for photo sessions and evening celebrations.",
    items: [
      { id: "w-01", name: "The Column Dress", category: "Dresses", price: 3499, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80" },
      { id: "w-06", name: "Minimalist Leather Tote Bag", category: "Accessories", price: 3299, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80" }
    ],
    totalPrice: 6798,
    alternatives: [
      { name: "Pure Chanderi Silk Kurti Set", price: 2999 },
      { name: "Structured Taupe Blazer", price: 4499 }
    ]
  });
});

// 2. Find This Look Endpoint (Visual Search Replacement)
router.post('/find-look', async (req, res) => {
  const { image } = req.body;

  return res.json({
    analysis: {
      identifiedItems: ["Beige Oversized Blazer", "Ribbed White Top", "Black Wide-Leg Trousers"],
      dominantColors: ["Beige / Taupe", "Pure White", "Obsidian Black"],
      styleCategory: "Smart Casual / Quiet Luxury"
    },
    products: [
      { id: "w-02", name: "Structured Taupe Blazer", brand: "Veyora Atelier", price: 4499, image: "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=1000&q=80", colors: [{ name: "Taupe Beige" }], sizes: ["S", "M", "L"] },
      { id: "w-05", name: "Ribbed Knit Halter Top", brand: "Veyora Basics", price: 899, image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80", colors: [{ name: "Pure White" }], sizes: ["S", "M"] },
      { id: "w-04", name: "Classic High-Rise Wide-Leg Trousers", brand: "Veyora Studio", price: 1899, image: "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=1000&q=80", colors: [{ name: "Obsidian Black" }], sizes: ["M", "L"] }
    ],
    totalPrice: 7297
  });
});

export default router;
