import express from 'express';

const router = express.Router();

const mockProducts = [
  {
    id: "M001",
    name: "Urban Plaid Overshirt",
    brand: "Veyora Studio",
    gender: "Men",
    category: "Men",
    subcategory: "Jackets",
    price: 1499,
    originalPrice: 1999,
    discount: 25,
    rating: 4.8,
    reviewsCount: 64,
    inStock: true
  },
  {
    id: "W001",
    name: "Classic Black Long-Sleeve Top",
    brand: "Veyora Studio",
    gender: "Women",
    category: "Women",
    subcategory: "Tops",
    price: 899,
    originalPrice: 1199,
    discount: 25,
    rating: 4.8,
    reviewsCount: 78,
    inStock: true
  },
  {
    id: "K001",
    name: "Little Explorer Outfit",
    brand: "Veyora Junior",
    gender: "Kids",
    category: "Kids",
    subcategory: "Sets",
    price: 899,
    originalPrice: 1199,
    discount: 25,
    rating: 4.9,
    reviewsCount: 42,
    inStock: true
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
