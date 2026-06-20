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
  const [weight, setWeight] = useState<number>(() => {
    return product.minWeightKg ? parseFloat(product.minWeightKg) : 1;
  });
  const [added, setAdded] = useState(false);

  const price = parseFloat(product.price);
  const isWeightBased = product.priceUnit === "PER_KG";
  const minW = product.minWeightKg ? parseFloat(product.minWeightKg) : 0.5;
  const maxW = product.maxWeightKg ? parseFloat(product.maxWeightKg) : 10;
  const step = product.weightStep ? parseFloat(product.weightStep) : 0.5;

  const displayPrice = isWeightBased ? price * weight : price;

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
    <div className="bg-charcoal-light border border-[rgba(196,148,58,0.1)] rounded-lg overflow-hidden hover:border-ember/40 transition-all duration-300 group">
      {/* Image placeholder */}
      <div className="h-40 bg-gradient-to-br from-charcoal-lighter to-charcoal flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[rgba(196,148,58,0.03)]" />
        <span className="font-display text-3xl text-ember/20 uppercase tracking-wider">
          {product.section === "SMOKEHOUSE" ? "Smoke" : "Raw"}
        </span>
        {product.section === "SMOKEHOUSE" && (
          <div className="absolute top-2 right-2 bg-ember/20 text-ember text-[0.6rem] uppercase tracking-wider px-2 py-0.5 rounded font-body">
            Smoked
          </div>
        )}
        {product.section === "BUTCHER" && (
          <div className="absolute top-2 right-2 bg-smoke/20 text-smoke text-[0.6rem] uppercase tracking-wider px-2 py-0.5 rounded font-body">
            Raw
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-body text-sm font-medium text-cream leading-tight">
          {product.name}
        </h3>
        {product.description && (
          <p className="font-body text-xs text-smoke mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        <div className="mt-3 flex items-baseline gap-1">
          <span className="font-body text-lg font-semibold text-burnt">
            ${displayPrice.toLocaleString()}
          </span>
          <span className="font-body text-xs text-smoke">
            {unitLabels[product.priceUnit] ?? ""}
          </span>
        </div>

        {/* Weight selector for weight-based items */}
        {isWeightBased && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="font-body text-[0.6rem] uppercase tracking-wider text-smoke">
                Weight
              </span>
              <span className="font-body text-xs text-ember">
                {weight}kg
              </span>
            </div>
            <input
              type="range"
              min={minW}
              max={maxW}
              step={step}
              value={weight}
              onChange={(e) => setWeight(parseFloat(e.target.value))}
              className="w-full h-1 bg-charcoal-lighter rounded-lg appearance-none cursor-pointer accent-ember"
            />
            <div className="flex justify-between mt-1">
              <span className="font-body text-[0.5rem] text-smoke">{minW}kg</span>
              <span className="font-body text-[0.5rem] text-smoke">{maxW}kg</span>
            </div>
          </div>
        )}

        <button
          onClick={handleAdd}
          className={`w-full mt-3 py-2.5 rounded font-body text-xs uppercase tracking-[0.1em] transition-all duration-300 cursor-pointer ${
            added
              ? "bg-green-800/50 text-green-400 border border-green-700/50"
              : "bg-ember text-charcoal hover:bg-burnt"
          }`}
        >
          {added ? "Added!" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
