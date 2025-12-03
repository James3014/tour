'use client';

import { useEffect, useState } from 'react';
import type { ResortSummary } from '@/lib/types/resort';
import { useResortSearch } from '@/hooks/useResortSearch';

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
  const [open, setOpen] = useState(false);
  const { results, loading, prefetched, search, prefetchPopular, resetResults } = useResortSearch();

  useEffect(() => {
    setQuery(value?.name ?? '');
  }, [value?.resort_id]);

  useEffect(() => {
    prefetchPopular();
  }, [prefetchPopular]);

  useEffect(() => {
    if (!open) {
      resetResults();
      return;
    }
    const timeoutId = setTimeout(() => {
      search(query.trim());
    }, 250);
    return () => clearTimeout(timeoutId);
  }, [open, query, search, resetResults]);

  const handleSelect = (option: ResortSummary | null) => {
    onSelect(option);
    if (option) {
      setQuery(option.name);
    }
    setOpen(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white gap-2">
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
        <button
          type="button"
          aria-label="展開雪場清單"
          onClick={() => setOpen((prev) => !prev)}
          className="text-gray-500 hover:text-blue-600 transition-colors text-xs"
        >
          <span className={`inline-block transition-transform ${open ? 'rotate-180' : ''}`}>
            ▾
          </span>
        </button>
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
            <>
              {query.trim() === '' && prefetched.length > 0 && (
                <p className="px-4 pt-3 pb-1 text-xs text-gray-400">熱門雪場（可直接選擇）</p>
              )}
              {results.map((option) => (
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
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
