import { useEffect, useState } from "react";

import { getCoffeeBeans } from "../services/coffeeBeanService";
import type { CoffeeBean } from "../types/coffeeBean";

export function useCoffeeBeans() {
  const [coffeeBeans, setCoffeeBeans] = useState<CoffeeBean[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCoffeeBeans() {
      try {
        const data = await getCoffeeBeans();
        setCoffeeBeans(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load coffee beans",
        );
      } finally {
        setLoading(false);
      }
    }

    loadCoffeeBeans();
  }, []);

  return { coffeeBeans, loading, error };
}
