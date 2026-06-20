import { useMemo } from 'react';
import type { SelectedItem, ConfiguratorStep } from '@/types';

interface Props {
  items: SelectedItem[];
  currentStep: ConfiguratorStep;
  onContinue: () => void;
}

export default function OrderSummaryPanel({ items, currentStep, onContinue }: Props) {
  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  }, [items]);

  const hasItems = items.length > 0;

  return (
    <div className="bg-charcoal-light border border-[rgba(196,148,58,0.15)] rounded-lg p-6">
      <h3 className="font-body text-xs uppercase tracking-[0.1em] text-cream pb-4 border-b border-[rgba(196,148,58,0.1)]">
        Your Order
      </h3>

      <div className="mt-4 min-h-[100px]">
        {hasItems ? (
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.menuItem.id} className="flex justify-between items-start">
                <span className="font-body text-xs text-cream">
                  {item.menuItem.name}
                </span>
                <span className="font-body text-xs text-smoke shrink-0 ml-2">
                  x{item.quantity}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="font-body text-sm italic text-smoke">
            No items selected yet
          </p>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-[rgba(196,148,58,0.2)]">
        <div className="flex justify-between items-center">
          <span className="font-body text-base text-cream">Total</span>
          <span className="font-body text-xl font-semibold text-burnt">
            ${total.toLocaleString()}
          </span>
        </div>
      </div>

      {(currentStep === 1 || currentStep === 2) && (
        <button
          onClick={onContinue}
          disabled={!hasItems}
          className={`w-full mt-4 py-3 rounded font-body text-xs uppercase tracking-[0.1em] transition-all duration-300 ${
            hasItems
              ? 'bg-ember text-charcoal hover:bg-burnt cursor-pointer'
              : 'bg-ember text-charcoal opacity-40 cursor-not-allowed'
          }`}
        >
          {currentStep === 1 ? 'Continue' : 'Review Order'}
        </button>
      )}
    </div>
  );
}
