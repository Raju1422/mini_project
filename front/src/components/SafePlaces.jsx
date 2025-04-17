import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  useMap,
  useMapEvents,
} from "react-leaflet";

const ReportForm = () => {
  const [locationInput, setLocationInput] = useState(""); // Input for location search
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: 51.505, lng: -0.09 }); // Default to London
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [radius, setRadius] = useState(1000); // Default radius of 1 km
  const [safePlaces, setSafePlaces] = useState([]); // To store the fetched safe places

  const MapViewUpdater = ({ coords }) => {
    const map = useMap();
    map.setView([coords.lat, coords.lng], 13);
    return null;
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setCoordinates({ lat, lng });
        setLocation(`Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`);
      },
    });

    return coordinates.lat && coordinates.lng ? (
      <Marker position={[coordinates.lat, coordinates.lng]} />
    ) : null;
  };

  const handleLocationSearch = async () => {
    if (!locationInput) {
      setErrorMessage("Please enter a location to search.");
      return;
    }
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          locationInput
        )}`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        setCoordinates({ lat: parseFloat(lat), lng: parseFloat(lon) });
        setLocation(`${display_name} (Lat: ${lat}, Lng: ${lon})`);
      } else {
        setErrorMessage("Location not found. Please try another search.");
      }
    } catch (error) {
      setErrorMessage("Error fetching location. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSafePlaces = async (lat, lon) => {
    if (!lat || !lon || !radius) return;

    setLoading(true);

    try {
      const response = await fetch(
        `https://overpass-api.de/api/interpreter?data=[out:json];(node["amenity"="police"](around:${radius},${lat},${lon});node["amenity"="hospital"](around:${radius},${lat},${lon}););out;`
      );
      const data = await response.json();
      if (data && data.elements) {
        setSafePlaces(data.elements); // Update the safe places list
      } else {
        setErrorMessage("No safe places found within the radius.");
      }
    } catch (error) {
      setErrorMessage("Error fetching safe places. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchSafePlaces(coordinates.lat, coordinates.lng); // Fetch safe places only on form submit
  };

  return (
    <section id="incident-report" className="py-20 bg-white">
      <div className="container text-center ">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">
          Safety Premise Suggestions
        </h2>
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-5xl  mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Location
              </label>
              <div className="flex items-center mb-4">
                <input
                  type="text"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  className="w-full p-4 border-2 border-pink-500 rounded-md focus:ring-2 focus:ring-pink-500"
                  placeholder="Search for a location"
                />
                <button
                  type="button"
                  onClick={handleLocationSearch}
                  className="ml-3 px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none"
                  disabled={loading}
                >
                  Search
                </button>
              </div>
              <input
                type="text"
                value={location}
                readOnly
                className="w-full p-4 border-2 border-pink-500 rounded-md"
                placeholder="Selected location will appear here"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Radius (meters)
              </label>
              <input
                type="number"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                className="w-full p-4 border-2 border-pink-500 rounded-md focus:ring-2 focus:ring-pink-500"
                placeholder="Enter radius in meters"
                min="100"
              />
            </div>

            <div className="mb-6">
              <MapContainer
                center={[coordinates.lat, coordinates.lng]}
                zoom={13}
                style={{ height: "400px", width: "100%" }}
                className="rounded-md border-2 border-pink-500"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <MapViewUpdater coords={coordinates} />
                <LocationMarker />
                <Circle
                  center={[coordinates.lat, coordinates.lng]}
                  radius={radius}
                  color="blue"
                  fillColor="blue"
                  fillOpacity={0.3}
                />
                {safePlaces.map((place) => (
                  <Marker
                    key={place.id}
                    position={[place.lat, place.lon]}
                    title={place.tags.name || "Safe Place"}
                  />
                ))}
              </MapContainer>
            </div>

            {errorMessage && (
              <p className="text-red-600 text-sm mb-4">{errorMessage}</p>
            )}

            <div className="mt-6">
              <button
                type="submit"
                className="w-full px-4 py-3 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </form>

          {/* Safe Places details section moved below submit button */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Safe Places within {radius} meters:
            </h3>
            <ul className="list-disc list-inside bg-pink-50 p-4 rounded-lg shadow-md">
              {safePlaces.map((place, index) => (
                <li
                  key={index}
                  className="text-sm text-gray-700 py-2 px-4 border-b border-gray-200 hover:bg-pink-100"
                >
                  {place.tags.name || "Unnamed place"} -{" "}
                  {place.tags.amenity || "Amenity not listed"}{" "}
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&origin=${coordinates.lat},${coordinates.lng}&destination=${place.lat},${place.lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-600 hover:underline"
                  >
                    Get Directions
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReportForm;
