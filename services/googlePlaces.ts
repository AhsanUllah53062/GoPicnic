const GOOGLE_PLACES_API_KEY =
  process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY || "";

export type TouristAttraction = {
  place_id: string;
  name: string;
  formatted_address: string;
  rating?: number;
  user_ratings_total?: number;
  types?: string[];
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
};

/**
 * Search for tourist attractions in a specific city
 */
export const searchTouristAttractions = async (
  cityName: string,
  searchQuery?: string,
): Promise<TouristAttraction[]> => {
  try {
    console.log(
      `🔍 Searching tourist attractions in ${cityName}${searchQuery ? ` for "${searchQuery}"` : ""}`,
    );

    // First, get the city's location
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      cityName,
    )}&key=${GOOGLE_PLACES_API_KEY}`;

    const geocodeResponse = await fetch(geocodeUrl);
    const geocodeData = await geocodeResponse.json();

    if (geocodeData.status !== "OK" || !geocodeData.results[0]) {
      console.error("❌ City not found:", cityName);
      throw new Error("City not found");
    }

    const location = geocodeData.results[0].geometry.location;
    console.log(`📍 City location found:`, location);

    // Search for tourist attractions near this location
    const query = searchQuery || "tourist attractions";
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
      query + " in " + cityName,
    )}&location=${location.lat},${location.lng}&radius=50000&key=${GOOGLE_PLACES_API_KEY}`;

    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (searchData.status === "OK") {
      console.log(`✅ Found ${searchData.results.length} attractions`);
      return searchData.results as TouristAttraction[];
    } else if (searchData.status === "ZERO_RESULTS") {
      console.log("⚠️ No attractions found");
      return [];
    } else {
      console.error("❌ Google Places API error:", searchData.status);
      throw new Error("Failed to search attractions");
    }
  } catch (error: any) {
    console.error("❌ Error searching tourist attractions:", error);
    throw new Error(`Failed to search attractions: ${error.message}`);
  }
};

/**
 * Get place details by place ID
 */
export const getPlaceDetails = async (placeId: string): Promise<any> => {
  try {
    console.log(`🔍 Fetching details for place ${placeId}`);

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,geometry,rating,user_ratings_total,photos,opening_hours,website&key=${GOOGLE_PLACES_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK") {
      console.log(`✅ Place details found`);
      return data.result;
    } else {
      console.error("❌ Failed to get place details:", data.status);
      throw new Error("Failed to get place details");
    }
  } catch (error: any) {
    console.error("❌ Error getting place details:", error);
    throw new Error(`Failed to get place details: ${error.message}`);
  }
};
