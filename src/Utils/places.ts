export interface PlaceSuggestion {
  placeId: string;
  description: string;
}

export interface PlaceLocation {
  latitude: number;
  longitude: number;
}

// Uses Places API (New) REST endpoints directly — unlike the legacy Places
// Autocomplete REST API, these allow browser CORS calls, so no JS SDK/script
// tag or server proxy is needed.
const PLACES_BASE = 'https://places.googleapis.com/v1';

export const searchPlaces = async (query: string): Promise<PlaceSuggestion[]> => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey || !query.trim()) return [];

  try {
    const res = await fetch(`${PLACES_BASE}/places:autocomplete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
      },
      body: JSON.stringify({ input: query }),
    });

    if (!res.ok) return [];

    const data = await res.json();
    const suggestions: unknown[] = data.suggestions || [];

    return suggestions
      .map((s) => (s as { placePrediction?: { placeId: string; text?: { text: string } } }).placePrediction)
      .filter((p): p is { placeId: string; text?: { text: string } } => !!p)
      .map((p) => ({ placeId: p.placeId, description: p.text?.text || '' }));
  } catch {
    return [];
  }
};

export const getPlaceLocation = async (placeId: string): Promise<PlaceLocation | null> => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(`${PLACES_BASE}/places/${placeId}?fields=location`, {
      headers: { 'X-Goog-Api-Key': apiKey },
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (typeof data.location?.latitude === 'number' && typeof data.location?.longitude === 'number') {
      return { latitude: data.location.latitude, longitude: data.location.longitude };
    }
    return null;
  } catch {
    return null;
  }
};
