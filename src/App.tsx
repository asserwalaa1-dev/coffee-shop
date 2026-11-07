import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import ProductSection from "./components/ProductSection";
import CoffeeBeanSection from "./components/CoffeeBeanSection";
import AboutSection from "./components/AboutSection";
import Footer from "./components/Footer";
import { useProducts } from "./hooks/useProducts";
import { useCoffeeBeans } from "./hooks/useCoffeeBeans";
import { useCafeInfo } from "./hooks/useCafeInfo";
import "../src/customStyles/style.css";
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
    <div className="bg-dark text-white min-vh-100">
      <Navbar
        cafeName={cafeInfo?.Name ?? null}
        whatsappUrl={cafeInfo?.whatsapp_url ?? null}
      />{" "}
      <main>
        <HeroSection />

        {productsLoading ? (
          <p className="text-center py-5">Loading products...</p>
        ) : productsError ? (
          <p className="text-center text-danger py-5">{productsError}</p>
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
