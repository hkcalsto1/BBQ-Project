import { Routes, Route } from "react-router";
import { CartProvider } from "@/hooks/useCart";
import { CateringProvider } from "@/hooks/useCateringContext";
import { TRPCProvider } from "@/providers/trpc";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import Checkout from "@/pages/Checkout";
import Admin from "@/pages/Admin";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <TRPCProvider>
      <CartProvider>
        <CateringProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </CateringProvider>
      </CartProvider>
    </TRPCProvider>
  );
}

export default App;
