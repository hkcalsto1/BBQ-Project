import { useEffect, useRef } from 'react';

// TO ADD A VIDEO: replace the img tag below with:
// <video autoPlay muted loop playsInline className="w-full h-full object-cover">
//   <source src="YOUR_VIDEO_URL.mp4" type="video/mp4" />
// </video>
// Download a free BBQ video from pexels.com/search/videos/bbq/

const HERO_IMAGE = `${import.meta.env.BASE_URL}assets/hero-bbq-spread.jpg`;

export default function HeroSection() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      const tl = gsap.timeline();
      tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'power2.out' });
      if (textRef.current) {
        tl.fromTo(
          Array.from(textRef.current.children),
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, stagger: 0.18, duration: 1, ease: 'power3.out' },
          0.4
        );
      }
    });
  }, []);

  return (
    <section id="home" className="relative min-h-screen overflow-hidden flex items-center">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={HERO_IMAGE} alt="Smoked BBQ meats" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/80 to-charcoal/40" />
        <div className="absolute inset-0 bg-charcoal/30" />
      </div>

      {/* Content */}
      <div ref={overlayRef} className="relative z-10 w-full max-w-[1100px] mx-auto px-6 md:px-10 py-32 md:py-40">
        <div ref={textRef} className="max-w-2xl">
          {/* Eyebrow */}
          <p className="font-body text-xs uppercase tracking-[0.25em] text-ember mb-5">
            Hong Kong's BBQ Catering Specialists
          </p>

          {/* Headline */}
          <h1 className="font-display text-[clamp(3.5rem,7vw,6rem)] text-cream leading-none tracking-tight mb-6">
            Slow-Smoked.<br />
            <span className="text-ember">Event-Ready.</span>
          </h1>

          {/* Sub */}
          <p className="font-body text-lg text-smoke leading-relaxed mb-4 max-w-xl">
            Southern-style BBQ catering for your events across all of Hong Kong.
            Brisket, ribs, pulled pork and more — smoked low & slow for 12–16 hours.
          </p>

          {/* Key stats inline */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 mb-10">
            {[
              'Min. order HK$2,000',
              'All HK delivery — HK$150',
              'Free pickup Discovery Bay',
              '5-day notice',
            ].map((stat) => (
              <span key={stat} className="font-body text-xs text-smoke/70 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-ember inline-block" />
                {stat}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <a
              href="#catering"
              onClick={(e) => { e.preventDefault(); document.getElementById('catering')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="inline-flex items-center gap-3 bg-ember text-charcoal px-9 py-4 rounded font-body text-sm uppercase tracking-[0.12em] hover:bg-burnt transition-colors cursor-pointer font-semibold"
            >
              Build Your Catering Order
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="2" y1="8" x2="14" y2="8" /><polyline points="9,3 14,8 9,13" />
              </svg>
            </a>
            <a
              href="/BBQ-Project/shop"
              className="inline-flex items-center gap-3 border border-[rgba(196,148,58,0.4)] text-smoke px-8 py-4 rounded font-body text-sm uppercase tracking-[0.12em] hover:border-ember hover:text-ember transition-colors cursor-pointer"
            >
              Online Shop
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-40">
        <span className="font-body text-[0.55rem] uppercase tracking-[0.2em] text-smoke">Scroll</span>
        <div className="w-px h-8 bg-smoke animate-pulse" />
      </div>
    </section>
  );
}
