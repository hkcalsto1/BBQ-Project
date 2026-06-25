import { useLenis } from "@/hooks/useLenis";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HeroSection from "@/sections/HeroSection";
import AboutSection from "@/sections/AboutSection";
import ConfiguratorSection from "@/sections/ConfiguratorSection";
import ContactSection from "@/sections/ContactSection";
import CartDrawer from "@/components/CartDrawer";

function CateringBanner() {
  return (
    <section className="bg-charcoal py-20 px-6 md:px-10">
      <div className="max-w-[1280px] mx-auto flex flex-wrap items-center gap-14 md:gap-20">
        {/* Text */}
        <div className="flex-1 basis-[440px]">
          <p className="font-body text-[0.65rem] uppercase tracking-[0.22em] text-ember mb-3">Our Main Offering</p>
          <h2 className="font-display text-[clamp(2.2rem,4.5vw,3.4rem)] text-cream leading-[1.05] mb-5">
            Catering &amp;<br />Private Events
          </h2>
          <p className="font-body text-[15px] text-[rgba(245,230,200,0.55)] leading-[1.7] max-w-[440px] mb-7">
            Slow-smoked Southern Style BBQ delivered to your door — or pick up from Discovery Bay.
            Perfect for corporate events, weddings, birthdays, and private parties across all of Hong Kong.
          </p>
          <div className="flex flex-wrap gap-7 mb-8">
            {[
              ['HK$2,000', 'Minimum Order'],
              ['5 Days', 'Notice Required'],
              ['All HK', 'Delivery Area'],
              ['HK$150', 'Delivery Fee'],
            ].map(([value, label]) => (
              <div key={label}>
                <p className="font-display text-[1.4rem] text-ember leading-none">{value}</p>
                <p className="font-body text-[0.6rem] uppercase tracking-[0.08em] text-smoke/60 mt-1">{label}</p>
              </div>
            ))}
          </div>
          <a
            href="#catering"
            onClick={(e) => { e.preventDefault(); document.getElementById('catering')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="inline-flex items-center gap-3 bg-ember text-charcoal px-8 py-4 rounded-full font-body text-[0.7rem] uppercase tracking-[0.12em] hover:bg-burnt transition-colors cursor-pointer font-semibold"
          >
            Build Your Order
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="2" y1="8" x2="14" y2="8" /><polyline points="9,3 14,8 9,13" />
            </svg>
          </a>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-2 gap-3 flex-1 basis-[320px] max-w-[420px]">
          {[
            { title: 'Slow Smoked', sub: 'Low & slow, 12–16 hrs' },
            { title: 'HK-Wide', sub: 'All districts covered' },
            { title: 'Any Event', sub: 'Corporate to weddings' },
            { title: 'Free Pickup', sub: 'Discovery Bay' },
          ].map(({ title, sub }) => (
            <div key={title} className="bg-[#141414] border border-[rgba(196,148,58,0.12)] rounded-[14px] p-[22px]">
              <span className="block w-[9px] h-[9px] bg-ember rotate-45 mb-3.5" />
              <p className="font-body text-[14px] font-semibold text-cream">{title}</p>
              <p className="font-body text-[12px] text-[rgba(245,230,200,0.45)] mt-1">{sub}</p>
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
        <div className="h-px bg-[rgba(196,148,58,0.08)]" />
        <CateringBanner />
        <div className="h-px bg-[rgba(196,148,58,0.08)]" />
        <ConfiguratorSection />
        <div className="h-px bg-[rgba(196,148,58,0.08)]" />
        <AboutSection />
        <div className="h-px bg-[rgba(196,148,58,0.08)]" />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
