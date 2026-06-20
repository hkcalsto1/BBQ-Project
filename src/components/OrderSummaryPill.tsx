import { useMemo } from 'react';
import type { SelectedItem } from '@/types';
import { getLenis } from '@/hooks/useLenis';

interface Props {
  items: SelectedItem[];
}

export default function OrderSummaryPill({ items }: Props) {
  const { total, count } = useMemo(() => {
    const total = items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    return { total, count };
  }, [items]);

  if (count === 0) return null;

  const handleClick = () => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo('#catering', { offset: -72 });
    }
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-[900] bg-charcoal-light border border-[rgba(196,148,58,0.3)] rounded-lg px-6 py-4 shadow-2xl cursor-pointer hover:border-ember transition-colors duration-300 md:hidden"
    >
      <div className="flex items-center gap-4">
        <div className="text-left">
          <span className="font-body text-xs text-smoke">{count} item{count > 1 ? 's' : ''}</span>
          <div className="font-body text-lg font-semibold text-burnt">
            ${total.toLocaleString()}
          </div>
        </div>
        <div className="bg-ember text-charcoal px-4 py-2 rounded font-body text-xs uppercase tracking-[0.1em]">
          View
        </div>
      </div>
    </button>
  );
}
