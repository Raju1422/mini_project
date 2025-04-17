import React, { useState, useEffect } from "react";
import { FaMapMarkedAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Rectangle,
} from "react-leaflet";
import GetPath from "../components/GetPath";
import MovementMap from "../components/MovementMap";

const Analypath = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [sourceCoordinates, setSourceCoordinates] = useState(null);
  const [destinationCoordinates, setDestinationCoordinates] = useState(null);
  const [route, setRoute] = useState(false);


  const geocodeLocation = async (location) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          location
        )}`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        console.log(lat, lon);
        return { lat: parseFloat(lat), lng: parseFloat(lon) };
      } else {
        console.log("Location not found");
        return null;
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      return null;
    }
  };


  const handleJourneyStart = async () => {
    const sourceCoords = await geocodeLocation(source);
    const destinationCoords = await geocodeLocation(destination);

    if (sourceCoords && destinationCoords) {
      setSourceCoordinates(sourceCoords);
      setDestinationCoordinates(destinationCoords);
      setRoute(true); // Show the map
    } else {
      console.log("Error fetching coordinates");
    }
    console.log("coordinates are source", sourceCoordinates);
    console.log("coordinates are destination", destinationCoordinates);
  };

  const getBounds = () => {
    if (sourceCoordinates && destinationCoordinates) {
      const latitudes = [sourceCoordinates.lat, destinationCoordinates.lat];
      const longitudes = [sourceCoordinates.lng, destinationCoordinates.lng];
      return [
        [Math.min(...latitudes), Math.min(...longitudes)],
        [Math.max(...latitudes), Math.max(...longitudes)],
      ];
    }
    return [
      [0, 0],
      [0, 0],
    ];
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white p-4 shadow-md">
        <div className="text-xl font-bold text-pink-600">WomenTracker</div>
      </header>

      {route && (
        <MovementMap
          src={[sourceCoordinates.lat, sourceCoordinates.lng]}
          des={[destinationCoordinates.lat, destinationCoordinates.lng]}
        />
      )}

      {/* Input Form */}
      <div className="container mx-auto mt-4 p-4 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl text-gray-800 font-semibold mb-4">
          Start Your Journey
        </h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="source" className="block text-gray-700">
                Source
              </label>
              <input
                type="text"
                id="source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter Source"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="destination" className="block text-gray-700">
                Destination
              </label>
              <input
                type="text"
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter Destination"
              />
            </div>
          </div>
          <div className="mt-4 text-center">
            <button
              type="button"
              className="px-6 py-3 bg-pink-500 text-white rounded-lg"
              disabled={!source || !destination}
              onClick={handleJourneyStart}
            >
              Find Path
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Analypath;
