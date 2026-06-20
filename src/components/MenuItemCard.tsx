import type { MenuItem } from '@/types';

interface Props {
  item: MenuItem;
}

export default function MenuItemCard({ item }: Props) {
  const formatPrice = () => {
    if (item.price === 0) return item.priceSuffix;
    const suffix = item.priceSuffix ? ` ${item.priceSuffix}` : '';
    return `$${item.price.toLocaleString()}${suffix}`;
  };

  return (
    <div className="gold-border-card-hover px-6 py-5 flex items-center justify-between">
      <span className="font-body text-base text-cream">{item.name}</span>
      <span className="font-body text-xl font-semibold text-burnt shrink-0 ml-4">
        {formatPrice()}
      </span>
    </div>
  );
}
