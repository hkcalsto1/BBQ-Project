interface Props {
  onConfirm: () => void;
  onDecline: () => void;
}

export default function AgeGate({ onConfirm, onDecline }: Props) {
  return (
    <div className="fixed inset-0 bg-black/85 z-[1000] flex items-center justify-center p-4">
      <div className="bg-charcoal border border-[rgba(196,148,58,0.2)] rounded-2xl p-8 w-full max-w-sm text-center">
        <span className="section-label">The Cellar</span>
        <h2 className="font-display text-2xl text-cream leading-tight mt-3">
          Are you 18 years or older?
        </h2>
        <p className="font-body text-sm font-light text-[rgba(245,230,200,0.6)] mt-3">
          You must be of legal drinking age in Hong Kong to browse and purchase
          wine on this site.
        </p>

        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={onConfirm}
            className="w-full py-2.5 bg-ember text-charcoal rounded-full font-body text-xs font-semibold uppercase tracking-[0.1em] hover:bg-burnt transition-colors cursor-pointer"
          >
            Yes, I'm 18 or older
          </button>
          <button
            onClick={onDecline}
            className="w-full py-2.5 rounded-full font-body text-xs uppercase tracking-[0.1em] text-smoke hover:text-cream border border-[rgba(196,148,58,0.2)] transition-colors cursor-pointer"
          >
            No, take me back
          </button>
        </div>
      </div>
    </div>
  );
}
