import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Circle,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import * as turf from "@turf/turf";
const token = localStorage.getItem("accessToken");
// Custom marker icon
const customMarkerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const riskColorMapping = {
  Safe: "green",
  "Low Risk": "orange",
  "Moderate Risk": "yellow",
  "High Risk": "red",
};

const MovementMap = ({ src, des }) => {
  const [path, setPath] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(src);
  const [index, setIndex] = useState(0);
  const [loggedPoints, setLoggedPoints] = useState([]);
  const [distanceTraveled, setDistanceTraveled] = useState(0);
  const [riskLevels, setRiskLevels] = useState([]);
  const socketRef = useRef(null); // For persistent WebSocket connection
  const token = localStorage.getItem("accessToken");
  // Fetch the route from OSRM
  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${src[1]},${src[0]};${des[1]},${des[0]}?overview=full&geometries=geojson&alternatives=true`
        );
        const data = await response.json();
        const coordinates = data.routes[0].geometry.coordinates;
        const latLngs = coordinates.map(([lng, lat]) => [lat, lng]);
        setPath(latLngs);
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    };

    fetchRoute();
  }, [src, des]);

  // Establish WebSocket once
  useEffect(() => {
    socketRef.current = new WebSocket(`ws://127.0.0.1:8000/ws/predict-risk/?token=${token}`);

    socketRef.current.onopen = () => {
      console.log("WebSocket connection established");
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Risk level data:", data);
      if (Array.isArray(data)) {
        setRiskLevels((prev) => [...prev, ...data]);
      } else {
        console.error("Unexpected WebSocket data format:", data);
      }
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.close();
      }
    };
  }, []);

  // Simulate marker movement along the path
  useEffect(() => {
    if (path.length > 0 && index < path.length - 1) {
      const interval = setInterval(() => {
        const nextPosition = path[index];
        const prevPosition = currentPosition;

        const distance = turf.distance(
          turf.point([prevPosition[1], prevPosition[0]]),
          turf.point([nextPosition[1], nextPosition[0]]),
          { units: "kilometers" }
        );

        const updatedDistance = distanceTraveled + distance;
        setDistanceTraveled(updatedDistance);

        if (Math.floor(updatedDistance) > Math.floor(distanceTraveled)) {
          setLoggedPoints((prev) => [...prev, nextPosition]);
        }

        setCurrentPosition(nextPosition);
        setIndex((prevIndex) => prevIndex + 1);
      }, 100);

      return () => clearInterval(interval);
    }
  }, [path, index, currentPosition, distanceTraveled]);

  // Send data to WebSocket when new points are logged
  useEffect(() => {
    if (
      socketRef.current &&
      socketRef.current.readyState === WebSocket.OPEN &&
      loggedPoints.length > 0
    ) {
      const coordinatesArray = loggedPoints.map(([lat, lng]) => ({
        latitude: lat,
        longitude: lng,
      }));
      socketRef.current.send(JSON.stringify(coordinatesArray));
    }
  }, [loggedPoints]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <MapContainer center={src} zoom={10} style={{ flexGrow: 1 }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {path.length > 0 && <Polyline positions={path} color="blue" />}

        <Marker position={currentPosition} icon={customMarkerIcon} />

        <Circle
          center={currentPosition}
          radius={100}
          color="red"
          fillColor="red"
          fillOpacity={0.2}
        />

        {riskLevels.map((item, idx) => {
          if (!item.coordinates || !item.risk) {
            console.warn("Skipping invalid risk data:", item);
            return null;
          }
          const { coordinates, risk } = item;
          const color = riskColorMapping[risk] || "gray";
          return (
            <Circle
              key={idx}
              center={coordinates}
              radius={500}
              color={color}
              fillColor={color}
              fillOpacity={0.2}
            />
          );
        })}
      </MapContainer>

      <div
        style={{
          padding: "10px",
          backgroundColor: "#f8f8f8",
          overflowY: "auto",
        }}
      >
        <h3>Logged Points (Every Kilometer)</h3>
        <ul>
          {loggedPoints.map((point, idx) => (
            <li key={idx}>
              Latitude: {point[0].toFixed(6)}, Longitude: {point[1].toFixed(6)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MovementMap;


// import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
// import { useEffect, useRef, useState } from "react";

// const icon = new L.Icon({
//   iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

// export default function MovementMap({ src, des }) {
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
//           setCurrentPosition(allLatLngPaths[0][0]); // Start animation at first point of primary route
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
