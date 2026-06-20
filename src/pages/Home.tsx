import { useLenis } from "@/hooks/useLenis";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HeroSection from "@/sections/HeroSection";
import AboutSection from "@/sections/AboutSection";
import MenuSection from "@/sections/MenuSection";
import ConfiguratorSection from "@/sections/ConfiguratorSection";
import ContactSection from "@/sections/ContactSection";
import CartDrawer from "@/components/CartDrawer";

export default function Home() {
  useLenis();

  return (
    <div className="bg-charcoal min-h-screen">
      <Navigation />
      <CartDrawer />
      <main>
        <HeroSection />
        <div className="h-px bg-[rgba(196,148,58,0.15)]" />
        <AboutSection />
        <div className="h-px bg-[rgba(196,148,58,0.15)]" />
        <MenuSection />
        <div className="h-px bg-[rgba(196,148,58,0.15)]" />
        <ConfiguratorSection />
        <div className="h-px bg-[rgba(196,148,58,0.15)]" />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
