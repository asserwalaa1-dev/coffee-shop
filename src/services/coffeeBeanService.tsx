import { supabase } from "../lib/supabase";
import type { CoffeeBean } from "../types/coffeeBean";

type CoffeeBeanRow = {
  id: number;
  Name: string;
  origin: string | null;
  roast_level: string | null;
  description: string | null;
  image_url: string | null;
  bean_variants: {
    id: number;
    coffee_bean_id: number;
    weight: number | string;
    price: number | string;
  }[];
};

export async function getCoffeeBeans(): Promise<CoffeeBean[]> {
  const { data, error } = await supabase.from("coffee_beans").select(`
      id,
      Name,
      origin,
      roast_level,
      description,
      image_url,
      bean_variants (*)
    `);

  if (error) throw error;

  return ((data ?? []) as unknown as CoffeeBeanRow[]).map((bean) => ({
    id: bean.id,
    name: bean.Name,
    origin: bean.origin ?? "",
    roast_level: bean.roast_level ?? "",
    description: bean.description ?? "",
    image_url: bean.image_url ?? "",
    variants: (bean.bean_variants ?? []).map((variant) => ({
      id: variant.id,
      coffee_bean_id: variant.coffee_bean_id,
      weight: Number(variant.weight),
      price: Number(variant.price),
    })),
  }));
}
export async function getCoffeeBeanById(
  id: number,
): Promise<CoffeeBean | null> {
  const coffeeBeans = await getCoffeeBeans();

  return coffeeBeans.find((bean) => bean.id === id) ?? null;
}
