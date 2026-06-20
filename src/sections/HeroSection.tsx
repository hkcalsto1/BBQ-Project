import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { gsap } from 'gsap';

export default function HeroSection() {
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      imageRef.current,
      { scale: 1.05, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.5, ease: 'power2.out' }
    );

    if (textRef.current) {
      const textEls = textRef.current.children;
      tl.fromTo(
        textEls,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, stagger: 0.15, duration: 1, ease: 'power3.out' },
        0.5
      );
    }

    return () => { tl.kill(); };
  }, []);

  return (
    <section id="home" className="relative min-h-screen bg-charcoal overflow-hidden">
      <div className="flex flex-col md:flex-row min-h-screen">
        <div className="w-full md:w-[45%] flex items-center justify-center px-6 md:px-10 lg:px-16 py-24 md:py-0 relative z-10">
          <div ref={textRef} className="max-w-md">
            <h1 className="font-display text-[clamp(3rem,6vw,5rem)] text-cream leading-none tracking-tight">
              SmokeHouse HK
            </h1>
            <p className="font-body text-base font-light text-[rgba(245,230,200,0.7)] leading-relaxed mt-6 max-w-[400px]">
              Hong Kong's premium BBQ catering and online butcher. Slow-smoked meats for events, or quality raw cuts delivered to your door.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4 mt-10">
              <Link to="/shop" className="pill-button-primary">
                Shop Now
              </Link>
              <a
                href="#menu"
                className="flex items-center gap-2 font-body text-xs uppercase tracking-[0.1em] text-smoke hover:text-ember transition-colors duration-300 cursor-pointer"
              >
                View Menu
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="2" y1="8" x2="14" y2="8" />
                  <polyline points="10,4 14,8 10,12" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Video Column */}
        <div className="w-full md:w-[55%] h-[50vh] md:h-auto relative">
          <div
            ref={imageRef}
            className="absolute inset-0"
          >
            <img
              src={`${import.meta.env.BASE_URL}assets/hero-bbq-spread.jpg`}
              alt="BBQ meat smoking"
              className="w-full h-full object-cover"
            />
            {/* Gradient overlay */}
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to right, #0A0A0A 0%, transparent 40%)' }}
            />
            {/* Vignette */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ boxShadow: 'inset 0 0 150px rgba(0,0,0,0.6)' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
