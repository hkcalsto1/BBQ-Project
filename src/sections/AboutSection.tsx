import { useScrollReveal } from '@/hooks/useScrollReveal';
import { getLenis } from '@/hooks/useLenis';

export default function AboutSection() {
  const imageRef = useScrollReveal<HTMLDivElement>({ scale: 1.15, duration: 1.2, start: 'top 75%' });
  const textRef = useScrollReveal<HTMLDivElement>({ y: 60, delay: 0.2, duration: 0.9, start: 'top 75%' });

  const scrollTo = (target: string) => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(target, { offset: -72 });
  };

  return (
    <section className="bg-charcoal py-20 md:py-[120px] px-6 md:px-10">
      <div className="max-w-[1100px] mx-auto">
        <div className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-16">
          {/* Image */}
          <div className="w-full md:w-[45%] overflow-hidden rounded-lg" ref={imageRef}>
            <img
              src={`${import.meta.env.BASE_URL}assets/about-kitchen.jpg`}
              alt="Pitmaster tending to meats in a professional smokehouse kitchen"
              className="w-full aspect-[4/3] object-cover"
              loading="lazy"
            />
          </div>

          {/* Text */}
          <div className="w-full md:w-[55%]" ref={textRef}>
            <span className="section-label">ABOUT US</span>
            <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] text-cream leading-tight mt-4">
              We Smoke the Competition
            </h2>
            <p className="font-body text-base font-light text-[rgba(245,230,200,0.7)] leading-relaxed mt-6">
              SmokeHouse HK brings authentic Southern smokehouse flavors to Hong Kong. Our meats are slow-smoked over hardwood for hours, developing that deep, rich bark and tender, juicy interior that true BBQ lovers crave.
            </p>
            <p className="font-body text-base font-light text-[rgba(245,230,200,0.7)] leading-relaxed mt-4">
              From intimate family gatherings to corporate events and weddings, our catering team delivers the full smokehouse experience — on-site or drop-off — across Hong Kong.
            </p>
            <button
              onClick={() => scrollTo('#catering')}
              className="pill-button-outline mt-8"
            >
              Learn About Catering
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
