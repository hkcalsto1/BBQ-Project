import { useState, useEffect } from "react";
import { trpc } from "@/providers/trpc";
import { fallbackProducts, fallbackCategories } from "@/data/fallbackProducts";

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string;
  priceUnit: string;
  minWeightKg: string | null;
  maxWeightKg: string | null;
  weightStep: string | null;
  categoryId: number;
  section: string;
  sortOrder: number;
  images: string[] | null;
}

export interface Category {
  id: number;
  name: string;
  section: string;
  slug: string;
  sortOrder: number;
  isActive: "true" | "false";
  createdAt: Date;
}

export function useShopData() {
  const [products, setProducts] = useState<Product[]>(fallbackProducts as Product[]);
  const [categories, setCategories] = useState<Category[]>(fallbackCategories as Category[]);
  const [isLoading, setIsLoading] = useState(false);

  const productQuery = trpc.product.list.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const categoryQuery = trpc.product.categories.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    // If tRPC data loads successfully, use it
    if (productQuery.data && productQuery.data.length > 0) {
      setProducts(productQuery.data as unknown as Product[]);
    }
    if (categoryQuery.data && categoryQuery.data.length > 0) {
      setCategories(categoryQuery.data as unknown as Category[]);
    }
    setIsLoading(productQuery.isLoading || categoryQuery.isLoading);
  }, [productQuery.data, categoryQuery.data, productQuery.isLoading, categoryQuery.isLoading]);

  return { products, categories, isLoading };
}
