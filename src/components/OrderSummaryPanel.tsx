import { useMemo } from 'react';
import type { SelectedItem, ConfiguratorStep } from '@/types';
import { MIN_ORDER, DELIVERY_FEE } from '@/data/menu';

interface Props {
  items: SelectedItem[];
  currentStep: ConfiguratorStep;
  serviceType: string;
  onContinue: () => void;
}

export default function OrderSummaryPanel({ items, currentStep, serviceType, onContinue }: Props) {
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0), [items]);
  const isDelivery = serviceType.startsWith('Delivery');
  const deliveryFee = isDelivery ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;
  const hasItems = items.length > 0;
  const meetsMinOrder = subtotal >= MIN_ORDER;

  return (
    <div className="bg-[#141414] border border-[rgba(196,148,58,0.12)] rounded-2xl p-6">
      <h3 className="font-body text-xs uppercase tracking-[0.1em] text-cream pb-4 border-b border-[rgba(196,148,58,0.1)]">
        Your Order
      </h3>

      <div className="mt-4 min-h-[100px]">
        {hasItems ? (
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.menuItem.id} className="flex justify-between items-start gap-2">
                <span className="font-body text-xs text-cream leading-relaxed">{item.menuItem.name}</span>
                <span className="font-body text-xs text-smoke shrink-0">x{item.quantity}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="font-body text-sm italic text-smoke">No items selected yet</p>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-[rgba(196,148,58,0.2)] space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-body text-xs text-smoke">Subtotal</span>
          <span className="font-body text-xs text-cream">HK${subtotal.toLocaleString()}</span>
        </div>
        {isDelivery && (
          <div className="flex justify-between items-center">
            <span className="font-body text-xs text-smoke">Delivery</span>
            <span className="font-body text-xs text-cream">HK${DELIVERY_FEE}</span>
          </div>
        )}
        <div className="flex justify-between items-center pt-2 border-t border-[rgba(196,148,58,0.1)]">
          <span className="font-body text-base text-cream">Total</span>
          <span className="font-body text-xl font-semibold text-burnt">HK${total.toLocaleString()}</span>
        </div>
      </div>

      {/* Min order warning */}
      {hasItems && !meetsMinOrder && (
        <div className="mt-3 px-3 py-2 bg-amber-900/20 border border-amber-700/30 rounded text-center">
          <p className="font-body text-[0.65rem] text-amber-400">
            Minimum order HK${MIN_ORDER.toLocaleString()}<br />
            <span className="text-smoke">Add HK${(MIN_ORDER - subtotal).toLocaleString()} more to continue</span>
          </p>
        </div>
      )}

      {(currentStep === 1 || currentStep === 2) && (
        <button
          onClick={onContinue}
          disabled={!hasItems || !meetsMinOrder}
          className={`w-full mt-4 py-3 rounded-full font-body text-xs uppercase tracking-[0.1em] transition-all duration-300 ${
            hasItems && meetsMinOrder
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
