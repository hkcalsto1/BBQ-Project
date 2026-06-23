import { useState, useRef } from "react";
import { trpc } from "@/providers/trpc";
import { uploadImage, storageConfigured } from "@/lib/uploadImage";

type Category = "MEAT" | "SIDES" | "SLIDERS" | "OTHER";

const CATEGORIES: Category[] = ["MEAT", "SIDES", "SLIDERS", "OTHER"];
const PRICE_UNITS = ["KG", "RACK", "TRAY", "SLIDER_ORDER", "PC"];

type MenuForm = {
  id?: number;
  category: Category;
  name: string;
  price: number | "";
  priceUnit: string;
  priceSuffix: string;
  image: string;
  isActive: boolean;
  sortOrder: number;
};

const blank = (category: Category): MenuForm => ({
  category, name: "", price: "", priceUnit: "KG", priceSuffix: "", image: "", isActive: true, sortOrder: 0,
});

export default function MenuTab() {
  const [category, setCategory] = useState<Category>("MEAT");
  const [form, setForm] = useState<MenuForm | null>(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: items, refetch } = trpc.menu.listAll.useQuery();
  const upsert = trpc.menu.upsert.useMutation({
    onSuccess: () => { refetch(); setForm(null); setError(""); },
    onError: (e) => setError(e.message),
  });
  const del = trpc.menu.delete.useMutation({ onSuccess: () => refetch() });
  const seed = trpc.menu.seed.useMutation({ onSuccess: () => refetch() });

  const filtered = items?.filter((i) => i.category === category) ?? [];
  const isEmpty = !items || items.length === 0;

  const openEdit = (item: typeof filtered[0]) => setForm({
    id: item.id,
    category: item.category as Category,
    name: item.name,
    price: item.price,
    priceUnit: item.priceUnit,
    priceSuffix: item.priceSuffix,
    image: item.image ?? "",
    isActive: item.isActive,
    sortOrder: item.sortOrder,
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !form) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadImage(file);
      setForm((f) => f ? { ...f, image: url } : f);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const submit = () => {
    if (!form) return;
    if (!form.name || form.price === "") { setError("Name and price are required."); return; }
    upsert.mutate({ ...form, price: Number(form.price), image: form.image || undefined });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-1.5 rounded font-body text-xs uppercase tracking-wider transition-all cursor-pointer ${
                category === c ? "bg-ember text-charcoal" : "bg-charcoal-light text-smoke hover:text-cream"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {isEmpty && (
            <button
              onClick={() => seed.mutate()}
              disabled={seed.isPending}
              className="px-4 py-2 bg-charcoal-light text-smoke hover:text-cream border border-[rgba(196,148,58,0.2)] rounded font-body text-xs uppercase tracking-wider disabled:opacity-50 transition-colors cursor-pointer"
            >
              {seed.isPending ? "Seeding…" : "Seed Defaults"}
            </button>
          )}
          <button
            onClick={() => setForm(blank(category))}
            className="px-4 py-2 bg-ember text-charcoal rounded font-body text-xs uppercase tracking-wider hover:bg-burnt transition-colors cursor-pointer"
          >
            + Add Item
          </button>
        </div>
      </div>

      {isEmpty && (
        <div className="bg-charcoal-light border border-[rgba(196,148,58,0.1)] rounded-lg p-6 text-center mb-4">
          <p className="font-body text-smoke text-sm mb-2">No catering menu items yet.</p>
          <p className="font-body text-smoke text-xs">Click "Seed Defaults" to load the existing menu, or add items manually.</p>
        </div>
      )}

      <div className="space-y-2">
        {filtered.map((item) => (
          <div key={item.id} className="bg-charcoal-light border border-[rgba(196,148,58,0.1)] rounded-lg px-4 py-3 flex items-center gap-4">
            <div className="w-12 h-12 rounded bg-charcoal shrink-0 overflow-hidden">
              {item.image
                ? <img src={item.image} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-smoke opacity-30 text-lg">🖼</div>
              }
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-body text-sm text-cream font-medium">{item.name}</span>
                <span className={`font-body text-[0.6rem] uppercase px-1.5 py-0.5 rounded ${
                  item.isActive ? "bg-emerald-900/40 text-emerald-400" : "bg-red-900/30 text-red-400"
                }`}>{item.isActive ? "Active" : "Hidden"}</span>
              </div>
              <p className="font-body text-xs text-smoke mt-0.5">
                HK${item.price.toLocaleString()} / {item.priceUnit}
                {item.priceSuffix && <span className="ml-1 opacity-70">{item.priceSuffix}</span>}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => openEdit(item)}
                className="px-3 py-1 rounded font-body text-xs text-smoke hover:text-cream border border-[rgba(196,148,58,0.15)] hover:border-ember transition-colors cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => { if (confirm(`Delete "${item.name}"?`)) del.mutate({ id: item.id }); }}
                className="px-3 py-1 rounded font-body text-xs text-red-400 hover:text-red-300 border border-red-900/30 hover:border-red-700 transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {!isEmpty && filtered.length === 0 && (
          <p className="text-center font-body text-smoke py-8">No items in this category.</p>
        )}
      </div>

      {/* Modal */}
      {form && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setForm(null)}>
          <div className="bg-charcoal border border-[rgba(196,148,58,0.2)] rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-xl text-cream mb-4">{form.id ? "Edit Menu Item" : "Add Menu Item"}</h3>

            <div className="space-y-3">
              <Field label="Photo">
                <div className="flex items-center gap-3">
                  {form.image && (
                    <div className="relative group w-20 h-20 rounded overflow-hidden bg-charcoal-light shrink-0">
                      <img src={form.image} className="w-full h-full object-cover" />
                      <button onClick={() => setForm({ ...form, image: "" })}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-red-400 text-lg cursor-pointer"
                      >✕</button>
                    </div>
                  )}
                  <label className={`w-20 h-20 rounded border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${
                    storageConfigured ? "border-[rgba(196,148,58,0.3)] hover:border-ember text-smoke hover:text-ember" : "border-[rgba(255,255,255,0.1)] text-smoke/40 cursor-not-allowed"
                  }`}>
                    <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFileChange} disabled={!storageConfigured || uploading} />
                    {uploading ? <div className="w-4 h-4 border-2 border-ember border-t-transparent rounded-full animate-spin" /> : <><span className="text-xl leading-none">+</span><span className="font-body text-[0.55rem] uppercase tracking-wide mt-1">Photo</span></>}
                  </label>
                </div>
              </Field>
              <Field label="Category">
                <select className="input-dark" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category })}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Name">
                <input className="input-dark" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Smoked Brisket" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Price (HK$)">
                  <input className="input-dark" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value === "" ? "" : Number(e.target.value) })} placeholder="1600" />
                </Field>
                <Field label="Price Unit">
                  <select className="input-dark" value={form.priceUnit} onChange={(e) => setForm({ ...form, priceUnit: e.target.value })}>
                    {PRICE_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="Price Suffix (e.g. /KG, / 40 PC)">
                <input className="input-dark" value={form.priceSuffix} onChange={(e) => setForm({ ...form, priceSuffix: e.target.value })} placeholder="/KG" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Status">
                  <select className="input-dark" value={String(form.isActive)} onChange={(e) => setForm({ ...form, isActive: e.target.value === "true" })}>
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
              <button onClick={submit} disabled={upsert.isPending} className="flex-1 py-2.5 bg-ember text-charcoal rounded font-body text-xs uppercase tracking-wider hover:bg-burnt disabled:opacity-50 transition-colors cursor-pointer">
                {upsert.isPending ? "Saving…" : "Save Item"}
              </button>
              <button onClick={() => setForm(null)} className="px-4 py-2.5 rounded font-body text-xs uppercase tracking-wider text-smoke hover:text-cream border border-[rgba(196,148,58,0.15)] transition-colors cursor-pointer">
                Cancel
              </button>
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
