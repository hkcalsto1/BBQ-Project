import { useEffect, useRef } from 'react';

const HERO_IMAGE = `${import.meta.env.BASE_URL}assets/hero-bbq-spread.jpg`;

export default function HeroSection() {
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      if (textRef.current) {
        gsap.fromTo(
          Array.from(textRef.current.children),
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, stagger: 0.15, duration: 0.9, ease: 'power3.out', delay: 0.2 }
        );
      }
      if (imageRef.current) {
        gsap.fromTo(imageRef.current, { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out', delay: 0.1 });
      }
    });
  }, []);

  return (
    <section id="home" className="min-h-screen flex flex-wrap items-stretch">
      {/* Left — text */}
      <div className="flex-1 basis-[460px] flex flex-col justify-center px-8 md:px-14 py-36 md:py-40">
        <div ref={textRef} className="max-w-[520px]">
          <p className="font-body text-[0.65rem] uppercase tracking-[0.22em] text-ember mb-5">
            Hong Kong's Premium BBQ
          </p>
          <h1 className="font-display text-[clamp(3.4rem,7vw,6.5rem)] text-cream leading-none mb-6">
            Smoke.<br />Slow.<br />
            <span className="text-ember">Satisfy.</span>
          </h1>
          <p className="font-body text-[15px] text-smoke leading-relaxed max-w-[380px] mb-10">
            Ready-to-eat smoked meats and premium raw cuts — delivered fresh across all of Hong Kong.
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <a
              href="#catering"
              onClick={(e) => { e.preventDefault(); document.getElementById('catering')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="inline-flex items-center gap-3 bg-ember text-charcoal px-9 py-4 rounded-full font-body text-[0.7rem] uppercase tracking-[0.13em] hover:bg-burnt transition-colors cursor-pointer font-semibold"
            >
              Build Your Order
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="2" y1="8" x2="14" y2="8" /><polyline points="9,3 14,8 9,13" />
              </svg>
            </a>
            <a
              href="/BBQ-Project/shop"
              className="inline-flex items-center gap-2 font-body text-[14px] text-smoke hover:text-ember transition-colors"
            >
              View Menu <span>→</span>
            </a>
          </div>

          {/* Stats bar */}
          <div className="flex flex-wrap items-center gap-6 mt-11 pt-8 border-t border-[rgba(196,148,58,0.12)]">
            {[
              { value: '12hr+', label: 'Slow Smoked' },
              { value: 'Same Day', label: 'Delivery' },
              { value: 'All HK', label: 'Covered' },
            ].map((s, i) => (
              <div key={s.label} className="flex items-center gap-6">
                <div>
                  <p className="font-display text-[1.5rem] text-ember leading-none">{s.value}</p>
                  <p className="font-body text-[0.65rem] uppercase tracking-[0.06em] text-smoke mt-0.5">{s.label}</p>
                </div>
                {i < 2 && <div className="w-px h-8 bg-[rgba(196,148,58,0.15)]" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — image */}
      <div
        ref={imageRef}
        className="flex-1 basis-[460px] relative min-h-[56vw] md:min-h-0"
        style={{ background: 'radial-gradient(ellipse 55% 45% at 65% 55%, rgba(196,148,58,0.18) 0%, transparent 70%), #1A1614' }}
      >
        <img
          src={HERO_IMAGE}
          alt="Smoked BBQ meats"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Left edge fade into bg */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-charcoal to-transparent pointer-events-none z-10" />
      </div>
    </section>
  );
}
