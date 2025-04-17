import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Function to generate 8 equidistant points within a 0.5 km radius
const generateEquidistantCoordinates = (
  latitude,
  longitude,
  radiusInKm,
  numberOfPoints = 8
) => {
  const points = [];
  const earthRadius = 6371; // Earth radius in kilometers

  // Calculate the angular separation between points (360° / numberOfPoints)
  const angleIncrement = (2 * Math.PI) / numberOfPoints;

  for (let i = 0; i < numberOfPoints; i++) {
    const angle = angleIncrement * i; // Angle for each point

    // Calculate the latitude and longitude changes using trigonometry
    const deltaLat =
      (radiusInKm / earthRadius) * (180 / Math.PI) * Math.sin(angle);
    const deltaLon =
      ((radiusInKm / earthRadius) * (180 / Math.PI) * Math.cos(angle)) /
      Math.cos((latitude * Math.PI) / 180);

    const newLat = latitude + deltaLat;
    const newLon = longitude + deltaLon;

    points.push({ latitude: newLat, longitude: newLon });
  }

  return points;
};

const LocationTracker = () => {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    error: null,
  });
  const [locationHistory, setLocationHistory] = useState([]);
  const mapRef = useRef(null); // Reference for the map
  const markerRef = useRef(null); // Reference for the central marker
  const circleRef = useRef(null); // Reference for the 1 km radius circle
  const markersRef = useRef([]); // To store the markers for generated coordinates

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation((prevState) => ({
        ...prevState,
        error: "Geolocation is not supported by your browser",
      }));
      return;
    }

    const success = (position) => {
      const { latitude, longitude } = position.coords;

      // Update the current location
      setLocation({ latitude, longitude, error: null });

      // Only update map, marker, and circle if they are initialized
      if (mapRef.current && markerRef.current && circleRef.current) {
        mapRef.current.setView([latitude, longitude], 13); // Update the map center
        markerRef.current.setLatLng([latitude, longitude]); // Update the marker position
        circleRef.current.setLatLng([latitude, longitude]); // Update the circle position
      }

      // Add the new location to the history
      setLocationHistory((prevHistory) => {
        const now = Date.now();
        const updatedHistory = [
          ...prevHistory,
          { latitude, longitude, timestamp: now },
        ];

        // Remove locations older than 5 minutes
        return updatedHistory.filter(
          (entry) => now - entry.timestamp <= 5 * 60 * 1000
        );
      });

      // Generate 8 equidistant coordinates within a 0.5 km radius (500 meters)
      const equidistantCoordinates = generateEquidistantCoordinates(
        latitude,
        longitude,
        0.5
      ); // 0.5 km radius

      // Remove previous markers before adding new ones
      markersRef.current.forEach((marker) =>
        mapRef.current.removeLayer(marker)
      );
      markersRef.current = [];

      // Define an array of colors for the markers
      const colors = [
        "red",
        "green",
        "blue",
        "yellow",
        "purple",
        "orange",
        "pink",
        "brown",
      ];

      // Add new markers to the map for the equidistant points
      equidistantCoordinates.forEach((coords, index) => {
        const marker = L.marker([coords.latitude, coords.longitude], {
          icon: L.icon({
            iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${colors[index]}.png`, // Using different color for each point
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
          }),
        }).addTo(mapRef.current);
        markersRef.current.push(marker);
      });
    };

    const error = (err) => {
      setLocation((prevState) => ({ ...prevState, error: err.message }));
    };

    const watchId = navigator.geolocation.watchPosition(success, error);

    // Initialize Leaflet map once
    if (!mapRef.current) {
      mapRef.current = L.map("map", {
        center: [51.505, -0.09], // Default map center
        zoom: 13,
      });

      // Add OpenStreetMap tile layer to the map
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
        mapRef.current
      );

      // Add central marker to the map
      markerRef.current = L.marker([51.505, -0.09], {
        icon: L.icon({
          iconUrl:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Blue_marker.svg/512px-Blue_marker.svg.png", // Blue marker for the center
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        }),
      }).addTo(mapRef.current);

      // Add a 1 km radius circle around the central location
      circleRef.current = L.circle([51.505, -0.09], {
        color: "blue",
        fillColor: "#30f",
        fillOpacity: 0.5,
        radius: 1000, // 1 km (1000 meters) radius
      }).addTo(mapRef.current);
    }

    // Cleanup on unmount
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []); // Empty dependency array to run the effect only once

  return (
    <div className="p-4 bg-gray-100 text-gray-800">
      <h1 className="text-xl font-bold text-blue-500">
        Continuous Location Tracker
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
              {new Date(entry.timestamp).toLocaleTimeString()} )
            </li>
          ))}
        </ul>
      ) : (
        <p>No location history available.</p>
      )}
    </div>
  );
};

export default LocationTracker;
