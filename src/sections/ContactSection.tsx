import { useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function ContactSection() {
  const [formState, setFormState] = useState<'idle' | 'sending' | 'success'>('idle');
  const infoRef = useScrollReveal<HTMLDivElement>({ y: 60, duration: 0.9, start: 'top 80%' });
  const formRef = useScrollReveal<HTMLDivElement>({ y: 60, delay: 0.2, duration: 0.9, start: 'top 80%' });
  const imageRef = useScrollReveal<HTMLDivElement>({ scale: 1.1, duration: 1.2, start: 'top 85%' });

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState('sending');
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setFormState('success');
  };

  return (
    <section id="contact" className="bg-charcoal py-20 md:py-[120px] px-6 md:px-10">
      <div className="max-w-[1100px] mx-auto">
        {/* Two column: info + form */}
        <div className="flex flex-col md:flex-row gap-12 md:gap-16">
          {/* Contact Info */}
          <div className="w-full md:w-[45%]" ref={infoRef}>
            <span className="section-label">GET IN TOUCH</span>
            <h2 className="font-display text-[clamp(2rem,4vw,3rem)] text-cream leading-tight mt-3">
              Let's Talk BBQ
            </h2>
            <p className="font-body text-base font-light text-[rgba(245,230,200,0.7)] leading-relaxed mt-5 max-w-[360px]">
              Have questions about our catering menu? Need a custom quote for a large event? Drop us a line — we're here to help.
            </p>

            <div className="mt-10 space-y-5">
              <div className="flex items-center gap-3">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#C4943A" strokeWidth="1.5">
                  <path d="M8 15s-6-4.5-6-9a6 6 0 0112 0c0 4.5-6 9-6 9z" />
                  <circle cx="8" cy="6" r="2" />
                </svg>
                <span className="font-body text-base text-cream">Hong Kong</span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="w-full md:w-[55%]" ref={formRef}>
            <div className="bg-charcoal-light border border-[rgba(196,148,58,0.1)] rounded-lg p-6 md:p-10">
              {formState === 'success' ? (
                <div className="text-center py-12">
                  <h3 className="font-display text-xl text-ember">
                    Message sent! We'll get back to you soon.
                  </h3>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-5">
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      className="input-dark"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      required
                      placeholder="Email address"
                      className="input-dark"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Phone number"
                      className="input-dark"
                    />
                  </div>
                  <div>
                    <textarea
                      required
                      rows={5}
                      placeholder="How can we help?"
                      className="input-dark resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={formState === 'sending'}
                    className="w-full py-3.5 bg-ember text-charcoal rounded font-body text-xs uppercase tracking-[0.12em] hover:bg-burnt transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {formState === 'sending' ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Footer Image Banner */}
        <div className="mt-20 overflow-hidden rounded-lg relative" ref={imageRef}>
          <img
            src={`${import.meta.env.BASE_URL}assets/footer-bbq-wide.jpg`}
            alt="BBQ catering event with guests and food spread"
            className="w-full aspect-[21/9] object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[rgba(0,0,0,0.4)]">
            <h3
              className="font-display text-[clamp(1.5rem,3vw,2.5rem)] text-cream text-center px-4"
              style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}
            >
              GET IN TOUCH FOR YOUR NEXT BBQ EVENT OR PARTY
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
}
