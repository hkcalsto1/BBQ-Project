import { useState } from "react";
import { trpc } from "@/providers/trpc";

type Section = "SMOKEHOUSE" | "BUTCHER";

type CatForm = {
  id?: number;
  name: string;
  section: Section;
  slug: string;
  sortOrder: number;
  isActive: "true" | "false";
};

const blank = (): CatForm => ({ name: "", section: "SMOKEHOUSE", slug: "", sortOrder: 0, isActive: "true" });

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function CategoriesTab() {
  const [form, setForm] = useState<CatForm | null>(null);
  const [error, setError] = useState("");

  const { data: categories, refetch } = trpc.product.categoriesAll.useQuery();
  const upsert = trpc.product.upsertCategory.useMutation({
    onSuccess: () => { refetch(); setForm(null); setError(""); },
    onError: (e) => setError(e.message),
  });
  const del = trpc.product.deleteCategory.useMutation({ onSuccess: () => refetch() });
  const seed = trpc.product.seedCategories.useMutation({ onSuccess: () => refetch() });

  const isEmpty = !categories || categories.length === 0;

  const submit = () => {
    if (!form) return;
    if (!form.name) { setError("Name is required."); return; }
    const slug = form.slug || toSlug(form.name);
    upsert.mutate({ ...form, slug });
  };

  const bySection = (s: Section) => categories?.filter((c) => c.section === s) ?? [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          {isEmpty && (
            <button
              onClick={() => seed.mutate()}
              disabled={seed.isPending}
              className="px-4 py-2 bg-charcoal-light text-smoke hover:text-cream border border-[rgba(196,148,58,0.2)] rounded font-body text-xs uppercase tracking-wider disabled:opacity-50 transition-colors cursor-pointer mr-2"
            >
              {seed.isPending ? "Seeding…" : "Seed Default Categories"}
            </button>
          )}
        </div>
        <button
          onClick={() => setForm(blank())}
          className="px-4 py-2 bg-ember text-charcoal rounded font-body text-xs uppercase tracking-wider hover:bg-burnt transition-colors cursor-pointer"
        >
          + Add Category
        </button>
      </div>

      {isEmpty && (
        <div className="bg-charcoal-light border border-[rgba(196,148,58,0.1)] rounded-lg p-6 text-center mb-6">
          <p className="font-body text-smoke text-sm mb-1">No categories yet.</p>
          <p className="font-body text-smoke text-xs">Click "Seed Default Categories" to add Smoked Meats, Sides, Beef, Pork, etc. automatically.</p>
        </div>
      )}

      {(["SMOKEHOUSE", "BUTCHER"] as Section[]).map((s) => (
        <div key={s} className="mb-8">
          <h3 className="font-body text-xs uppercase tracking-[0.15em] text-ember mb-3">{s}</h3>
          <div className="space-y-2">
            {bySection(s).map((cat) => (
              <div key={cat.id} className="bg-charcoal-light border border-[rgba(196,148,58,0.1)] rounded-lg px-4 py-3 flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-body text-sm text-cream font-medium">{cat.name}</span>
                    <span className="font-body text-[0.6rem] text-smoke opacity-50">/{cat.slug}</span>
                    <span className={`font-body text-[0.6rem] uppercase px-1.5 py-0.5 rounded ${
                      cat.isActive === "true" ? "bg-emerald-900/40 text-emerald-400" : "bg-red-900/30 text-red-400"
                    }`}>{cat.isActive === "true" ? "Active" : "Hidden"}</span>
                  </div>
                  <p className="font-body text-xs text-smoke opacity-50 mt-0.5">Sort: {cat.sortOrder}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setForm({ id: cat.id, name: cat.name, section: cat.section as Section, slug: cat.slug, sortOrder: cat.sortOrder, isActive: cat.isActive })}
                    className="px-3 py-1 rounded font-body text-xs text-smoke hover:text-cream border border-[rgba(196,148,58,0.15)] hover:border-ember transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => { if (confirm(`Delete "${cat.name}"? Products in this category will lose their category.`)) del.mutate({ id: cat.id }); }}
                    className="px-3 py-1 rounded font-body text-xs text-red-400 hover:text-red-300 border border-red-900/30 hover:border-red-700 transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {bySection(s).length === 0 && (
              <p className="font-body text-xs text-smoke opacity-50 py-4 text-center">No categories.</p>
            )}
          </div>
        </div>
      ))}

      {/* Modal */}
      {form && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setForm(null)}>
          <div className="bg-charcoal border border-[rgba(196,148,58,0.2)] rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-xl text-cream mb-4">{form.id ? "Edit Category" : "Add Category"}</h3>

            <div className="space-y-3">
              <Field label="Name">
                <input
                  className="input-dark"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value, slug: form.slug || toSlug(e.target.value) })}
                  placeholder="Smoked Meats"
                />
              </Field>
              <Field label="Slug (URL-friendly)">
                <input
                  className="input-dark"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="smoked-meats"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Section">
                  <select className="input-dark" value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value as Section })}>
                    <option value="SMOKEHOUSE">Smokehouse</option>
                    <option value="BUTCHER">Butcher</option>
                  </select>
                </Field>
                <Field label="Sort Order">
                  <input className="input-dark" type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
                </Field>
              </div>
              <Field label="Status">
                <select className="input-dark" value={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.value as "true" | "false" })}>
                  <option value="true">Active</option>
                  <option value="false">Hidden</option>
                </select>
              </Field>
            </div>

            {error && <p className="font-body text-xs text-red-400 mt-3">{error}</p>}

            <div className="flex gap-3 mt-5">
              <button onClick={submit} disabled={upsert.isPending} className="flex-1 py-2.5 bg-ember text-charcoal rounded font-body text-xs uppercase tracking-wider hover:bg-burnt disabled:opacity-50 transition-colors cursor-pointer">
                {upsert.isPending ? "Saving…" : "Save Category"}
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
