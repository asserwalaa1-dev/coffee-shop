import { supabase } from "../lib/supabase";
import type { CafeInfo } from "../types/cafeInfo";

export async function getCafeInfo(): Promise<CafeInfo | null> {
  const { data, error } = await supabase
    .from("cafe_info")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  return data as CafeInfo | null;
}
