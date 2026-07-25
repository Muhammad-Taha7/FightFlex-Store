import React, { useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from './store/authSlice';

// Navbar Component
import { Navbar } from './Client/Components/Navbar';

// Client Pages
import Home from './Client/pages/Home';
import AuthPage from './Client/pages/AuthPage';
import ClientLoginPage from './Client/pages/ClientLoginPage';
import ForgotPasswordPage from './Client/pages/ForgotPasswordPage';
import Profile from './Client/pages/Profile';
import Orders from './Client/pages/Orders';
import { Men } from './Client/pages/Men';
import { Women } from './Client/pages/Women';
import { Accessories } from './Client/pages/Accessories';
import { Kids } from './Client/pages/Kids';
import { Nutirition } from './Client/pages/Nutirition';
import ProductDetail from './Client/pages/ProductDetail';
import Checkout from './Client/pages/Checkout';


// Admin Pages
import Login from './Admin/Auth/Login';
import Dashboard from './Admin/Dashboard';

// Protected Routes
import ProtectedRoute from './Components/ProtectedRoute';
import ClientProtectedRoute from './Components/ClientProtectedRoute';

// Client Layout Component with Navbar
const ClientLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
};

const App = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, token]);

  return (
    <Routes>
      {/* Auth / Login Routes WITHOUT Navbar */}
      <Route path="/client-login" element={<ClientLoginPage />} />
      <Route path="/signup" element={<AuthPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Client Routes WITH Navbar Header */}
      <Route element={<ClientLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/men" element={<Men />} />
        <Route path="/women" element={<Women />} />
        <Route path="/accessories" element={<Accessories />} />
        <Route path="/kids" element={<Kids />} />
        <Route path="/nutrition" element={<Nutirition />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/checkout" element={<Checkout />} />


        {/* Client Protected Routes */}
        <Route path="/profile" element={
          <ClientProtectedRoute>
            <Profile />
          </ClientProtectedRoute>
        } />
        <Route path="/orders" element={
          <ClientProtectedRoute>
            <Orders />
          </ClientProtectedRoute>
        } />
      </Route>

      {/* Admin Routes (Without Client Navbar) */}
      <Route path="/login" element={<Login />} />

      {/* Protected Admin Dashboard Route */}
      <Route
        path="/run/Dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Fallback to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;