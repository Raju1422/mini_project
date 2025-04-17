import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";

// Dropdown Component
const LocationSearchDropdown = ({ setCoordinates, setLocation, errorMessage, setErrorMessage }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.length > 2) {
        fetchSuggestions();
      } else {
        setSuggestions([]);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const fetchSuggestions = async () => {
    setLoadingSuggestions(true);
    setErrorMessage("");
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (err) {
      setErrorMessage("Error fetching suggestions.");
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleSelect = (place) => {
    const { lat, lon, display_name } = place;
    setCoordinates({ lat: parseFloat(lat), lng: parseFloat(lon) });
    setLocation(`${display_name} (Lat: ${lat}, Lng: ${lon})`);
    setQuery(display_name);
    setSuggestions([]);
  };

  return (
    <div className="mb-2 relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-4 border-2 border-gray-300 rounded-md"
        placeholder="Search for a location"
      />
      {loadingSuggestions && <p className="text-sm text-gray-500 mt-1">Loading...</p>}
      {suggestions.length > 0 && (
        <ul className="absolute bg-white border border-gray-300 rounded-md w-full mt-1 max-h-40 overflow-y-auto z-10">
          {suggestions.map((place, idx) => (
            <li
              key={idx}
              className="p-2 hover:bg-gray-100 cursor-pointer text-left"
              onClick={() => handleSelect(place)}
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Main ReportForm Component
const ReportForm = () => {
  const [incidentType, setIncidentType] = useState("");
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: 51.505, lng: -0.09 }); // Default to London
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files) {
      setImages(Array.from(files));
    }
  };

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

    return <Marker position={[coordinates.lat, coordinates.lng]} />;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!incidentType || !location || !description) {
      setErrorMessage("Please fill in all the required fields.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    const formData = new FormData();
    formData.append("incident_type", incidentType);
    formData.append("location", location);
    formData.append("description", description);
    images.forEach((image) => {
      formData.append("uploaded_images", image);
    });
    console.log(formData);
    console.log("hi")
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    try {
      const response = await fetch("http://127.0.0.1:8000/api/feedback/incident-report/", {
        method: "POST",
        body: formData,
      });

      // Try parsing JSON only if content is present
      const text = await response.text();
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (jsonErr) {
        throw new Error("Invalid JSON response from server.");
      }

      if (response.ok) {
        alert("Incident reported successfully!");
        setIncidentType("");
        setLocation("");
        setDescription("");
        setImages([]);
        setCoordinates({ lat: 51.505, lng: -0.09 });
      } else {
        alert("Invalid Image");
        setErrorMessage(data.message || "Invalid");


      }
    } catch (error) {
      setErrorMessage(error.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="incident-report" className="py-20 bg-gray-100">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Report an Incident</h2>
        <div className="bg-white shadow-md rounded-lg p-8 max-w-lg mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Incident Type</label>
              <select
                value={incidentType}
                onChange={(e) => setIncidentType(e.target.value)}
                className="w-full p-4 border-2 border-gray-300 rounded-md"
                required
              >
                <option value="">Select Incident Type</option>
                <option value="Accident">Accident</option>
                <option value="Harassment">Harassment</option>
                <option value="Theft">Theft</option>
                <option value="Vandalism">Vandalism</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Location</label>
              <LocationSearchDropdown
                setCoordinates={setCoordinates}
                setLocation={setLocation}
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
              />
              <input
                type="text"
                value={location}
                readOnly
                className="w-full p-4 border-2 border-gray-300 rounded-md"
                placeholder="Selected location will appear here"
                required
              />
            </div>

            <div className="mb-4">
              <MapContainer
                center={[coordinates.lat, coordinates.lng]}
                zoom={13}
                style={{ height: "300px", width: "100%" }}
                className="rounded-md border-2 border-gray-300"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <MapViewUpdater coords={coordinates} />
                <LocationMarker />
              </MapContainer>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                className="w-full p-4 border-2 border-gray-300 rounded-md"
                placeholder="Describe the incident"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Upload Images (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                multiple
                className="w-full p-4 border-2 border-gray-300 rounded-md"
              />
              {images.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-4">
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-32 h-32 object-cover rounded-md"
                    />
                  ))}
                </div>
              )}
            </div>

            {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}

            <button
              type="submit"
              className="w-full px-6 py-3 bg-pink-500 text-white rounded-lg shadow-lg hover:bg-pink-600"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Report"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ReportForm;
