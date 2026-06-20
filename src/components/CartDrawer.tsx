import { useCart } from "@/hooks/useCart";
import { useNavigate } from "react-router";

const unitLabels: Record<string, string> = {
  PER_KG: "kg",
  PER_PIECE: "pc",
  PER_PACK: "pack",
  PER_TRAY: "tray",
  PER_PORTION: "portion",
};

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, totalAmount } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-[998]"
        onClick={() => setIsOpen(false)}
      />
      {/* Drawer */}
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-charcoal border-l border-[rgba(196,148,58,0.15)] z-[999] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(196,148,58,0.1)]">
          <h2 className="font-display text-xl text-cream">Your Cart</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-smoke hover:text-cream transition-colors cursor-pointer"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="4" y1="4" x2="16" y2="16" />
              <line x1="16" y1="4" x2="4" y2="16" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-body text-smoke">Your cart is empty</p>
              <button
                onClick={() => { setIsOpen(false); navigate("/shop"); }}
                className="mt-4 text-ember font-body text-sm hover:underline cursor-pointer"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-start gap-3 pb-4 border-b border-[rgba(196,148,58,0.08)]"
                >
                  <div className="w-14 h-14 bg-charcoal-lighter rounded flex items-center justify-center shrink-0">
                    <span className="font-body text-[0.5rem] text-smoke uppercase">
                      {item.name.slice(0, 3)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-body text-sm text-cream truncate">
                      {item.name}
                    </h4>
                    <p className="font-body text-xs text-smoke mt-0.5">
                      ${item.price.toLocaleString()}/{unitLabels[item.priceUnit]}
                      {item.weightKg ? ` x ${item.weightKg}kg` : ` x ${item.quantity}`}
                    </p>
                    <p className="font-body text-sm font-semibold text-burnt mt-1">
                      ${(item.price * (item.weightKg ?? item.quantity)).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-smoke hover:text-burnt transition-colors cursor-pointer shrink-0"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <line x1="4" y1="4" x2="12" y2="12" />
                      <line x1="12" y1="4" x2="4" y2="12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-4 border-t border-[rgba(196,148,58,0.15)]">
            <div className="flex justify-between items-center mb-4">
              <span className="font-body text-sm text-cream">Total</span>
              <span className="font-body text-xl font-semibold text-burnt">
                ${totalAmount.toLocaleString()}
              </span>
            </div>
            <p className="font-body text-[0.6rem] text-smoke mb-3">
              Minimum order: $800. Delivery across Hong Kong.
            </p>
            <button
              onClick={() => { setIsOpen(false); navigate("/checkout"); }}
              className="w-full py-3 bg-ember text-charcoal rounded font-body text-xs uppercase tracking-[0.12em] hover:bg-burnt transition-colors cursor-pointer"
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
