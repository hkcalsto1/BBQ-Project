import { useState } from "react";
import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import OrdersTab from "./admin/OrdersTab";
import ProductsTab from "./admin/ProductsTab";
import MenuTab from "./admin/MenuTab";
import CategoriesTab from "./admin/CategoriesTab";
import EnquiriesTab from "./admin/EnquiriesTab";

type Tab = "enquiries" | "orders" | "products" | "menu" | "categories";

const TABS: { id: Tab; label: string }[] = [
  { id: "enquiries", label: "Enquiries" },
  { id: "orders", label: "Shop Orders" },
  { id: "products", label: "Products" },
  { id: "menu", label: "Catering Menu" },
  { id: "categories", label: "Categories" },
];

export default function Admin() {
  const [tab, setTab] = useState<Tab>("enquiries");
  const navigate = useNavigate();
  const logout = trpc.auth.logout.useMutation({ onSuccess: () => navigate("/login") });

  return (
    <div className="bg-charcoal min-h-screen">
      {/* Header */}
      <div className="border-b border-[rgba(196,148,58,0.1)]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 h-14 flex items-center justify-between">
          <span className="font-display text-lg text-cream tracking-wide">SmokeHouse Admin</span>
          <button
            onClick={() => logout.mutate()}
            className="font-body text-xs uppercase tracking-wider text-smoke hover:text-cream transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-8">
        {/* Tab bar */}
        <div className="flex gap-1 mb-8 border-b border-[rgba(196,148,58,0.1)] pb-0">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-2.5 font-body text-xs uppercase tracking-wider transition-all cursor-pointer border-b-2 -mb-px ${
                tab === t.id
                  ? "text-ember border-ember"
                  : "text-smoke hover:text-cream border-transparent"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === "enquiries" && <EnquiriesTab />}
        {tab === "orders" && <OrdersTab />}
        {tab === "products" && <ProductsTab />}
        {tab === "menu" && <MenuTab />}
        {tab === "categories" && <CategoriesTab />}
      </div>
    </div>
  );
}
