import { useState } from "react";
import { useCart } from "@/hooks/useCart";

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string;
  priceUnit: string;
  minWeightKg: string | null;
  maxWeightKg: string | null;
  weightStep: string | null;
  section: string;
  images?: string[] | null;
}

interface Props {
  product: Product;
}

const unitLabels: Record<string, string> = {
  PER_KG: "/kg",
  PER_PIECE: "each",
  PER_PACK: "/pack",
  PER_TRAY: "/tray",
  PER_PORTION: "/portion",
};

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart();
  const [weight, setWeight] = useState<number>(() =>
    product.minWeightKg ? parseFloat(product.minWeightKg) : 1
  );
  const [added, setAdded] = useState(false);

  const price = parseFloat(product.price);
  const isWeightBased = product.priceUnit === "PER_KG";
  const minW = product.minWeightKg ? parseFloat(product.minWeightKg) : 0.5;
  const maxW = product.maxWeightKg ? parseFloat(product.maxWeightKg) : 10;
  const step = product.weightStep ? parseFloat(product.weightStep) : 0.5;
  const displayPrice = isWeightBased ? price * weight : price;
  const isWine = product.section === "WINE";
  const isReady = product.section === "SMOKEHOUSE";
  const image = product.images?.[0];

  const handleAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price,
      priceUnit: product.priceUnit,
      quantity: 1,
      weightKg: isWeightBased ? weight : undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="bg-charcoal-light border border-[rgba(196,148,58,0.06)] rounded-2xl overflow-hidden hover:border-[rgba(196,148,58,0.25)] transition-colors duration-300 flex flex-col">
      {/* Image area */}
      <div className="relative aspect-[4/3] bg-[#1C1C1C]">
        {image ? (
          <img src={image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center select-none">
            <span className="font-display text-4xl text-ember/10 uppercase tracking-widest">
              {isWine ? "Wine" : isReady ? "Smoke" : "Raw"}
            </span>
          </div>
        )}
        {isWine ? (
          <span className="absolute top-3 right-3 z-10 font-body text-[0.6rem] font-semibold uppercase tracking-[0.06em] px-2.5 py-1 rounded-full bg-[rgba(122,29,44,0.9)] text-cream">
            18+
          </span>
        ) : (
          <span className={`absolute top-3 right-3 z-10 font-body text-[0.6rem] font-semibold uppercase tracking-[0.06em] px-2.5 py-1 rounded-full ${
            isReady
              ? "bg-[rgba(196,148,58,0.9)] text-[#0A0A0A]"
              : "bg-[rgba(37,37,37,0.9)] text-[rgba(245,230,200,0.6)] border border-[rgba(196,148,58,0.1)]"
          }`}>
            {isReady ? "Ready" : "Raw Cut"}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h3 className="font-display text-[1.2rem] text-cream leading-tight">
            {product.name}
          </h3>
          <span className="font-body text-[0.65rem] text-smoke/60 whitespace-nowrap mt-1">
            {unitLabels[product.priceUnit] ?? ""}
          </span>
        </div>

        {product.description && (
          <p className="font-body text-[12px] text-smoke leading-relaxed mt-1 mb-4 line-clamp-2 flex-1">
            {product.description}
          </p>
        )}

        {isWeightBased && (
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="font-body text-[0.6rem] uppercase tracking-wider text-smoke">Weight</span>
              <span className="font-body text-xs text-ember">{weight}kg</span>
            </div>
            <input
              type="range"
              min={minW} max={maxW} step={step} value={weight}
              onChange={(e) => setWeight(parseFloat(e.target.value))}
              className="w-full h-1 bg-charcoal-lighter rounded-full appearance-none cursor-pointer accent-ember"
            />
            <div className="flex justify-between mt-1">
              <span className="font-body text-[0.5rem] text-smoke">{minW}kg</span>
              <span className="font-body text-[0.5rem] text-smoke">{maxW}kg</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-[rgba(196,148,58,0.06)] mt-auto">
          <span className="font-display text-[1.3rem] text-cream">
            HK${displayPrice.toLocaleString()}
          </span>
          <button
            onClick={handleAdd}
            className={`font-body text-[0.65rem] font-semibold uppercase tracking-[0.1em] px-4 py-2 rounded-full transition-colors duration-200 cursor-pointer ${
              added
                ? "bg-[rgba(34,197,94,0.15)] text-green-400 border border-green-700/40"
                : "bg-ember text-[#0A0A0A] hover:bg-burnt"
            }`}
          >
            {added ? "Added!" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
