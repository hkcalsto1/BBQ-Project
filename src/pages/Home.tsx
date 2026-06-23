import { useLenis } from "@/hooks/useLenis";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HeroSection from "@/sections/HeroSection";
import AboutSection from "@/sections/AboutSection";
import MenuSection from "@/sections/MenuSection";
import ConfiguratorSection from "@/sections/ConfiguratorSection";
import ContactSection from "@/sections/ContactSection";
import CartDrawer from "@/components/CartDrawer";

function CateringBanner() {
  return (
    <section className="bg-charcoal py-16 px-6 md:px-10">
      <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16">
        {/* Text */}
        <div className="flex-1">
          <p className="font-body text-xs uppercase tracking-[0.2em] text-ember mb-3">Our Main Offering</p>
          <h2 className="font-display text-4xl md:text-5xl text-cream mb-5 leading-tight">
            Catering &<br />Private Events
          </h2>
          <p className="font-body text-smoke text-base leading-relaxed mb-6 max-w-md">
            Slow-smoked Texas BBQ delivered to your door — or pick up from Discovery Bay.
            Perfect for corporate events, weddings, birthdays, and private parties across all of Hong Kong.
          </p>
          <div className="flex flex-wrap gap-4 mb-8">
            {[
              ['HK$2,000', 'Minimum Order'],
              ['5 Days', 'Notice Required'],
              ['All HK', 'Delivery Area'],
              ['HK$150', 'Delivery Fee'],
            ].map(([value, label]) => (
              <div key={label} className="text-center">
                <p className="font-display text-xl text-ember">{value}</p>
                <p className="font-body text-[0.6rem] uppercase tracking-wider text-smoke">{label}</p>
              </div>
            ))}
          </div>
          <a
            href="#catering"
            onClick={(e) => { e.preventDefault(); document.getElementById('catering')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="inline-flex items-center gap-3 bg-ember text-charcoal px-8 py-4 rounded font-body text-sm uppercase tracking-[0.12em] hover:bg-burnt transition-colors cursor-pointer"
          >
            Build Your Order
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="2" y1="8" x2="14" y2="8" /><polyline points="9,3 14,8 9,13" />
            </svg>
          </a>
        </div>
        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-3 shrink-0 w-full md:w-auto">
          {[
            { emoji: '🥩', title: 'Slow Smoked', sub: 'Low & slow, 12–16 hrs' },
            { emoji: '🚚', title: 'HK-Wide', sub: 'All districts covered' },
            { emoji: '🎉', title: 'Any Event', sub: 'Corporate to weddings' },
            { emoji: '🏡', title: 'Free Pickup', sub: 'Discovery Bay' },
          ].map(({ emoji, title, sub }) => (
            <div key={title} className="bg-charcoal-light border border-[rgba(196,148,58,0.12)] rounded-xl p-5">
              <span className="text-2xl block mb-2">{emoji}</span>
              <p className="font-body text-sm font-semibold text-cream">{title}</p>
              <p className="font-body text-xs text-smoke mt-0.5">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  useLenis();

  return (
    <div className="bg-charcoal min-h-screen">
      <Navigation />
      <CartDrawer />
      <main>
        <HeroSection />
        <div className="h-px bg-[rgba(196,148,58,0.15)]" />
        <CateringBanner />
        <div className="h-px bg-[rgba(196,148,58,0.15)]" />
        <ConfiguratorSection />
        <div className="h-px bg-[rgba(196,148,58,0.15)]" />
        <AboutSection />
        <div className="h-px bg-[rgba(196,148,58,0.15)]" />
        <MenuSection />
        <div className="h-px bg-[rgba(196,148,58,0.15)]" />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
