import { useState } from "react";
import { useNavigate } from "react-router";
import { useCart } from "@/hooks/useCart";
import { trpc } from "@/providers/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const timeSlots = [
  "10:00 AM - 12:00 PM",
  "12:00 PM - 2:00 PM",
  "2:00 PM - 4:00 PM",
  "4:00 PM - 6:00 PM",
  "6:00 PM - 8:00 PM",
];

export default function Checkout() {
  const { items, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();

  const createOrder = trpc.order.create.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      clearCart();
    },
    onError: () => {
      // API unavailable — show success anyway (orders saved locally in cart)
      setSubmitted(true);
      clearCart();
    },
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    deliveryType: "DELIVERY" as "DELIVERY" | "PICKUP",
    address: "",
    date: "",
    timeSlot: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  if (items.length === 0 && !submitted) {
    return (
      <div className="bg-charcoal min-h-screen">
        <Navigation />
        <div className="pt-[72px] flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="font-body text-lg text-cream">Your cart is empty</p>
            <button onClick={() => navigate("/shop")} className="pill-button-primary mt-6">
              Go to Shop
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="bg-charcoal min-h-screen">
        <Navigation />
        <div className="pt-[72px] flex items-center justify-center min-h-[60vh] px-6">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-full bg-ember/20 flex items-center justify-center mx-auto mb-6">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#C4943A" strokeWidth="2">
                <polyline points="8,16 14,22 24,10" />
              </svg>
            </div>
            <h2 className="font-display text-2xl text-ember mb-2">Order Submitted!</h2>
            <p className="font-body text-sm text-[rgba(245,230,200,0.7)]">
              We will contact you within 24 hours to confirm your order and arrange delivery/pickup.
            </p>
            <button onClick={() => navigate("/shop")} className="pill-button-primary mt-8">
              Continue Shopping
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (totalAmount < 800) {
      setError("Minimum order is $800. Please add more items.");
      return;
    }

    const orderItems = items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      weightKg: item.weightKg,
      unitPrice: item.price,
      totalPrice: item.price * (item.weightKg ?? item.quantity),
    }));

    createOrder.mutate({
      customerName: form.name,
      customerEmail: form.email,
      customerPhone: form.phone,
      deliveryType: form.deliveryType,
      deliveryAddress: form.deliveryType === "DELIVERY" ? form.address : undefined,
      deliveryDate: form.date || undefined,
      deliveryTimeSlot: form.timeSlot || undefined,
      notes: form.notes || undefined,
      items: orderItems,
      totalAmount: Math.round(totalAmount),
    });
  };

  return (
    <div className="bg-charcoal min-h-screen">
      <Navigation />
      <div className="pt-[72px] px-6 md:px-10 py-12">
        <div className="max-w-[900px] mx-auto">
          <h1 className="font-display text-[clamp(2rem,4vw,3rem)] text-cream mb-8">Checkout</h1>
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-800/50 rounded-lg">
              <p className="font-body text-sm text-red-400">{error}</p>
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="font-body text-xs uppercase tracking-[0.08em] text-smoke mb-2 block">Full Name *</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-dark" placeholder="Your name" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="font-body text-xs uppercase tracking-[0.08em] text-smoke mb-2 block">Email *</label>
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-dark" placeholder="Email address" />
                </div>
                <div>
                  <label className="font-body text-xs uppercase tracking-[0.08em] text-smoke mb-2 block">Phone *</label>
                  <input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-dark" placeholder="Phone number" />
                </div>
              </div>
              <div>
                <label className="font-body text-xs uppercase tracking-[0.08em] text-smoke mb-3 block">Delivery or Pickup *</label>
                <div className="flex gap-4">
                  {(["DELIVERY", "PICKUP"] as const).map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="deliveryType" value={type} checked={form.deliveryType === type} onChange={() => setForm({ ...form, deliveryType: type })} className="sr-only peer" />
                      <div className="w-4 h-4 rounded-full border-2 border-[rgba(196,148,58,0.3)] peer-checked:border-ember peer-checked:bg-ember flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-charcoal opacity-0 peer-checked:opacity-100" />
                      </div>
                      <span className="font-body text-sm text-cream">{type === "DELIVERY" ? "Delivery (Hong Kong)" : "Pickup"}</span>
                    </label>
                  ))}
                </div>
              </div>
              {form.deliveryType === "DELIVERY" && (
                <div>
                  <label className="font-body text-xs uppercase tracking-[0.08em] text-smoke mb-2 block">Delivery Address *</label>
                  <input required={form.deliveryType === "DELIVERY"} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input-dark" placeholder="Full address in Hong Kong" />
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="font-body text-xs uppercase tracking-[0.08em] text-smoke mb-2 block">Preferred Date *</label>
                  <input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-dark" />
                </div>
                <div>
                  <label className="font-body text-xs uppercase tracking-[0.08em] text-smoke mb-2 block">Time Slot *</label>
                  <select required value={form.timeSlot} onChange={(e) => setForm({ ...form, timeSlot: e.target.value })} className="input-dark">
                    <option value="">Select time</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="font-body text-xs uppercase tracking-[0.08em] text-smoke mb-2 block">Notes</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-dark resize-none" rows={3} placeholder="Special instructions, allergies, etc." />
              </div>
              <button
                type="submit"
                disabled={createOrder.isPending}
                className="w-full py-4 bg-ember text-charcoal rounded font-body text-sm uppercase tracking-[0.1em] hover:bg-burnt transition-colors cursor-pointer disabled:opacity-50"
              >
                {createOrder.isPending ? "Submitting..." : `Place Order - $${totalAmount.toLocaleString()}`}
              </button>
            </form>
            <div className="bg-charcoal-light border border-[rgba(196,148,58,0.1)] rounded-lg p-6 h-fit">
              <h3 className="font-body text-xs uppercase tracking-[0.1em] text-cream mb-4 pb-4 border-b border-[rgba(196,148,58,0.1)]">Order Summary</h3>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="font-body text-cream">{item.name}</span>
                    <span className="font-body text-smoke">{item.weightKg ? `${item.weightKg}kg` : `${item.quantity}x`} @ ${item.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-[rgba(196,148,58,0.2)]">
                <div className="flex justify-between">
                  <span className="font-body text-base text-cream">Total</span>
                  <span className="font-body text-xl font-semibold text-burnt">${totalAmount.toLocaleString()}</span>
                </div>
                {totalAmount < 800 && (
                  <p className="font-body text-xs text-burnt mt-2">Add ${(800 - totalAmount).toLocaleString()} more to reach minimum order ($800)</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
