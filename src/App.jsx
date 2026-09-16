import React, { lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider, CartProvider, SettingsProvider } from './context/AppContext'
import { ConfirmProvider } from './components/ui/ConfirmDialog'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/layout/Layout'
import AdminLayout from './admin/AdminLayout'

/* Route-level code splitting. Each page chunk is fetched only when needed. */
const Home = lazy(() => import('./pages/Home'))
const Shop = lazy(() => import('./pages/Shop'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Customize = lazy(() => import('./pages/Customize'))
const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const OrderConfirmed = lazy(() => import('./pages/OrderConfirmed'))
const Account = lazy(() => import('./pages/Account'))
const UserDashboard = lazy(() => import('./pages/Dashboard'))
const Login = lazy(() => import('./pages/Login'))
const Contact = lazy(() => import('./pages/Contact'))
const About = lazy(() => import('./pages/About'))
const NotFound = lazy(() => import('./pages/NotFound'))

const Dashboard = lazy(() => import('./admin/pages/Dashboard'))
const AdminProducts = lazy(() => import('./admin/pages/AdminProducts'))
const AdminOrders = lazy(() => import('./admin/pages/AdminOrders'))
const AdminCustomOrders = lazy(() => import('./admin/pages/AdminCustomOrders'))
const AdminUsers = lazy(() => import('./admin/pages/AdminUsers'))
const AdminMessages = lazy(() => import('./admin/pages/AdminMessages'))
const AdminSettings = lazy(() => import('./admin/pages/AdminSettings'))

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <SettingsProvider>
            <CartProvider>
              <ConfirmProvider>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:slug" element={<ProductDetail />} />
                    <Route path="/customize" element={<Customize />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order/:no" element={<OrderConfirmed />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/dashboard" element={<UserDashboard />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/404" element={<NotFound />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="custom" element={<AdminCustomOrders />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="messages" element={<AdminMessages />} />
                    <Route path="settings" element={<AdminSettings />} />
                  </Route>
                </Routes>
              </ConfirmProvider>
            </CartProvider>
          </SettingsProvider>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  )
}