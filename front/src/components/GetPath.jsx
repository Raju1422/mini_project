import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";

const GetPath = ({ sourceCoordinates, destinationCoordinates }) => {
  useEffect(() => {
    const map = L.map("map").setView(
      [sourceCoordinates.lat, sourceCoordinates.lng],
      13
    );

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    // Add routing control to show the path
    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(sourceCoordinates.lat, sourceCoordinates.lng),
        L.latLng(destinationCoordinates.lat, destinationCoordinates.lng),
      ],
      routeWhileDragging: true,
    }).addTo(map);

    return () => {
      map.remove();
    };
  }, [sourceCoordinates, destinationCoordinates]);

  return <div id="map" style={{ width: "100%", height: "500px" }}></div>;
};

export default GetPath;
