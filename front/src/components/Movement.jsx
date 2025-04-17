import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Function to simulate the movement of the location
const simulateMovement = (startLat, startLon, distanceInKm, steps = 100) => {
  const points = [];
  const earthRadius = 6371; // Earth's radius in km

  // Calculate the angle and create an array of coordinates along the path
  const deltaLat = (distanceInKm / earthRadius) * (180 / Math.PI);
  const deltaLon =
    ((distanceInKm / earthRadius) * (180 / Math.PI)) /
    Math.cos((startLat * Math.PI) / 180);

  for (let i = 0; i < steps; i++) {
    const lat = startLat + (i * deltaLat) / steps;
    const lon = startLon + (i * deltaLon) / steps;
    points.push({ latitude: lat, longitude: lon });
  }

  return points;
};

const MovingLocation = () => {
  const [location, setLocation] = useState({
    latitude: 51.505,
    longitude: -0.09,
    error: null,
  });
  const [locationHistory, setLocationHistory] = useState([]);
  const mapRef = useRef(null); // Reference for the map
  const markerRef = useRef(null); // Reference for the moving marker
  const circleRef = useRef(null); // Reference for the 1 km radius circle
  const polylineRef = useRef(null); // Reference for the polyline showing movement track

  useEffect(() => {
    const initialLatitude = 51.505;
    const initialLongitude = -0.09;
    setLocation({
      latitude: initialLatitude,
      longitude: initialLongitude,
      error: null,
    });

    // Initialize the map only once
    if (!mapRef.current) {
      mapRef.current = L.map("map", {
        center: [initialLatitude, initialLongitude],
        zoom: 13,
      });

      // Add OpenStreetMap tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
        mapRef.current
      );

      // Add a marker to represent the current location
      markerRef.current = L.marker([initialLatitude, initialLongitude]).addTo(
        mapRef.current
      );

      // Add a 1 km radius circle around the current location
      circleRef.current = L.circle([initialLatitude, initialLongitude], {
        color: "blue",
        fillColor: "#30f",
        fillOpacity: 0.2,
        radius: 1000,
      }).addTo(mapRef.current);

      // Initialize the polyline for the movement track
      polylineRef.current = L.polyline([], { color: "red", weight: 3 }).addTo(
        mapRef.current
      );
    }

    // Simulate the movement of the user
    const movementPoints = simulateMovement(
      initialLatitude,
      initialLongitude,
      1,
      50
    ); // Moving 1 km with 50 steps

    // Function to move the marker
    const moveMarker = () => {
      let step = 0;

      const intervalId = setInterval(() => {
        const { latitude, longitude } = movementPoints[step];
        setLocation({ latitude, longitude, error: null });

        // Update marker, circle, and polyline positions
        if (markerRef.current && circleRef.current && polylineRef.current) {
          const newLatLng = [latitude, longitude];
          markerRef.current.setLatLng(newLatLng);
          circleRef.current.setLatLng(newLatLng);

          // Update the polyline with the new position
          polylineRef.current.addLatLng(newLatLng);
        }

        // Add to location history
        setLocationHistory((prevHistory) => {
          const now = Date.now();
          const updatedHistory = [
            ...prevHistory,
            { latitude, longitude, timestamp: now },
          ];
          return updatedHistory.filter(
            (entry) => now - entry.timestamp <= 5 * 60 * 1000
          ); // Keep last 5 minutes
        });

        // Loop through points continuously
        step = (step + 1) % movementPoints.length;
      }, 1000); // Update every 1 second

      return intervalId;
    };

    const movementInterval = moveMarker();

    // Cleanup the interval on component unmount
    return () => clearInterval(movementInterval);
  }, []);

  return (
    <div className="p-4 bg-gray-100 text-gray-800">
      <h1 className="text-xl font-bold text-blue-500">
        Simulated Moving Location with Track
      </h1>
      {location.error ? (
        <p className="text-red-600">Error: {location.error}</p>
      ) : location.latitude && location.longitude ? (
        <div>
          <p>Current Latitude: {location.latitude}</p>
          <p>Current Longitude: {location.longitude}</p>
        </div>
      ) : (
        <p>Loading current location...</p>
      )}

      {/* Leaflet Map */}
      <div id="map" style={{ width: "100%", height: "400px" }}></div>

      {/* Location History */}
      <h2 className="text-lg font-semibold mt-4">
        Location History (Last 5 Minutes)
      </h2>
      {locationHistory.length > 0 ? (
        <ul className="list-disc ml-6">
          {locationHistory.map((entry, index) => (
            <li key={index}>
              Latitude: {entry.latitude}, Longitude: {entry.longitude} (at{" "}
              {new Date(entry.timestamp).toLocaleTimeString()})
            </li>
          ))}
        </ul>
      ) : (
        <p>No location history available.</p>
      )}
    </div>
  );
};

export default MovingLocation;
