import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useCart } from "@/hooks/useCart";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems, setIsOpen } = useCart();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    if (!isHome) {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 300);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[1000] h-[72px] flex items-center justify-between px-6 md:px-10 transition-all duration-500 ${
          scrolled || !isHome
            ? "bg-[rgba(10,10,10,0.95)] backdrop-blur-lg border-b border-[rgba(196,148,58,0.08)]"
            : "bg-transparent"
        }`}
      >
        <Link to="/" className="font-display text-2xl text-cream tracking-tight">
          SmokeHouse HK
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollTo("home")}
            className="font-body text-xs uppercase tracking-[0.1em] text-smoke hover:text-ember transition-colors cursor-pointer"
          >
            Home
          </button>
          <Link
            to="/shop"
            className="font-body text-xs uppercase tracking-[0.1em] text-smoke hover:text-ember transition-colors"
          >
            Shop
          </Link>
          <button
            onClick={() => scrollTo("about")}
            className="font-body text-xs uppercase tracking-[0.1em] text-smoke hover:text-ember transition-colors cursor-pointer"
          >
            About
          </button>
          <button
            onClick={() => scrollTo("contact")}
            className="font-body text-xs uppercase tracking-[0.1em] text-smoke hover:text-ember transition-colors cursor-pointer"
          >
            Contact
          </button>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {/* Cart */}
          <button
            onClick={() => setIsOpen(true)}
            className="relative text-smoke hover:text-ember transition-colors cursor-pointer"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 6h15l-1.5 9h-12L6 6z" />
              <circle cx="9" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
              <path d="M6 6L5 3H2" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-burnt text-cream text-[0.5rem] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
          <Link to="/shop" className="pill-button-primary py-2.5 px-6">
            ORDER NOW
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2 cursor-pointer"
        >
          <span className={`block w-6 h-0.5 bg-cream transition-transform duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-cream transition-opacity ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-cream transition-transform duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </nav>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[999] bg-charcoal flex flex-col items-center justify-center gap-8">
          <button onClick={() => setMobileOpen(false)} className="absolute top-6 right-6 text-cream cursor-pointer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="4" y1="4" x2="20" y2="20" />
              <line x1="20" y1="4" x2="4" y2="20" />
            </svg>
          </button>
          <button onClick={() => { scrollTo("home"); }} className="font-body text-2xl uppercase text-cream hover:text-ember transition-colors cursor-pointer">Home</button>
          <Link to="/shop" onClick={() => setMobileOpen(false)} className="font-body text-2xl uppercase text-cream hover:text-ember transition-colors">Shop</Link>
          <button onClick={() => { scrollTo("about"); }} className="font-body text-2xl uppercase text-cream hover:text-ember transition-colors cursor-pointer">About</button>
          <button onClick={() => { scrollTo("contact"); }} className="font-body text-2xl uppercase text-cream hover:text-ember transition-colors cursor-pointer">Contact</button>
          <button
            onClick={() => { setIsOpen(true); setMobileOpen(false); }}
            className="font-body text-sm uppercase tracking-wider text-ember flex items-center gap-2 cursor-pointer"
          >
            Cart ({totalItems})
          </button>
          <Link to="/shop" onClick={() => setMobileOpen(false)} className="pill-button-primary mt-4">ORDER NOW</Link>
        </div>
      )}
    </>
  );
}
