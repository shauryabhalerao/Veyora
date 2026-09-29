import express from 'express';

const router = express.Router();

const mockProducts = [
  {
    id: "w-01",
    name: "The Column Dress",
    brand: "Veyora Studio",
    gender: "Women",
    category: "Dresses",
    price: 3499,
    originalPrice: 4299,
    discount: 18,
    rating: 4.9,
    reviewsCount: 128,
    inStock: true,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "w-02",
    name: "Structured Taupe Blazer",
    brand: "Veyora Atelier",
    gender: "Women",
    category: "Co-ords",
    price: 4499,
    originalPrice: 5999,
    discount: 25,
    rating: 4.8,
    reviewsCount: 94,
    inStock: true,
    image: "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=1000&q=80"
  }
];

router.get('/', (req, res) => {
  res.json({ success: true, count: mockProducts.length, data: mockProducts });
});

router.get('/:id', (req, res) => {
  const prod = mockProducts.find(p => p.id === req.params.id) || mockProducts[0];
  res.json({ success: true, data: prod });
});

export default router;
