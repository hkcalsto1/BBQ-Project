import { Link, useNavigate } from "react-router";
import { useEffect } from "react";

const HERO_IMAGE = `${import.meta.env.BASE_URL}assets/hero-bbq-spread.jpg`;

function scrollToCatering(navigate: ReturnType<typeof useNavigate>) {
  navigate("/");
  setTimeout(() => {
    document.getElementById("catering")?.scrollIntoView({ behavior: "smooth" });
  }, 300);
}

export default function SmokeyJoes() {
  const navigate = useNavigate();

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Smokey Joe's | Catering & Online Shop";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <div className="bg-charcoal min-h-screen">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-charcoal" />

        <div className="relative z-10 max-w-[640px] w-full text-center py-32">
          {/* Badge / wordmark */}
          <div className="inline-flex flex-col items-center gap-3 mb-10">
            <div className="w-16 h-px bg-[#F7B731]" />
            <p className="font-body text-[0.65rem] uppercase tracking-[0.35em] text-[#F7B731]">
              Discovery Bay
            </p>
            <h1 className="font-display text-[clamp(2.6rem,7vw,4.2rem)] text-cream leading-none tracking-tight">
              Smokey Joe&rsquo;s
            </h1>
            <p className="font-body text-[0.65rem] uppercase tracking-[0.35em] text-[#F7B731]">
              Beer &middot; Beef &middot; BBQ
            </p>
            <div className="w-16 h-px bg-[#F7B731]" />
          </div>

          <p className="font-body text-[15px] md:text-base text-[rgba(245,230,200,0.7)] leading-[1.7] max-w-[460px] mx-auto mb-14">
            Now delivering island-wide. Order slow-smoked catering for your next event,
            or shop our online butcher block — same Smokey Joe&rsquo;s BBQ, delivered to your door.
          </p>

          {/* CTAs */}
          <div className="grid sm:grid-cols-2 gap-4 text-left">
            <button
              onClick={() => scrollToCatering(navigate)}
              className="group bg-[#141414] border border-[rgba(255,183,27,0.25)] rounded-[16px] p-7 hover:border-[#FFB71B] transition-colors cursor-pointer text-left"
            >
              <span className="block w-[10px] h-[10px] bg-[#FFB71B] rotate-45 mb-4" />
              <p className="font-display text-xl text-cream mb-1.5">Order Catering</p>
              <p className="font-body text-[13px] text-[rgba(245,230,200,0.5)] leading-[1.5] mb-4">
                Corporate events, weddings, and private parties across Hong Kong.
              </p>
              <span className="inline-flex items-center gap-2 font-body text-[0.65rem] uppercase tracking-[0.12em] text-[#FFB71B]">
                Build Your Order
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="transition-transform group-hover:translate-x-1">
                  <line x1="2" y1="8" x2="14" y2="8" /><polyline points="9,3 14,8 9,13" />
                </svg>
              </span>
            </button>

            <Link
              to="/shop"
              className="group bg-[#141414] border border-[rgba(255,183,27,0.25)] rounded-[16px] p-7 hover:border-[#FFB71B] transition-colors cursor-pointer text-left"
            >
              <span className="block w-[10px] h-[10px] bg-[#FF5959] rotate-45 mb-4" />
              <p className="font-display text-xl text-cream mb-1.5">Shop Online</p>
              <p className="font-body text-[13px] text-[rgba(245,230,200,0.5)] leading-[1.5] mb-4">
                Butcher-block cuts and smokehouse favorites, delivered to your door.
              </p>
              <span className="inline-flex items-center gap-2 font-body text-[0.65rem] uppercase tracking-[0.12em] text-[#FF5959]">
                Browse Shop
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="transition-transform group-hover:translate-x-1">
                  <line x1="2" y1="8" x2="14" y2="8" /><polyline points="9,3 14,8 9,13" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Dine-in strip */}
      <section className="border-t border-[rgba(196,148,58,0.1)] py-10 px-6 text-center">
        <p className="font-body text-sm text-cream mb-1">
          Prefer to dine in?
        </p>
        <p className="font-body text-[13px] text-smoke leading-[1.7]">
          G08, DB North Plaza, Discovery Bay, Hong Kong &middot; (+852) 5784 7101
        </p>
        <a
          href="https://smokeyjoesdb.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 font-body text-[0.65rem] uppercase tracking-[0.12em] text-ember hover:text-burnt transition-colors"
        >
          View Restaurant &amp; Book a Table &rarr;
        </a>
      </section>
    </div>
  );
}
