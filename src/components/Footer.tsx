import { getLenis } from '@/hooks/useLenis';

const quickLinks = [
  { label: 'Home', target: '#home' },
  { label: 'Menu', target: '#menu' },
  { label: 'Catering', target: '#catering' },
  { label: 'Contact', target: '#contact' },
];

export default function Footer() {
  const scrollTo = (target: string) => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(target, { offset: -72 });
    }
  };

  return (
    <footer className="bg-charcoal border-t border-[rgba(196,148,58,0.1)] pt-16 pb-10 px-6 md:px-10">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-display text-2xl text-cream">SmokeHouse HK</h3>
            <p className="font-body text-sm text-smoke mt-3">Hong Kong</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-body text-xs uppercase tracking-[0.1em] text-smoke mb-4">Quick Links</h4>
            <div className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.target)}
                  className="font-body text-sm text-cream hover:text-ember transition-colors duration-300 text-left cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-body text-xs uppercase tracking-[0.1em] text-smoke mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 font-body text-sm text-cream">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#C4943A" strokeWidth="1.5">
                  <path d="M8 15s-6-4.5-6-9a6 6 0 0112 0c0 4.5-6 9-6 9z" />
                  <circle cx="8" cy="6" r="2" />
                </svg>
                Hong Kong
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-5 border-t border-[rgba(255,255,255,0.05)] text-center">
          <p className="font-body text-xs text-smoke">
            2026 SmokeHouse HK. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
