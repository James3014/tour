'use client';

import { useEffect, useState } from 'react';
import type { ResortSummary } from '@/lib/types/resort';

interface ResortSearchInputProps {
  value?: ResortSummary | null;
  onSelect: (option: ResortSummary | null) => void;
  placeholder?: string;
  allowClear?: boolean;
}

export default function ResortSearchInput({
  value,
  onSelect,
  placeholder = '搜尋雪場或輸入關鍵字',
  allowClear = true,
}: ResortSearchInputProps) {
  const [query, setQuery] = useState(value?.name ?? '');
  const [results, setResults] = useState<ResortSummary[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setQuery(value?.name ?? '');
  }, [value?.resort_id]);

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      fetchResorts(query, controller.signal);
    }, 250);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query, open]);

  const fetchResorts = async (keyword: string, signal?: AbortSignal) => {
    setLoading(true);
    try {
      const url = new URL('/api/resorts', window.location.origin);
      if (keyword) {
        url.searchParams.set('q', keyword);
      }
      const res = await fetch(url.toString(), { signal });
      if (!res.ok) throw new Error('failed');
      const data = await res.json();
      setResults(data);
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Failed to search resorts', error);
        setResults([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (option: ResortSummary | null) => {
    onSelect(option);
    if (option) {
      setQuery(option.name);
    }
    setOpen(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white">
        <input
          type="text"
          value={query}
          placeholder={placeholder}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className="flex-1 outline-none bg-transparent text-sm"
        />
        {allowClear && value && (
          <button
            type="button"
            className="text-xs text-gray-500 hover:text-red-500"
            onClick={() => handleSelect(null)}
          >
            清除
          </button>
        )}
      </div>

      {open && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-auto">
          {loading ? (
            <p className="text-sm text-gray-500 p-3">搜尋中...</p>
          ) : results.length === 0 ? (
            <p className="text-sm text-gray-500 p-3">找不到符合的雪場</p>
          ) : (
            results.map((option) => (
              <button
                key={option.resort_id}
                onClick={() => handleSelect(option)}
                className="flex flex-col w-full text-left px-4 py-2 hover:bg-blue-50"
              >
                <span className="font-semibold text-sm">{option.name}</span>
                <span className="text-xs text-gray-500">
                  {option.region} · {option.country_code}
                </span>
                {option.tagline && (
                  <span className="text-xs text-gray-400 mt-1">
                    {option.tagline}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
