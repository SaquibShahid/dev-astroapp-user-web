import { IconArrowLeft, IconLoader2, IconSearch } from '@tabler/icons-react';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useHomeStore } from '../../store/useHomeStore';
import SearchResultRow from './components/SearchResultRow';

const SEARCH_DEBOUNCE_MS = 350;

const Search: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';
  const searchResults = useHomeStore((s) => s.searchResults);
  const isLoadingSearchResults = useHomeStore((s) => s.isLoadingSearchResults);
  const searchAstrologers = useHomeStore((s) => s.searchAstrologers);
  const clearSearchResults = useHomeStore((s) => s.clearSearchResults);

  const [query, setQuery] = useState(initialQuery);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    if (initialQuery.trim().length >= 3) {
      searchAstrologers(initialQuery);
    }
    return () => clearSearchResults();
  }, [initialQuery, searchAstrologers, clearSearchResults]);

  const handleChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length < 3) {
      clearSearchResults();
      return;
    }
    debounceRef.current = setTimeout(() => {
      searchAstrologers(value);
    }, SEARCH_DEBOUNCE_MS);
  };

  return (
    <div className="container-custom py-6 max-w-2xl">
      <div className="flex items-center gap-3 mb-6 md:hidden">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="text-text-main flex-shrink-0"
        >
          <IconArrowLeft size={22} />
        </button>

        <div className="relative flex-1">
          <IconSearch size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Search for astrologers, services..."
            className="w-full h-12 pl-11 pr-4 bg-bg-soft border border-border rounded-full focus:outline-none focus:border-primary focus:shadow-sm transition-all text-sm"
          />
        </div>
      </div>

      {isLoadingSearchResults ? (
        <div className="flex items-center justify-center py-16">
          <IconLoader2 size={28} className="animate-spin text-primary" />
        </div>
      ) : query.trim().length < 3 ? (
        <p className="text-center text-sm text-text-muted py-16">Type at least 3 characters to search.</p>
      ) : searchResults.length === 0 ? (
        <p className="text-center text-sm text-text-muted py-16">No astrologers found.</p>
      ) : (
        <div>
          {searchResults.map((astrologer) => (
            <SearchResultRow key={astrologer.id} astrologer={astrologer} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
