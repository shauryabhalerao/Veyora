# Veyora — Luxury Fashion E-Commerce Platform

Veyora is a modern, high-end fashion e-commerce application featuring curated collections, an AI Personal Stylist concierge, interactive product quick-views, wishlist management, shopping cart, and seamless Razorpay payment integration.

---

## 🌟 Features

- **Luxury UI/UX**: Built with React, Tailwind CSS, Lucide icons, and smooth micro-animations.
- **AI Personal Stylist**: AI-powered outfit recommendations using Google Gemini API.
- **Interactive Shopping**: Real-time cart calculations, coupon codes, and interactive Quick View modal.
- **Wishlist & Filtering**: Filter by category, price, and color palette with persistent wishlist state.
- **Razorpay Checkout**: Seamless payment processing integration with fallback support for test mode.
- **Backend API**: Node.js & Express API with Prisma ORM and PostgreSQL database.

---

## 📁 Repository Structure

```
VEYORA/
├── frontend/          # React + Vite + Tailwind CSS client
│   ├── src/           # Components, Pages, Context, & Assets
│   └── package.json
├── backend/           # Node.js + Express + Prisma API server
│   ├── routes/        # API endpoints (products, orders, payments, AI)
│   ├── prisma/        # Database schema and migrations
│   └── package.json
├── .env.example       # Template for environment variables
├── .gitignore         # Git ignore rules
└── README.md          # Project documentation
```

---

## 🛠️ Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **PostgreSQL**: (Optional for local DB setup)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/shauryabhalerao/veyora.git
cd veyora
```

### 2. Configure Environment Variables

Create `.env` files based on `.env.example`:

**Backend environment file (`backend/.env`):**

```env
PORT=5001
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/veyora_db?schema=public"
JWT_SECRET="your_jwt_secret"
GEMINI_API_KEY="your_gemini_api_key"
RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
```

### 3. Install Dependencies & Run Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`.

### 4. Install Dependencies & Run Backend

```bash
cd ../backend
npm install
npx prisma db push
npm start
```

The backend server will run on `http://localhost:5001`.

---

## 📦 Vercel Deployment Guide

1. Push this repository to GitHub.
2. Connect your repository to [Vercel](https://vercel.com).
3. Set root directory to `frontend`.
4. Configure build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add required Environment Variables under Vercel Project Settings.

---

## 📄 License

Distributed under the MIT License.
