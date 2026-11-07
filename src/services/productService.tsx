import { supabase } from "../lib/supabase";
import type { Product } from "../types/product";

type ProductRow = {
  id: number;
  Name: string;
  description: string | null;
  price: number | string;
  image_url: string | null;
  categories: { name: string } | null;
};

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from("products").select(`
      id,
      Name,
      description,
      price,
      image_url,
      categories(name)
    `);

  if (error) throw error;

  return ((data ?? []) as unknown as ProductRow[]).map((product) => ({
    id: product.id,
    Name: product.Name,
    description: product.description ?? "",
    price: Number(product.price),
    image_url: product.image_url ?? "",
    category_name: product.categories?.name ?? "",
  }));
}
