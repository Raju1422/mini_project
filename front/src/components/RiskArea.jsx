import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  useMap,
  useMapEvents,
  Popup,
  CircleMarker,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
// import './ReportForm.css';
const token = localStorage.getItem("accessToken");
const RiskArea = () => {
  const [locationInput, setLocationInput] = useState(""); // Input for location search
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: 51.505, lng: -0.09 }); // Default to London
  const [radius, setRadius] = useState(1); // Default radius in km
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [safePlaces, setSafePlaces] = useState([]); // Store safe places
  const [riskLevels, setRiskLevels] = useState([]);
  const [points, setpoints] = useState([]);

  const getMarkerColor = (riskLevel) => {
    switch (riskLevel) {
      case "High Risk":
        return "red";
      case "Moderate Risk":
        return "yellow";
      case "Low Risk":
        return "blue";
      case "Safe":
        return "green";
      default:
        return "gray";
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
  // function handlerisk(){
  //   console.log("coordinates",coordinates.lat);
  //   const points = generateEquidistantCoordinates(
  //     coordinates.lat,
  //     coordinates.lng,
  //     radius,
  //     8
  //   ); // 5 km radius, you can adjust as needed
  //   console.log("Equidistant Points:", points);
  //   points.push({ latitude: coordinates.lat, longitude: coordinates.lng });
  //   console.log("new points are", points);
  //   connectToWebSocket(points);
  //   console.log("risklevels", riskLevels);
  //   console.log("points are",points)
  //   setpoints(points);

  // }
  function handlerisk() {
    console.log("coordinates", coordinates.lat);
    const points = generateEquidistantCoordinates(
      coordinates.lat,
      coordinates.lng,
      radius,
      80
    );
    console.log("Equidistant Points:", points);
    points.push({ latitude: coordinates.lat, longitude: coordinates.lng });
    console.log("new points are", points);
    connectToWebSocket(points);
    console.log("risklevels", riskLevels);
    console.log("points are", points);
    setpoints(points);
  }

  const connectToWebSocket = (points) => {
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/predict-risk/?token=${token}`);;

    ws.onopen = () => {
      console.log("WebSocket Connection Open");
      ws.send(JSON.stringify(points));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("WebSocket Response:", data);
      const riskLevels = data.map((item) => item.risk);
      setRiskLevels(riskLevels);
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket Connection Closed");
    };
  };

  // const generateEquidistantCoordinates = (
  //   latitude,
  //   longitude,
  //   radiusInKm,
  //   intervalInKm
  // ) => {
  //   const points = [];
  //   const earthRadius = 6371; // Earth radius in kilometers
  //   const numberOfPointsPerCircle = 8; // Points per circle (octagon pattern)

  //   for (let currentRadius = intervalInKm; currentRadius <= radiusInKm; currentRadius += intervalInKm) {
  //     const angleIncrement = (2 * Math.PI) / numberOfPointsPerCircle;

  //     for (let i = 0; i < numberOfPointsPerCircle; i++) {
  //       const angle = angleIncrement * i;

  //       // Calculate the latitude and longitude changes using trigonometry
  //       const deltaLat =
  //         (currentRadius / earthRadius) * (180 / Math.PI) * Math.sin(angle);
  //       const deltaLon =
  //         ((currentRadius / earthRadius) * (180 / Math.PI) * Math.cos(angle)) /
  //         Math.cos((latitude * Math.PI) / 180);

  //       const newLat = latitude + deltaLat;
  //       const newLon = longitude + deltaLon;

  //       points.push({ latitude: newLat, longitude: newLon });
  //     }
  //   }

  //   return points;
  // };

  // const generateEquidistantCoordinates = (
  //   latitude,
  //   longitude,
  //   radiusInKm,
  //   numberOfPoints
  // ) => {
  //   const points = [];
  //   const earthRadius = 6371; // Earth radius in kilometers

  //   for (let i = 0; i < numberOfPoints; i++) {
  //     // Generate a random radius within the specified radius
  //     const randomRadius = Math.random() * radiusInKm;

  //     // Generate a random angle between 0 and 2 * Math.PI
  //     const randomAngle = Math.random() * 2 * Math.PI;

  //     // Calculate the latitude and longitude changes using trigonometry
  //     const deltaLat = (randomRadius / earthRadius) * (180 / Math.PI) * Math.sin(randomAngle);
  //     const deltaLon = ((randomRadius / earthRadius) * (180 / Math.PI) * Math.cos(randomAngle)) / Math.cos((latitude * Math.PI) / 180);

  //     const newLat = latitude + deltaLat;
  //     const newLon = longitude + deltaLon;

  //     points.push({ latitude: newLat, longitude: newLon });
  //   }

  //   return points;
  // };

  // const generateEquidistantCoordinates = (latitude, longitude, radiusInKm) => {
  //   const points = [];
  //   const earthRadius = 6371; // Earth radius in kilometers

  //   // Calculate the number of points based on the radius
  //   const numberOfPoints = Math.max(10, Math.floor(radiusInKm * 5)); // Min 10 points for 1 km, increase with radius

  //   for (let i = 0; i < numberOfPoints; i++) {
  //     // Random distance from the center (latitude, longitude) within the radius
  //     const randomDistance = Math.random() * radiusInKm; // Random distance up to radiusInKm

  //     // Random angle in radians between 0 and 2 * PI
  //     const randomAngle = Math.random() * 2 * Math.PI;

  //     // Calculate latitude and longitude deltas using the random distance and angle
  //     const deltaLat = (randomDistance / earthRadius) * (180 / Math.PI);
  //     const deltaLon =
  //       ((randomDistance / earthRadius) * (180 / Math.PI)) /
  //       Math.cos((latitude * Math.PI) / 180);

  //     // Calculate the new point's latitude and longitude
  //     const newLat = latitude + deltaLat * Math.sin(randomAngle);
  //     const newLon = longitude + deltaLon * Math.cos(randomAngle);

  //     points.push({ latitude: newLat, longitude: newLon });
  //   }

  //   return points;
  // };
  const generateEquidistantCoordinates = (
    latitude,
    longitude,
    maxRadiusInKm
  ) => {
    const points = [];
    const earthRadius = 6371; // Earth radius in kilometers
    const pointsPerRing = 8; // Fixed number of points in each ring

    for (let radius = 1; radius <= maxRadiusInKm; radius++) {
      const angleOffset = Math.random() * 2 * Math.PI; // Random start angle for each ring

      for (let i = 0; i < pointsPerRing; i++) {
        // Calculate angle for the current point in the ring
        const angle = angleOffset + (i * 2 * Math.PI) / pointsPerRing;

        // Calculate latitude and longitude deltas
        const deltaLat = (radius / earthRadius) * (180 / Math.PI);
        const deltaLon =
          ((radius / earthRadius) * (180 / Math.PI)) /
          Math.cos((latitude * Math.PI) / 180);

        // Calculate the new point's latitude and longitude
        const newLat = latitude + deltaLat * Math.sin(angle);
        const newLon = longitude + deltaLon * Math.cos(angle);

        points.push({ latitude: newLat, longitude: newLon });
      }
    }

    return points;
  };

  const fetchSafePlaces = async () => {
    if (!coordinates.lat || !coordinates.lng) {
      setErrorMessage("Please select a location first.");
      return;
    }
    setErrorMessage("");
    setLoading(true);

    try {
      // Example: Using Overpass API for safe places (modify query as needed)
      const query = `
          [out:json];
          (
            node["amenity"="shelter"](around:${radius * 1000}, ${coordinates.lat
        }, ${coordinates.lng});
            way["amenity"="shelter"](around:${radius * 1000}, ${coordinates.lat
        }, ${coordinates.lng});
            relation["amenity"="shelter"](around:${radius * 1000}, ${coordinates.lat
        }, ${coordinates.lng});
          );
          out center;
        `;
      const response = await fetch(
        `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
          query
        )}`
      );
      const data = await response.json();

      if (data.elements && data.elements.length > 0) {
        setSafePlaces(data.elements);
        console.log("Safe Places:", data.elements);
      } else {
        console.log("No safe places found in the specified radius.");
      }
    } catch (error) {
      console.error("Error fetching safe places:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="incident-report" className="py-20 bg-gray-100">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Risk Area Detection
        </h2>
        <div className="bg-white shadow-md rounded-lg p-8 w-3xl  mx-auto">
          <form>
            {/* Location input */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Location
              </label>
              <div className="flex items-center mb-2">
                <input
                  type="text"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  className="w-full p-4 border-2 border-gray-300 rounded-md"
                  placeholder="Search for a location"
                />
                <button
                  type="button"
                  onClick={handleLocationSearch}
                  className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  disabled={loading}
                >
                  Search
                </button>
              </div>
              <input
                type="text"
                value={location}
                readOnly
                className="w-full p-4 border-2 border-gray-300 rounded-md"
                placeholder="Selected location will appear here"
                required
              />
            </div>

            {/* Radius input */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Radius (km)
              </label>
              <input
                type="number"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                min="1"
                className="w-full p-4 border-2 border-gray-300 rounded-md"
                placeholder="Enter radius in km"
                required
              />
            </div>

            {/* Map and Circle */}
            <div className="mb-4">
              <MapContainer
                center={[coordinates.lat, coordinates.lng]}
                zoom={13}
                style={{ height: "700px", width: "100%" }}
                className="rounded-md border-2 border-gray-300"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <MapViewUpdater coords={coordinates} />
                <LocationMarker />
                {/* Display circle with radius */}
                <Circle
                  center={[coordinates.lat, coordinates.lng]}
                  radius={radius * 1000} // Convert km to meters
                  color="blue"
                  fillOpacity={0.2}
                />

                {riskLevels.length > 0 &&
                  riskLevels.map((risk, index) => {
                    const point = points[index];
                    const color = getMarkerColor(risk || "Safe"); // Get color based on risk level

                    return (
                      <React.Fragment key={index}>
                        {/* Marker */}
                        <Marker
                          position={[point.latitude, point.longitude]}
                          icon={L.divIcon({
                            className: `marker-icon marker-${color}`, // Correct string interpolation for className
                            html: `<div style="background-color:${color};width:12px;height:12px;border-radius:50%;"></div>`, // Corrected HTML string
                          })}
                        />

                        {/* Circle with radius 100m and same color */}
                        <Circle
                          center={[point.latitude, point.longitude]}
                          radius={500} // 100 meters radius
                          color={color}
                          fillColor={color}
                          fillOpacity={0.3} // Add opacity for better visibility
                        />
                      </React.Fragment>
                    );
                  })}
              </MapContainer>
            </div>

            {/* Error message */}
            {errorMessage && (
              <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
            )}

            {/* Submit button */}
            <button
              type="button"
              onClick={handlerisk}
              className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-green-600"
            >
              FIND Risk Areas
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default RiskArea;
