import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionHeader from '@/components/SectionHeader';
import MenuItemCard from '@/components/MenuItemCard';
import { menuItems, categoryLabels, categoryOrder, categoryImages } from '@/data/menu';
import { getLenis } from '@/hooks/useLenis';

gsap.registerPlugin(ScrollTrigger);

export default function MenuSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const categoriesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      categoriesRef.current.forEach((catEl) => {
        if (!catEl) return;
        const cards = catEl.querySelectorAll('.menu-card-wrapper');
        gsap.fromTo(
          cards,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.06,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: catEl,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollTo = (target: string) => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(target, { offset: -72 });
  };

  return (
    <section id="menu" ref={sectionRef} className="bg-charcoal py-20 md:py-[120px] px-6 md:px-10">
      <div className="max-w-[1100px] mx-auto">
        <SectionHeader
          label="OUR MENU"
          heading="Catering Menu"
          subtitle="All meats slow-smoked over hardwood. Sides served per tray (16–20 pax)."
        />

        <div className="space-y-16">
          {categoryOrder.map((category, catIndex) => {
            const items = menuItems.filter((item) => item.category === category);
            const label = categoryLabels[category];

            return (
              <div
                key={category}
                ref={(el) => { categoriesRef.current[catIndex] = el; }}
              >
                <div className="relative w-full h-[180px] md:h-[220px] rounded-lg overflow-hidden mb-6">
                  <img
                    src={categoryImages[category]}
                    alt={`${label.title} BBQ`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="font-display text-2xl md:text-3xl text-cream">{label.title}</span>
                    {label.subtitle && (
                      <span className="font-body text-xs uppercase tracking-[0.1em] text-ember ml-2">{label.subtitle}</span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.map((item) => (
                    <div key={item.id} className="menu-card-wrapper">
                      <MenuItemCard item={item} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Menu CTA */}
        <div className="text-center mt-16">
          <p className="font-body text-lg font-light text-[rgba(245,230,200,0.7)]">
            Ready to order? Build your catering package below.
          </p>
          <button
            onClick={() => scrollTo('#catering')}
            className="pill-button-primary mt-6"
          >
            Start Your Order
          </button>
        </div>
      </div>
    </section>
  );
}
