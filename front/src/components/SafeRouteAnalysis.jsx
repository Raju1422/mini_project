// import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
// import { useEffect, useRef, useState } from "react";

// const icon = new L.Icon({
//   iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

// export default function SafeRouteAnalysis({ src, des }) {
//   const [path, setPath] = useState([]); // path: Array of polyline arrays
//   const [currentPosition, setCurrentPosition] = useState(null);
//   const markerRef = useRef(null);
//   const [index, setIndex] = useState(0);

//   useEffect(() => {
//     const fetchRoute = async () => {
//       try {
//         const response = await fetch(
//           `https://router.project-osrm.org/route/v1/driving/${src[1]},${src[0]};${des[1]},${des[0]}?overview=full&geometries=geojson&alternatives=true`
//         );
//         const data = await response.json();
//         const allRoutes = data.routes;

//         if (allRoutes.length > 0) {
//           alert(allRoutes.length)

//           const allLatLngPaths = allRoutes.map((route) =>
//             route.geometry.coordinates.map(([lng, lat]) => [lat, lng])
//           );

//           setPath(allLatLngPaths);
//           setCurrentPosition(allLatLngPaths[0][0]);
//         }
//       } catch (error) {
//         console.error("Error fetching route:", error);
//       }
//     };

//     fetchRoute();
//   }, [src, des]);

//   useEffect(() => {
//     let animation;
//     if (path.length > 0 && index < path[0].length - 1) {
//       animation = setTimeout(() => {
//         const nextPosition = path[0][index];
//         setCurrentPosition(nextPosition);
//         setIndex((prevIndex) => prevIndex + 1);
//         console.log("Point:", nextPosition);
//       }, 100); // speed of movement
//     }

//     return () => clearTimeout(animation);
//   }, [index, path]);

//   return (
//     <MapContainer
//       center={src}
//       zoom={13}
//       style={{ height: "600px", width: "100%" }}
//     >
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
//       />
//       <Marker position={src} icon={icon} />
//       <Marker position={des} icon={icon} />
//       {/* {console.log("Number of routes fetched:", allLatLngPaths.length)} */}
//       {/* {alert(allLatLngPaths.length)} */}
//       {path.length > 0 &&
//         path.map((polyline, idx) => (
//           <Polyline
//             key={idx}
//             positions={polyline}
//             color={idx === 1 ? "blue" : "gray"}
//             weight={idx === 0 ? 5 : 3}
//             opacity={idx === 0 ? 1 : 0.6}
//             dashArray={idx === 0 ? null : "6"
//             }
//           />
//         ))}
//       {currentPosition && (
//         <Marker
//           position={currentPosition}
//           icon={icon}
//           ref={markerRef}
//         />
//       )}
//     </MapContainer>
//   );
// }
import React, { useState, useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Tooltip,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const customMarkerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const MapCenterer = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.setView(coords, 13);
    }
  }, [coords, map]);
  return null;
};

const SafeRouteAnalysis = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [routes, setRoutes] = useState([]);
  const [bestRouteIndex, setBestRouteIndex] = useState(null);
  const [srcCoords, setSrcCoords] = useState(null);
  const [desCoords, setDesCoords] = useState(null);

  const colors = ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF"];
  const bestColor = "green";
  const defaultCenter = [34.0522, -118.2437]; // Los Angeles

  const geocodePlace = async (place) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`
    );
    const data = await response.json();
    if (data && data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
    throw new Error(`Could not geocode ${place}`);
  };

  const fetchRoutes = async () => {
    try {
      const src = await geocodePlace(source);
      const des = await geocodePlace(destination);
      setSrcCoords(src);
      setDesCoords(des);

      const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${src[1]},${src[0]};${des[1]},${des[0]}?overview=full&geometries=geojson&alternatives=true`
      );
      const data = await res.json();

      const allRoutes = data.routes.map((route) =>
        route.geometry.coordinates.map(([lng, lat]) => [lat, lng])
      );

      setRoutes(allRoutes);

      if (allRoutes.length > 0) {
        await analyzeRoutes(allRoutes);
      }
    } catch (err) {
      console.error("Error fetching routes or analyzing:", err);
      alert("Failed to get or analyze routes.");
    }
  };

  const analyzeRoutes = async (routes) => {
    const response = await fetch("http://localhost:8000/api/core/analyze-routes/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        routes: routes.map((path) =>
          path.map(([lat, lng]) => [lat, lng])
        ),
      }),
    });

    const result = await response.json();
    setBestRouteIndex(result.best_route_index);
    console.log("Route analysis result:", result);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Input Controls */}
      <div className="bg-white shadow-md p-4 flex flex-col md:flex-row gap-4 items-center justify-center z-10">
        <input
          type="text"
          placeholder="Enter Source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Enter Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={fetchRoutes}
          className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Analyze Safe Routes
        </button>
      </div>

      {/* Map Display */}
      <div className="flex-1 relative">
        <MapContainer
          center={defaultCenter}
          zoom={10}
          className="w-full h-full z-0"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {/* Dynamically center on source after fetch */}
          {srcCoords && <MapCenterer coords={srcCoords} />}

          {routes.map((route, idx) => (
            <Polyline
              // key={idx}
              key={`${idx}-${bestRouteIndex}`} // force rerender when bestRouteIndex updates

              positions={route}
              color={idx === bestRouteIndex ? bestColor : colors[idx % colors.length]}
              weight={idx === bestRouteIndex ? 6 : 3}
              opacity={0.8}
            >
              <Tooltip sticky>
                Route {idx + 1} {idx === bestRouteIndex && "✓ Best (Safest)"}
              </Tooltip>
            </Polyline>
          ))}

          {srcCoords && <Marker position={srcCoords} icon={customMarkerIcon} />}
          {desCoords && <Marker position={desCoords} icon={customMarkerIcon} />}
        </MapContainer>
      </div>
    </div>
  );
};

export default SafeRouteAnalysis;
