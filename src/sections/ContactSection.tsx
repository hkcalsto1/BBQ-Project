import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function ContactSection() {
  const cardsRef = useScrollReveal<HTMLDivElement>({ y: 50, duration: 0.9, start: 'top 80%' });

  return (
    <section id="contact" className="bg-charcoal py-20 md:py-[120px] px-6 md:px-10">
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center mb-14">
          <span className="font-body text-[0.65rem] uppercase tracking-[0.22em] text-ember">Get in touch</span>
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] text-cream mt-3">Delivery &amp; Contact</h2>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Delivery Areas */}
          <div className="bg-[#141414] border border-[rgba(196,148,58,0.05)] rounded-2xl p-9 hover:border-[rgba(196,148,58,0.2)] transition-colors">
            <h3 className="font-display text-[1.3rem] text-cream mb-3">Delivery Areas</h3>
            <p className="font-body text-[14px] text-smoke mb-4">We cover all of Hong Kong:</p>
            <ul className="space-y-2">
              {['Hong Kong Island', 'Kowloon', 'New Territories'].map((area) => (
                <li key={area} className="flex items-center gap-2.5 font-body text-[14px] text-smoke">
                  <span className="text-ember text-base leading-none">✓</span>
                  {area}
                </li>
              ))}
            </ul>
          </div>

          {/* Delivery Hours */}
          <div className="bg-[#141414] border border-[rgba(196,148,58,0.05)] rounded-2xl p-9 hover:border-[rgba(196,148,58,0.2)] transition-colors">
            <h3 className="font-display text-[1.3rem] text-cream mb-3">Delivery Hours</h3>
            <p className="font-body text-[14px] text-smoke mb-4">Order by 12pm for same-day delivery.</p>
            <ul className="space-y-2 font-body text-[14px] text-smoke">
              <li>Mon – Fri &nbsp;&nbsp;12pm – 8pm</li>
              <li>Sat – Sun &nbsp;&nbsp;10am – 8pm</li>
              <li className="text-smoke/50">Public Holidays — Closed</li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="bg-[#141414] border border-[rgba(196,148,58,0.05)] rounded-2xl p-9 hover:border-[rgba(196,148,58,0.2)] transition-colors">
            <h3 className="font-display text-[1.3rem] text-cream mb-3">Contact Us</h3>
            <p className="font-body text-[14px] text-smoke mb-4">Questions or custom orders?</p>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:hello@smokehousehk.com"
                className="flex items-center gap-2.5 font-body text-[14px] text-smoke hover:text-ember transition-colors"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                  <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 6l10 7L22 6" />
                </svg>
                hello@smokehousehk.com
              </a>
              <a
                href="https://wa.me/85200000000"
                className="flex items-center gap-2.5 font-body text-[14px] text-smoke hover:text-ember transition-colors"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                  <path d="M21 11.5a8.38 8.38 0 01-8.5 8.5 8.5 8.5 0 01-3.8-.9L3 21l1.9-5.7a8.5 8.5 0 01-.9-3.8A8.38 8.38 0 0112.5 3 8.5 8.5 0 0121 11.5z" />
                </svg>
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
