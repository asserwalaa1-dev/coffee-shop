import { useEffect, useState } from "react";

import { getCafeInfo } from "../services/cafeInfoService";
import type { CafeInfo } from "../types/cafeInfo";

export function useCafeInfo() {
  const [cafeInfo, setCafeInfo] = useState<CafeInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCafeInfo() {
      try {
        const data = await getCafeInfo();
        setCafeInfo(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load cafe info",
        );
      } finally {
        setLoading(false);
      }
    }

    loadCafeInfo();
  }, []);

  return { cafeInfo, loading, error };
}
