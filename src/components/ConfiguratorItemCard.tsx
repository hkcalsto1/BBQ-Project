import { useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import type { MenuItem } from '@/types';

interface Props {
  item: MenuItem;
  quantity: number;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
}

export default function ConfiguratorItemCard({ item, quantity, onUpdateQuantity }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isSelected = quantity > 0;

  const handleCardClick = useCallback(() => {
    if (!isSelected) {
      onUpdateQuantity(item.id, 1);
    }
  }, [isSelected, item.id, onUpdateQuantity]);

  const handleIncrement = useCallback(() => {
    const newQty = quantity + 1;
    onUpdateQuantity(item.id, newQty);
    if (cardRef.current) {
      gsap.fromTo(cardRef.current, { scale: 1 }, { scale: 1.02, duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.out' });
    }
  }, [quantity, item.id, onUpdateQuantity]);

  const handleDecrement = useCallback(() => {
    const newQty = Math.max(0, quantity - 1);
    onUpdateQuantity(item.id, newQty);
  }, [quantity, item.id, onUpdateQuantity]);

  const formatPrice = () => {
    if (item.price === 0) return item.priceSuffix;
    const suffix = item.priceSuffix ? ` ${item.priceSuffix}` : '';
    return `$${item.price.toLocaleString()}${suffix}`;
  };

  return (
    <div
      ref={cardRef}
      onClick={handleCardClick}
      className={`rounded-lg px-5 py-4 cursor-pointer transition-all duration-300 border ${
        isSelected
          ? 'border-ember bg-[#1F1F1F] shadow-[0_0_20px_rgba(196,148,58,0.08)]'
          : 'border-[rgba(196,148,58,0.1)] bg-charcoal-light hover:border-[rgba(196,148,58,0.3)] hover:bg-[#1F1F1F]'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <span className="font-body text-base text-cream">{item.name}</span>
          <span className="font-body text-sm font-semibold text-burnt ml-3">
            {formatPrice()}
          </span>
        </div>

        {isSelected ? (
          <div
            className="flex items-center gap-1 bg-charcoal-lighter rounded px-2 py-1 ml-4 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleDecrement}
              className="w-8 h-8 flex items-center justify-center text-cream hover:bg-[rgba(196,148,58,0.2)] rounded transition-colors"
              aria-label="Decrease quantity"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#F5E6C8" strokeWidth="2">
                <line x1="2" y1="8" x2="14" y2="8" />
              </svg>
            </button>
            <span className="font-body text-base font-semibold text-cream min-w-[32px] text-center">
              {quantity}
            </span>
            <button
              onClick={handleIncrement}
              className="w-8 h-8 flex items-center justify-center text-cream hover:bg-[rgba(196,148,58,0.2)] rounded transition-colors"
              aria-label="Increase quantity"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#F5E6C8" strokeWidth="2">
                <line x1="8" y1="2" x2="8" y2="14" />
                <line x1="2" y1="8" x2="14" y2="8" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="ml-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#C4943A" strokeWidth="1.5">
              <line x1="10" y1="4" x2="10" y2="16" />
              <line x1="4" y1="10" x2="16" y2="10" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
