import { useState } from "react";
import { useShopData } from "@/hooks/useShopData";
import ProductCard from "@/components/ProductCard";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { useCart } from "@/hooks/useCart";

type Section = "ALL" | "SMOKEHOUSE" | "BUTCHER";

export default function Shop() {
  const [activeSection, setActiveSection] = useState<Section>("ALL");
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const { totalItems, setIsOpen } = useCart();
  const { products, categories, isLoading } = useShopData();

  const filteredProducts = products.filter((p) => {
    if (activeSection !== "ALL" && p.section !== activeSection) return false;
    if (activeCategory && p.categoryId !== activeCategory) return false;
    return true;
  });

  const visibleCategories = categories.filter((cat) =>
    activeSection === "ALL" ? true : cat.section === activeSection
  );

  return (
    <div className="bg-charcoal min-h-screen">
      <Navigation />
      <CartDrawer />

      <div className="pt-[72px] px-6 md:px-10 py-16">
        <div className="max-w-[1280px] mx-auto text-center">
          <span className="section-label">ONLINE SHOP</span>
          <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] text-cream leading-tight mt-4">
            The Smokehouse &<br />The Butcher Block
          </h1>
          <p className="font-body text-base font-light text-[rgba(245,230,200,0.6)] mt-4 max-w-lg mx-auto">
            Premium smoked BBQ ready to eat, or raw cuts for your own grill.
            All meats sourced from the finest suppliers.
          </p>
        </div>
      </div>

      <div className="px-6 md:px-10 pb-8">
        <div className="max-w-[1280px] mx-auto flex flex-wrap justify-center gap-3">
          {(["ALL", "SMOKEHOUSE", "BUTCHER"] as Section[]).map((s) => (
            <button
              key={s}
              onClick={() => { setActiveSection(s); setActiveCategory(null); }}
              className={`px-6 py-2.5 rounded-full font-body text-xs uppercase tracking-[0.1em] transition-all duration-300 cursor-pointer border ${
                activeSection === s
                  ? "bg-ember text-charcoal border-ember"
                  : "bg-transparent text-smoke border-[rgba(196,148,58,0.2)] hover:border-ember hover:text-ember"
              }`}
            >
              {s === "ALL" ? "All Products" : s === "SMOKEHOUSE" ? "The Smokehouse" : "The Butcher Block"}
            </button>
          ))}
        </div>
      </div>

      {visibleCategories.length > 0 && (
        <div className="px-6 md:px-10 pb-8">
          <div className="max-w-[1280px] mx-auto flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-1.5 rounded font-body text-xs transition-all cursor-pointer ${
                activeCategory === null ? "text-ember" : "text-smoke hover:text-cream"
              }`}
            >
              All
            </button>
            {visibleCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-1.5 rounded font-body text-xs transition-all cursor-pointer ${
                  activeCategory === cat.id ? "text-ember" : "text-smoke hover:text-cream"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="px-6 md:px-10 pb-20">
        <div className="max-w-[1280px] mx-auto">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="w-8 h-8 border-2 border-ember border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : (
            <>
              {visibleCategories.map((cat) => {
                const catProducts = filteredProducts.filter((p) => p.categoryId === cat.id);
                if (catProducts.length === 0) return null;
                return (
                  <div key={cat.id} className="mb-12">
                    <div className="flex items-center gap-4 mb-6">
                      <h2 className="font-display text-2xl text-cream">{cat.name}</h2>
                      <div className="flex-1 h-px bg-[rgba(196,148,58,0.1)]" />
                      <span className="font-body text-xs text-smoke">{catProducts.length} items</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                      {catProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                );
              })}

              {filteredProducts.length === 0 && (
                <div className="text-center py-20">
                  <p className="font-body text-smoke">No products found.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[900] bg-ember text-charcoal w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-burnt transition-colors cursor-pointer"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M6 6h15l-1.5 9h-12L6 6z" />
          <circle cx="9" cy="20" r="1" />
          <circle cx="18" cy="20" r="1" />
          <path d="M6 6L5 3H2" />
        </svg>
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-burnt text-cream text-[0.6rem] font-semibold w-5 h-5 rounded-full flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </button>

      <Footer />
    </div>
  );
}
