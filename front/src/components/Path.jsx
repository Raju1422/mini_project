import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";

const RiskBasedRouting = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    try {
      // Initialize the map
      const map = L.map("map").setView([40.712776, -74.005974], 13);
      mapRef.current = map;

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      // Add routing control
      const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(40.712776, -74.005974), // Start
          L.latLng(40.73061, -73.935242), // End
        ],
        routeWhileDragging: true,
      })
        .on("routingerror", (e) => {
          console.error("Routing Error: ", e.error || e);
        })
        .on("routesfound", (e) => {
          console.log("Routes Found: ", e.routes);
        })
        .addTo(map);

      return () => {
        map.remove();
      };
    } catch (error) {
      console.error("Initialization Error: ", error);
    }
  }, []);

  return <div id="map" style={{ width: "100%", height: "500px" }}></div>;
};

export default RiskBasedRouting;
