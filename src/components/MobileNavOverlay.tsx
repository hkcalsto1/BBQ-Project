import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { getLenis } from '@/hooks/useLenis';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (target: string) => void;
}

const navLinks = [
  { label: 'Home', target: '#home' },
  { label: 'Menu', target: '#menu' },
  { label: 'Catering', target: '#catering' },
  { label: 'Contact', target: '#contact' },
];

export default function MobileNavOverlay({ isOpen, onClose, onNavigate }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = getLenis();
    if (isOpen) {
      lenis?.stop();
      const tl = gsap.timeline();
      tl.fromTo(
        overlayRef.current,
        { y: '-100%' },
        { y: '0%', duration: 0.5, ease: 'power2.out' }
      );
      if (linksRef.current) {
        tl.fromTo(
          linksRef.current.children,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.08, duration: 0.4, ease: 'power2.out' },
          '-=0.2'
        );
      }
    } else {
      lenis?.start();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNav = (target: string) => {
    gsap.to(overlayRef.current, {
      y: '-100%',
      duration: 0.4,
      ease: 'power2.inOut',
      onComplete: () => {
        onClose();
        onNavigate(target);
      },
    });
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[999] bg-charcoal flex flex-col items-center justify-center"
      style={{ transform: 'translateY(-100%)' }}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 cursor-pointer"
        aria-label="Close menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F5E6C8" strokeWidth="1.5">
          <line x1="4" y1="4" x2="20" y2="20" />
          <line x1="20" y1="4" x2="4" y2="20" />
        </svg>
      </button>

      <div ref={linksRef} className="flex flex-col items-center gap-8">
        {navLinks.map((link) => (
          <button
            key={link.label}
            onClick={() => handleNav(link.target)}
            className="font-body text-2xl uppercase tracking-[0.1em] text-cream hover:text-ember transition-colors duration-300 cursor-pointer"
          >
            {link.label}
          </button>
        ))}
      </div>

      <button
        onClick={() => handleNav('#catering')}
        className="pill-button-primary mt-12"
      >
        ORDER NOW
      </button>
    </div>
  );
}
