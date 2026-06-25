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

  const handleIncrement = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateQuantity(item.id, quantity + 1);
    if (cardRef.current) {
      gsap.fromTo(cardRef.current, { scale: 1 }, { scale: 1.012, duration: 0.1, yoyo: true, repeat: 1, ease: 'power2.out' });
    }
  }, [quantity, item.id, onUpdateQuantity]);

  const handleDecrement = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateQuantity(item.id, Math.max(0, quantity - 1));
  }, [quantity, item.id, onUpdateQuantity]);

  const formatPrice = () => {
    if (item.price === 0) return item.priceSuffix ?? '';
    return `HK$${item.price.toLocaleString()}${item.priceSuffix ? ` ${item.priceSuffix}` : ''}`;
  };

  return (
    <div
      ref={cardRef}
      className={`flex items-center justify-between gap-4 rounded-xl px-4 py-3.5 border transition-all duration-200 ${
        isSelected
          ? 'bg-[#1A1A1A] border-[rgba(196,148,58,0.35)]'
          : 'bg-[#141414] border-[rgba(245,230,200,0.06)] hover:border-[rgba(196,148,58,0.2)]'
      }`}
    >
      {/* Name + price */}
      <div className="min-w-0">
        <p className="font-body text-[15px] text-cream leading-tight">{item.name}</p>
        <p className="font-body text-[12px] text-smoke/60 mt-0.5">{formatPrice()}</p>
      </div>

      {/* Quantity controls */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={handleDecrement}
          className={`w-[30px] h-[30px] rounded-full border flex items-center justify-center text-lg leading-none transition-colors cursor-pointer ${
            isSelected
              ? 'border-[rgba(196,148,58,0.4)] text-smoke hover:border-ember hover:text-ember'
              : 'border-[rgba(245,230,200,0.12)] text-smoke/40 cursor-default'
          }`}
          disabled={!isSelected}
        >
          &minus;
        </button>
        <span className="font-body text-[15px] text-cream w-[18px] text-center">
          {quantity || ''}
        </span>
        <button
          onClick={handleIncrement}
          className="w-[30px] h-[30px] rounded-full border border-[rgba(245,230,200,0.15)] text-smoke hover:border-ember hover:text-ember flex items-center justify-center text-lg leading-none transition-colors cursor-pointer"
        >
          +
        </button>
      </div>
    </div>
  );
}
