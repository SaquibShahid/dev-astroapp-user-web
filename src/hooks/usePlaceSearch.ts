import { useRef, useState } from 'react';
import { searchPlaces } from '../Utils/places';
import type { PlaceSuggestion } from '../Utils/places';

const PLACE_SEARCH_DEBOUNCE_MS = 350;
const MIN_QUERY_LENGTH = 3;

const usePlaceSearch = () => {
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = (query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    debounceRef.current = setTimeout(async () => {
      const results = await searchPlaces(query);
      setSuggestions(results);
      setIsSearching(false);
    }, PLACE_SEARCH_DEBOUNCE_MS);
  };

  const clearSuggestions = () => setSuggestions([]);

  return { suggestions, isSearching, search, clearSuggestions };
};

export default usePlaceSearch;
