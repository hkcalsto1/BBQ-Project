import { trpc } from "@/providers/trpc";

const STATUS_COLORS: Record<string, string> = {
  NEW: "text-yellow-400 bg-yellow-900/30",
  REVIEWING: "text-blue-400 bg-blue-900/30",
  QUOTED: "text-purple-400 bg-purple-900/30",
  CONFIRMED: "text-emerald-400 bg-emerald-900/30",
  COMPLETED: "text-green-400 bg-green-900/30",
  CANCELLED: "text-red-400 bg-red-900/30",
};

const STATUSES = ["NEW", "REVIEWING", "QUOTED", "CONFIRMED", "COMPLETED", "CANCELLED"];

export default function EnquiriesTab() {
  const { data: enquiries, isLoading, refetch } = trpc.catering.list.useQuery();
  const updateStatus = trpc.catering.updateStatus.useMutation({ onSuccess: () => refetch() });

  return (
    <div>
      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-ember border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : enquiries?.length === 0 ? (
        <p className="text-center font-body text-smoke py-16">No catering enquiries yet.</p>
      ) : (
        <div className="space-y-4">
          {enquiries?.map((e) => (
            <div key={e.id} className="bg-charcoal-light border border-[rgba(196,148,58,0.1)] rounded-lg p-5">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-body text-sm font-semibold text-cream">#{e.id} — {e.customerName}</span>
                    <span className={`font-body text-[0.6rem] uppercase px-2 py-0.5 rounded ${STATUS_COLORS[e.status] ?? "text-smoke bg-charcoal"}`}>
                      {e.status}
                    </span>
                  </div>
                  <p className="font-body text-xs text-smoke">{e.customerEmail} · {e.customerPhone}</p>
                  <p className="font-body text-xs text-smoke mt-0.5">
                    {e.eventDate} · {e.eventType} · {e.guestCount} guests · {e.serviceType}
                  </p>
                  {e.deliveryAddress && (
                    <p className="font-body text-xs text-smoke mt-0.5">📍 {e.deliveryAddress}</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="font-body text-lg font-semibold text-burnt">HK${e.total.toLocaleString()}</p>
                  {e.deliveryFee > 0 && (
                    <p className="font-body text-[0.6rem] text-smoke">incl. HK${e.deliveryFee} delivery</p>
                  )}
                  <p className="font-body text-[0.6rem] text-smoke mt-1">
                    {new Date(e.createdAt).toLocaleDateString('en-HK', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div className="pt-3 border-t border-[rgba(196,148,58,0.08)] mb-3">
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {(e.items as { name: string; quantity: number; total: number }[]).map((item, i) => (
                    <span key={i} className="font-body text-xs text-smoke">
                      {item.name} x{item.quantity} <span className="text-smoke/50">(HK${item.total.toLocaleString()})</span>
                    </span>
                  ))}
                </div>
              </div>

              {e.notes && (
                <p className="font-body text-xs text-smoke italic mb-3">Note: {e.notes}</p>
              )}

              {/* Status actions */}
              <div className="flex flex-wrap gap-2 pt-3 border-t border-[rgba(196,148,58,0.08)]">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus.mutate({ id: e.id, status: s })}
                    disabled={e.status === s || updateStatus.isPending}
                    className={`px-3 py-1 rounded font-body text-[0.6rem] uppercase tracking-wider transition-all cursor-pointer disabled:opacity-30 ${
                      e.status === s
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
