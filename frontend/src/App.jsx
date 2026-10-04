import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { ToastProvider } from './context/ToastContext';

import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

import { AIPersonalStylistModal } from './components/ai/AIPersonalStylistModal';
import { AIFindLookModal } from './components/ai/AIFindLookModal';
import { FloatingAIAssistant } from './components/ai/FloatingAIAssistant';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { UserAccountPage } from './pages/UserAccountPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { LookbookPage } from './pages/LookbookPage';
import { WishlistPage } from './pages/WishlistPage';

import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ProtectedRoute } from './routes/ProtectedRoute';

import { AboutPage } from './pages/support/AboutPage';
import { FAQPage } from './pages/support/FAQPage';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CurrencyProvider>
          <CartProvider>
            <WishlistProvider>
              <ToastProvider>
                <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1C1917] selection:bg-[#F9ECE6]">
                  
                  {/* Top Announcement Bar */}
                  <AnnouncementBar />

                  {/* Header Sticky Navigation */}
                  <Header />

                  {/* Main Page Routes */}
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/shop" element={<ShopPage />} />
                      <Route path="/product/:id" element={<ProductDetailPage />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/signup" element={<SignupPage />} />
                      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                      <Route 
                        path="/account" 
                        element={
                          <ProtectedRoute>
                            <UserAccountPage />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/admin" 
                        element={
                          <ProtectedRoute requireAdmin={true}>
                            <AdminDashboardPage />
                          </ProtectedRoute>
                        } 
                      />
                      <Route path="/lookbook" element={<LookbookPage />} />
                      <Route path="/wishlist" element={<WishlistPage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/faq" element={<FAQPage />} />
                    </Routes>
                  </main>

                  {/* Global AI Feature Modals & Assistant */}
                  <AIPersonalStylistModal />
                  <AIFindLookModal />
                  <FloatingAIAssistant />

                  {/* Footer */}
                  <Footer />

                </div>
              </ToastProvider>
            </WishlistProvider>
          </CartProvider>
        </CurrencyProvider>
      </AuthProvider>
    </Router>
  );
}
