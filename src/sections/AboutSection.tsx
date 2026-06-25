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
          <div className="w-full md:w-[45%] overflow-hidden rounded-2xl" ref={imageRef}>
            <img
              src={`${import.meta.env.BASE_URL}assets/about-kitchen.jpg`}
              alt="Pitmaster tending to meats in a professional smokehouse kitchen"
              className="w-full aspect-[4/3] object-cover"
              loading="lazy"
            />
          </div>

          {/* Text */}
          <div className="w-full md:w-[55%]" ref={textRef}>
            <span className="section-label">OUR STORY</span>
            <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] text-cream leading-tight mt-4">
              Born from a love<br />of smoke
            </h2>
            <p className="font-body text-base font-light text-[rgba(245,230,200,0.7)] leading-relaxed mt-6">
              SmokeHouse HK was born out of a simple obsession: finding great BBQ in Hong Kong and coming up empty. So we built it ourselves.
            </p>
            <p className="font-body text-base font-light text-[rgba(245,230,200,0.7)] leading-relaxed mt-4">
              Every cut we smoke is treated with the respect it deserves — seasoned simply, cooked slowly, and served with nothing to hide. No shortcuts. No sauce to mask the work.
            </p>
            <p className="font-body text-base font-light text-[rgba(245,230,200,0.7)] leading-relaxed mt-4">
              Whether you want a ready-to-eat feast delivered to your door, or premium raw cuts for your own grill — we've got you covered.
            </p>
            <button
              onClick={() => scrollTo('#catering')}
              className="pill-button-outline mt-8"
            >
              Browse the Menu →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
