import { useCallback, useEffect, useRef, useState } from 'react';
import type { ResortSummary } from '@/lib/types/resort';

interface FetchOptions {
  silent?: boolean;
  updateResults?: boolean;
  limit?: number;
}

interface UseResortSearchResult {
  results: ResortSummary[];
  loading: boolean;
  prefetched: ResortSummary[];
  search: (keyword: string) => Promise<ResortSummary[]>;
  prefetchPopular: () => Promise<void>;
  resetResults: () => void;
}

export function useResortSearch(limit = 50): UseResortSearchResult {
  const [results, setResults] = useState<ResortSummary[]>([]);
  const [prefetched, setPrefetched] = useState<ResortSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);

  const fetchResorts = useCallback(
    async (keyword: string, options: FetchOptions = {}) => {
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      if (!options.silent) {
        setLoading(true);
      }

      try {
        const url = new URL('/api/resorts', window.location.origin);
        if (keyword) {
          url.searchParams.set('q', keyword);
        }
        url.searchParams.set('limit', String(options.limit ?? limit));

        const res = await fetch(url.toString(), { signal: controller.signal });
        if (!res.ok) {
          throw new Error('Failed to fetch resorts');
        }
        const data = (await res.json()) as ResortSummary[];
        if (options.updateResults !== false) {
          setResults(data);
        }
        return data;
      } finally {
        if (!options.silent) {
          setLoading(false);
        }
      }
    },
    [limit]
  );

  const search = useCallback(
    async (keyword: string) => {
      try {
        return await fetchResorts(keyword);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('[useResortSearch] search failed', error);
          setResults([]);
        }
        return [];
      }
    },
    [fetchResorts]
  );

  const prefetchPopular = useCallback(async () => {
    try {
      const data = await fetchResorts('', { silent: true, updateResults: false });
      setPrefetched(data);
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.warn('[useResortSearch] prefetch failed', error);
      }
    }
  }, [fetchResorts]);

  useEffect(() => {
    return () => {
      controllerRef.current?.abort();
    };
  }, []);

  const resetResults = useCallback(() => setResults([]), []);

  return {
    results,
    loading,
    prefetched,
    search,
    prefetchPopular,
    resetResults,
  };
}
