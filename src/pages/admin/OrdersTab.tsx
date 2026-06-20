import { useState } from "react";
import { trpc } from "@/providers/trpc";

const statusColors: Record<string, string> = {
  PENDING: "text-yellow-500",
  CONFIRMED: "text-blue-400",
  PREPARING: "text-orange-400",
  READY: "text-emerald-400",
  DELIVERED: "text-green-500",
  CANCELLED: "text-red-400",
};

export default function OrdersTab() {
  const { data: orders, isLoading, refetch } = trpc.order.list.useQuery();
  const updateStatus = trpc.order.updateStatus.useMutation({ onSuccess: () => refetch() });
  const [filter, setFilter] = useState<string>("ALL");

  const filteredOrders = orders?.filter((o) => filter === "ALL" || o.status === filter);
  const statusCounts = orders?.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {(["PENDING", "CONFIRMED", "PREPARING", "READY"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(filter === s ? "ALL" : s)}
            className={`bg-charcoal-light border rounded-lg p-4 text-left transition-all cursor-pointer ${
              filter === s ? "border-ember" : "border-[rgba(196,148,58,0.1)] hover:border-[rgba(196,148,58,0.3)]"
            }`}
          >
            <span className={`font-body text-2xl font-semibold ${statusColors[s]}`}>
              {statusCounts?.[s] ?? 0}
            </span>
            <p className="font-body text-xs uppercase tracking-wider text-smoke mt-1">{s}</p>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {(["ALL", "PENDING", "CONFIRMED", "PREPARING", "READY", "DELIVERED", "CANCELLED"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded font-body text-xs uppercase tracking-wider transition-all cursor-pointer ${
              filter === s ? "bg-ember text-charcoal" : "bg-charcoal-light text-smoke hover:text-cream"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-ember border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders?.length === 0 && (
            <p className="text-center font-body text-smoke py-12">No orders found.</p>
          )}
          {filteredOrders?.map((order) => (
            <div key={order.id} className="bg-charcoal-light border border-[rgba(196,148,58,0.1)] rounded-lg p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-body text-sm font-semibold text-cream">Order #{order.id}</span>
                    <span className={`font-body text-xs uppercase ${statusColors[order.status]}`}>{order.status}</span>
                  </div>
                  <p className="font-body text-sm text-cream">{order.customerName}</p>
                  <p className="font-body text-xs text-smoke">{order.customerEmail} / {order.customerPhone}</p>
                  {order.deliveryType === "DELIVERY" ? (
                    <p className="font-body text-xs text-smoke mt-1">Delivery: {order.deliveryAddress}</p>
                  ) : (
                    <p className="font-body text-xs text-ember mt-1">Pickup</p>
                  )}
                  {order.deliveryDate && (
                    <p className="font-body text-xs text-smoke mt-0.5">{order.deliveryDate} {order.deliveryTimeSlot}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-body text-lg font-semibold text-burnt">
                    HK${parseFloat(order.totalAmount).toLocaleString()}
                  </p>
                  <p className="font-body text-[0.6rem] text-smoke">{order.items?.length ?? 0} items</p>
                </div>
              </div>

              {order.items && order.items.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[rgba(196,148,58,0.08)]">
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {order.items.map((item: { productName: string; weightKg: string | null; quantity: number }, i: number) => (
                      <span key={i} className="font-body text-xs text-smoke">
                        {item.productName}{item.weightKg ? ` (${item.weightKg}kg)` : ` x${item.quantity}`}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-3 pt-3 border-t border-[rgba(196,148,58,0.08)] flex flex-wrap gap-2">
                {(["PENDING", "CONFIRMED", "PREPARING", "READY", "DELIVERED", "CANCELLED"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus.mutate({ orderId: order.id, status: s })}
                    disabled={order.status === s || updateStatus.isPending}
                    className={`px-3 py-1 rounded font-body text-[0.6rem] uppercase tracking-wider transition-all cursor-pointer disabled:opacity-30 ${
                      order.status === s
                        ? "bg-ember/20 text-ember"
                        : "bg-charcoal text-smoke hover:text-cream border border-[rgba(196,148,58,0.1)]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
