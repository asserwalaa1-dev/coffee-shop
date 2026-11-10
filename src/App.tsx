import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import ProductSection from "./components/ProductSection";
import CoffeeBeanSection from "./components/CoffeeBeanSection";
import AboutSection from "./components/AboutSection";
import Footer from "./components/Footer";

import { useProducts } from "./hooks/useProducts";
import { useCoffeeBeans } from "./hooks/useCoffeeBeans";
import { useCafeInfo } from "./hooks/useCafeInfo";

import ProductDetailsPage from "./pages/ProductDetailsPage";
import CoffeeBeanDetailsPage from "./pages/CoffeeBeanDetailsPage";
import ReservationPage from "./pages/ReservationPage";

// Admin Dashboard
import AdminLoginPage from "./admin/pages/AdminLoginPage";
import AdminDashboardPage from "./admin/pages/AdminDashboardPage";
import AdminLayout from "./admin/layouts/AdminLayout";
import AdminProtectedRoute from "./admin/components/AdminProtectedRoute";
import AdminForgotPasswordPage from "./admin/pages/AdminForgotPasswordPage";
import AdminResetPasswordPage from "./admin/pages/AdminResetPassword";
import AdminProductsPage from "./admin/pages/AdminProductsPage";

function App() {
  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useProducts();

  const {
    coffeeBeans,
    loading: beansLoading,
    error: beansError,
  } = useCoffeeBeans();

  const {
    cafeInfo,
    loading: cafeInfoLoading,
    error: cafeInfoError,
  } = useCafeInfo();

  return (
    <div className="bg-dark text-white min-vh-100 w-100">
      <Navbar
        cafeName={cafeInfo?.Name ?? null}
        whatsappUrl={cafeInfo?.whatsapp_url ?? null}
      />

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <HeroSection />

                {productsLoading ? (
                  <p className="text-center py-5">Loading products...</p>
                ) : productsError ? (
                  <p className="text-center text-danger py-5">
                    {productsError}
                  </p>
                ) : (
                  <ProductSection products={products} />
                )}

                {beansLoading ? (
                  <p className="text-center py-5">Loading coffee beans...</p>
                ) : beansError ? (
                  <p className="text-center text-danger py-5">{beansError}</p>
                ) : (
                  <CoffeeBeanSection coffeeBeans={coffeeBeans} />
                )}

                <AboutSection />
              </>
            }
          />

          <Route path="/products/:id" element={<ProductDetailsPage />} />

          <Route path="/coffee-beans/:id" element={<CoffeeBeanDetailsPage />} />

          <Route path="/reservation" element={<ReservationPage />} />

          {/* Admin Authentication */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          <Route
            path="/admin/forgot-password"
            element={<AdminForgotPasswordPage />}
          />

          <Route
            path="/admin/reset-password"
            element={<AdminResetPasswordPage />}
          />

          {/* Protected Admin Routes */}
          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />

              <Route path="products" element={<AdminProductsPage />} />
            </Route>
          </Route>
        </Routes>
      </main>

      {cafeInfoError ? (
        <p className="text-center text-danger py-3">{cafeInfoError}</p>
      ) : (
        <Footer cafeInfo={cafeInfoLoading ? null : cafeInfo} />
      )}
    </div>
  );
}

export default App;
