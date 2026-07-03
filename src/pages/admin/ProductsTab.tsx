import { useState, useRef } from "react";
import { trpc } from "@/providers/trpc";
import { uploadImage, storageConfigured } from "@/lib/uploadImage";

type Section = "SMOKEHOUSE" | "BUTCHER" | "WINE";
type PriceUnit = "PER_KG" | "PER_PIECE" | "PER_PACK" | "PER_TRAY" | "PER_PORTION";

const PRICE_UNITS: PriceUnit[] = ["PER_KG", "PER_PIECE", "PER_PACK", "PER_TRAY", "PER_PORTION"];
const UNIT_LABELS: Record<PriceUnit, string> = {
  PER_KG: "Per KG", PER_PIECE: "Per Piece", PER_PACK: "Per Pack", PER_TRAY: "Per Tray", PER_PORTION: "Per Portion",
};

type ProductForm = {
  id?: number;
  name: string;
  description: string;
  price: string;
  priceUnit: PriceUnit;
  minWeightKg: string;
  maxWeightKg: string;
  weightStep: string;
  categoryId: number;
  section: Section;
  isActive: "true" | "false";
  sortOrder: number;
  images: string[];
};

const blank = (section: Section, categoryId: number): ProductForm => ({
  name: "", description: "", price: "", priceUnit: "PER_KG",
  minWeightKg: "", maxWeightKg: "", weightStep: "0.5",
  categoryId, section, isActive: "true", sortOrder: 0, images: [],
});

export default function ProductsTab() {
  const [section, setSection] = useState<Section>("SMOKEHOUSE");
  const [form, setForm] = useState<ProductForm | null>(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: products, refetch } = trpc.product.listAll.useQuery();
  const { data: categories } = trpc.product.categoriesAll.useQuery();

  const upsert = trpc.product.upsert.useMutation({
    onSuccess: () => { refetch(); setForm(null); setError(""); },
    onError: (e) => setError(e.message),
  });
  const del = trpc.product.delete.useMutation({ onSuccess: () => refetch() });

  const filtered = products?.filter((p) => p.section === section) ?? [];
  const sectionCategories = categories?.filter((c) => c.section === section) ?? [];
  const allCategories = categories ?? [];

  const openAdd = () => setForm(blank(section, sectionCategories[0]?.id ?? 1));
  const openEdit = (p: typeof filtered[0]) => setForm({
    id: p.id, name: p.name, description: p.description ?? "",
    price: p.price, priceUnit: p.priceUnit as PriceUnit,
    minWeightKg: p.minWeightKg ?? "", maxWeightKg: p.maxWeightKg ?? "",
    weightStep: p.weightStep ?? "0.5", categoryId: p.categoryId,
    section: p.section as Section, isActive: p.isActive, sortOrder: p.sortOrder,
    images: (p.images as string[]) ?? [],
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !form) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadImage(file);
      setForm((f) => f ? { ...f, images: [...f.images, url] } : f);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const removeImage = (idx: number) => {
    if (!form) return;
    setForm({ ...form, images: form.images.filter((_, i) => i !== idx) });
  };

  const submit = () => {
    if (!form) return;
    if (!form.name || !form.price) { setError("Name and price are required."); return; }
    if (!form.categoryId) { setError("Select a category for this section first."); return; }
    upsert.mutate({
      ...form,
      description: form.description || null,
      minWeightKg: form.minWeightKg || null,
      maxWeightKg: form.maxWeightKg || null,
      weightStep: form.weightStep || null,
    });
  };

  const catName = (id: number) => allCategories.find((c) => c.id === id)?.name ?? "-";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {(["SMOKEHOUSE", "BUTCHER", "WINE"] as Section[]).map((s) => (
            <button key={s} onClick={() => setSection(s)}
              className={`px-4 py-1.5 rounded font-body text-xs uppercase tracking-wider transition-all cursor-pointer ${
                section === s ? "bg-ember text-charcoal" : "bg-charcoal-light text-smoke hover:text-cream"
              }`}
            >{s}</button>
          ))}
        </div>
        <button onClick={openAdd}
          className="px-4 py-2 bg-ember text-charcoal rounded font-body text-xs uppercase tracking-wider hover:bg-burnt transition-colors cursor-pointer"
        >+ Add Product</button>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 && (
          <p className="text-center font-body text-smoke py-12">No products yet. Click "+ Add Product".</p>
        )}
        {filtered.map((p) => (
          <div key={p.id} className="bg-charcoal-light border border-[rgba(196,148,58,0.1)] rounded-lg px-4 py-3 flex items-center gap-4">
            {/* Thumbnail */}
            <div className="w-12 h-12 rounded bg-charcoal shrink-0 overflow-hidden">
              {(p.images as string[])?.length > 0
                ? <img src={(p.images as string[])[0]} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-smoke opacity-30 text-lg">🖼</div>
              }
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-body text-sm text-cream font-medium truncate">{p.name}</span>
                <span className={`font-body text-[0.6rem] uppercase px-1.5 py-0.5 rounded ${
                  p.isActive === "true" ? "bg-emerald-900/40 text-emerald-400" : "bg-red-900/30 text-red-400"
                }`}>{p.isActive === "true" ? "Active" : "Hidden"}</span>
              </div>
              <p className="font-body text-xs text-smoke mt-0.5">
                {catName(p.categoryId)} · HK${parseFloat(p.price).toLocaleString()} {UNIT_LABELS[p.priceUnit as PriceUnit]}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => openEdit(p)}
                className="px-3 py-1 rounded font-body text-xs text-smoke hover:text-cream border border-[rgba(196,148,58,0.15)] hover:border-ember transition-colors cursor-pointer"
              >Edit</button>
              <button onClick={() => { if (confirm(`Delete "${p.name}"?`)) del.mutate({ id: p.id }); }}
                className="px-3 py-1 rounded font-body text-xs text-red-400 hover:text-red-300 border border-red-900/30 hover:border-red-700 transition-colors cursor-pointer"
              >Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {form && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setForm(null)}>
          <div className="bg-charcoal border border-[rgba(196,148,58,0.2)] rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-xl text-cream mb-4">{form.id ? "Edit Product" : "Add Product"}</h3>

            <div className="space-y-3">
              {/* Images */}
              <Field label="Photos">
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.images.map((url, i) => (
                    <div key={i} className="relative group w-20 h-20 rounded overflow-hidden bg-charcoal-light">
                      <img src={url} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-red-400 text-lg cursor-pointer"
                      >✕</button>
                    </div>
                  ))}
                  <label className={`w-20 h-20 rounded border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                    storageConfigured
                      ? "border-[rgba(196,148,58,0.3)] hover:border-ember text-smoke hover:text-ember"
                      : "border-[rgba(255,255,255,0.1)] text-smoke/40 cursor-not-allowed"
                  }`}>
                    <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFileChange} disabled={!storageConfigured || uploading} />
                    {uploading ? (
                      <div className="w-4 h-4 border-2 border-ember border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span className="text-xl leading-none">+</span>
                        <span className="font-body text-[0.55rem] uppercase tracking-wide mt-1">Photo</span>
                      </>
                    )}
                  </label>
                </div>
                {!storageConfigured && (
                  <p className="font-body text-[0.65rem] text-smoke opacity-50">
                    Add VITE_SUPABASE_ANON_KEY to .env to enable photo uploads.
                  </p>
                )}
              </Field>

              <Field label="Name">
                <input className="input-dark" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Smoked Brisket" />
              </Field>
              <Field label="Description">
                <textarea className="input-dark resize-none" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional description" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Price (HK$)">
                  <input className="input-dark" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="1600" />
                </Field>
                <Field label="Price Unit">
                  <select className="input-dark" value={form.priceUnit} onChange={(e) => setForm({ ...form, priceUnit: e.target.value as PriceUnit })}>
                    {PRICE_UNITS.map((u) => <option key={u} value={u}>{UNIT_LABELS[u]}</option>)}
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Min KG">
                  <input className="input-dark" type="number" step="0.5" value={form.minWeightKg} onChange={(e) => setForm({ ...form, minWeightKg: e.target.value })} placeholder="0.5" />
                </Field>
                <Field label="Max KG">
                  <input className="input-dark" type="number" step="0.5" value={form.maxWeightKg} onChange={(e) => setForm({ ...form, maxWeightKg: e.target.value })} placeholder="5" />
                </Field>
                <Field label="Weight Step">
                  <input className="input-dark" type="number" step="0.25" value={form.weightStep} onChange={(e) => setForm({ ...form, weightStep: e.target.value })} placeholder="0.5" />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Section">
                  <select className="input-dark" value={form.section} onChange={(e) => {
                    const newSection = e.target.value as Section;
                    const firstCat = allCategories.find((c) => c.section === newSection)?.id ?? 0;
                    setForm({ ...form, section: newSection, categoryId: firstCat });
                  }}>
                    <option value="SMOKEHOUSE">Smokehouse</option>
                    <option value="BUTCHER">Butcher</option>
                    <option value="WINE">Wine</option>
                  </select>
                </Field>
                <Field label="Category">
                  <select className="input-dark" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })}>
                    {allCategories.filter((c) => c.section === form.section).map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Status">
                  <select className="input-dark" value={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.value as "true" | "false" })}>
                    <option value="true">Active (visible)</option>
                    <option value="false">Hidden</option>
                  </select>
                </Field>
                <Field label="Sort Order">
                  <input className="input-dark" type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
                </Field>
              </div>
            </div>

            {error && <p className="font-body text-xs text-red-400 mt-3">{error}</p>}

            <div className="flex gap-3 mt-5">
              <button onClick={submit} disabled={upsert.isPending}
                className="flex-1 py-2.5 bg-ember text-charcoal rounded font-body text-xs uppercase tracking-wider hover:bg-burnt disabled:opacity-50 transition-colors cursor-pointer"
              >{upsert.isPending ? "Saving…" : "Save Product"}</button>
              <button onClick={() => setForm(null)}
                className="px-4 py-2.5 rounded font-body text-xs uppercase tracking-wider text-smoke hover:text-cream border border-[rgba(196,148,58,0.15)] transition-colors cursor-pointer"
              >Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="font-body text-[0.65rem] uppercase tracking-wider text-smoke block mb-1">{label}</label>
      {children}
    </div>
  );
}
