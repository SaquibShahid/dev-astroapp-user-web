import { IconLoader2 } from '@tabler/icons-react';
import React, { useState } from 'react';
import usePlaceSearch from '../../../hooks/usePlaceSearch';
import { getPlaceLocation } from '../../../Utils/places';
import type { ChatProfileBornPlace } from '../../../store/useChatProfileStore';

interface PlaceAutocompleteFieldProps {
  value: ChatProfileBornPlace;
  onChange: (place: ChatProfileBornPlace) => void;
  label?: string;
}

const PlaceAutocompleteField: React.FC<PlaceAutocompleteFieldProps> = ({ value, onChange, label }) => {
  const { suggestions, isSearching, search, clearSuggestions } = usePlaceSearch();
  const [isFocused, setIsFocused] = useState(false);

  const handleTextChange = (text: string) => {
    // Free text is always kept — lat/lng only get attached once a suggestion is picked.
    onChange({ city: text });
    search(text);
  };

  const handleSelectSuggestion = async (placeId: string, description: string) => {
    onChange({ city: description });
    clearSuggestions();
    const location = await getPlaceLocation(placeId);
    onChange({ city: description, ...(location && { latitude: location.latitude, longitude: location.longitude }) });
  };

  const showDropdown = isFocused && (suggestions.length > 0 || isSearching);

  return (
    <div className="relative">
      {label && (
        <label htmlFor="birthPlace" className="block text-sm font-semibold text-text-main mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id="birthPlace"
          type="text"
          value={value.city}
          onChange={(e) => handleTextChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="City where you were born"
          className="w-full bg-bg border border-border rounded-xl py-3 pl-4 pr-10 text-sm font-medium text-text-main focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
          required
        />
        {isSearching && (
          <IconLoader2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light animate-spin" />
        )}
      </div>

      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-2 bg-bg border border-border rounded-xl shadow-lg py-2 max-h-56 overflow-y-auto z-10">
          {suggestions.map((s) => (
            <li key={s.placeId}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelectSuggestion(s.placeId, s.description)}
                className="w-full text-left px-4 py-2 text-sm text-text-main hover:bg-bg-soft transition-colors"
              >
                {s.description}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PlaceAutocompleteField;
