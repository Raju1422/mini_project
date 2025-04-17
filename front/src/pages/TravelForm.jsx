// import React, { useState, useEffect } from "react";
// import { FaMapMarkedAlt } from "react-icons/fa";
// import { motion } from "framer-motion";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   Rectangle,
// } from "react-leaflet";
// import GetPath from "../components/GetPath";

// const TravelForm = () => {
//   const [source, setSource] = useState("");
//   const [destination, setDestination] = useState("");
//   const [startJourney, setStartJourney] = useState(false);
//   const [userLocation, setUserLocation] = useState(null);
//   const [sourceCoordinates, setSourceCoordinates] = useState(null);
//   const [destinationCoordinates, setDestinationCoordinates] = useState(null);
//   const [route, setRoute] = useState(false);

//   useEffect(() => {
//     // Get current GPS location
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition((position) => {
//         setUserLocation({
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//         });
//       });
//     }
//   }, []);

//   const geocodeLocation = async (location) => {
//     try {
//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
//           location
//         )}`
//       );
//       const data = await response.json();

//       if (data && data.length > 0) {
//         const { lat, lon } = data[0];

//         return {
//           lat: lat,
//           lng: lon,
//         };
//       } else {
//         console.log("Location not found");
//         return null;
//       }
//     } catch (error) {
//       console.error("Error fetching location:", error);
//       return null;
//     }
//   };

//   function onRouteClose() {
//     setRoute(false); // Close the map
//     setStartJourney(false); // Disable map route
//   }

//   const handleJourneyStart = async () => {
//     // Fetch latitudes and longitudes for source and destination
//     const sourceCoordinates = await geocodeLocation(source);
//     const destinationCoordinates = await geocodeLocation(destination);

//     if (sourceCoordinates && destinationCoordinates) {
//       setSourceCoordinates(sourceCoordinates);
//       setDestinationCoordinates(destinationCoordinates);
//       setRoute(true); // Show the route map
//       setStartJourney(true); // Enable route visualization
//     } else {
//       console.log("Error getting coordinates for source or destination");
//     }

//     // Log the current location's coordinates
//     if (userLocation) {
//       console.log(
//         `Current Location - Latitude: ${userLocation.lat}, Longitude: ${userLocation.lng}`
//       );
//     }
//   };

//   // Function to calculate the bounds for the rectangle (map zoom level)
//   const getBounds = () => {
//     if (sourceCoordinates && destinationCoordinates) {
//       const latitudes = [sourceCoordinates.lat, destinationCoordinates.lat];
//       const longitudes = [sourceCoordinates.lng, destinationCoordinates.lng];
//       return [
//         [Math.min(...latitudes), Math.min(...longitudes)],
//         [Math.max(...latitudes), Math.max(...longitudes)],
//       ];
//     }
//     return [
//       [51.505, -0.09],
//       [51.505, -0.09],
//     ]; // Default bounds if coordinates are not available
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <header className="bg-white p-4 shadow-md">
//         <div className="text-xl font-bold text-pink-600">WomenTracker</div>
//       </header>

//       {/* Show the user's current location on the map */}
//       {userLocation && !route && (
//         <div className="container mx-auto mt-8 p-4 bg-white rounded-lg shadow-lg">
//           <h3 className="text-xl text-gray-800 mb-4">Your Current Location</h3>
//           <MapContainer
//             center={[userLocation.lat, userLocation.lng]}
//             zoom={13}
//             style={{ height: "300px", width: "100%" }}
//           >
//             <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//             <Marker position={[userLocation.lat, userLocation.lng]}>
//               <Popup>Your Current Location</Popup>
//             </Marker>
//           </MapContainer>
//         </div>
//       )}

//       {route && (
//         <div className="relative">
//           {/* Close Button */}
//           <div className="absolute top-4 right-4 z-10">
//             <button
//               onClick={onRouteClose}
//               className="text-white bg-red-500 rounded-full p-2"
//             >
//               X
//             </button>
//           </div>

//           {/* Map Container */}
//           <div className="container mx-auto mt-8 p-4 bg-white rounded-lg shadow-lg">
//             <h3 className="text-xl text-gray-800 mb-4">Map</h3>
//             <MapContainer
//               center={
//                 userLocation
//                   ? [userLocation.lat, userLocation.lng]
//                   : [51.505, -0.09]
//               }
//               zoom={13}
//               style={{ height: "400px", width: "100%" }}
//               bounds={getBounds()} // Set bounds for the map to show source and destination
//               scrollWheelZoom={false} // Disable scroll zoom for better user experience
//             >
//               <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//               {userLocation && (
//                 <Marker position={[userLocation.lat, userLocation.lng]}>
//                   <Popup>Your Location</Popup>
//                 </Marker>
//               )}
//               {startJourney && sourceCoordinates && destinationCoordinates && (
//                 <GetPath
//                   sourceCoordinates={sourceCoordinates}
//                   destinationCoordinates={destinationCoordinates}
//                 />
//               )}
//               {/* Rectangle to visualize the area between source and destination */}
//               {sourceCoordinates && destinationCoordinates && (
//                 <Rectangle bounds={getBounds()} color="blue" />
//               )}
//             </MapContainer>
//           </div>
//         </div>
//       )}

//       {/* Travel Form */}
//       {!route && (
//         <div className="container mx-auto mt-8 p-4 bg-white rounded-lg shadow-lg">
//           <h2 className="text-2xl text-gray-800 font-semibold mb-4">
//             Start Your Journey
//           </h2>
//           <form onSubmit={(e) => e.preventDefault()}>
//             <div className="flex space-x-4">
//               <div className="flex-1">
//                 <label htmlFor="source" className="block text-gray-700">
//                   Source
//                 </label>
//                 <input
//                   type="text"
//                   id="source"
//                   value={source}
//                   onChange={(e) => setSource(e.target.value)}
//                   className="w-full p-2 border border-gray-300 rounded-lg"
//                   placeholder="Enter Source"
//                 />
//               </div>
//               <div className="flex-1">
//                 <label htmlFor="destination" className="block text-gray-700">
//                   Destination
//                 </label>
//                 <input
//                   type="text"
//                   id="destination"
//                   value={destination}
//                   onChange={(e) => setDestination(e.target.value)}
//                   className="w-full p-2 border border-gray-300 rounded-lg"
//                   placeholder="Enter Destination"
//                 />
//               </div>
//             </div>
//             <div className="mt-4 text-center">
//               <button
//                 type="button"
//                 className="px-6 py-3 bg-pink-500 text-white rounded-lg"
//                 disabled={!source || !destination}
//                 onClick={handleJourneyStart}
//               >
//                 Find Path
//               </button>
//             </div>
//             <div className="mt-4 text-center">
//               <button
//                 type="button"
//                 className="px-6 py-3 bg-blue-500 text-white rounded-lg"
//                 onClick={handleJourneyStart}
//               >
//                 Start your Journey
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* Splash Screen Animation */}
//       {startJourney && (
//         <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-70 flex justify-center items-center">
//           <motion.div
//             initial={{ x: "-100vw" }}
//             animate={{ x: "100vw" }}
//             transition={{ duration: 3 }}
//             className="w-16 h-16 bg-pink-500 rounded-lg flex justify-center items-center text-white"
//           >
//             <FaMapMarkedAlt size={30} className="z-50" />
//           </motion.div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TravelForm;

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

// Import the functio

const TravelForm = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [startJourney, setStartJourney] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [sourceCoordinates, setSourceCoordinates] = useState(null);
  const [destinationCoordinates, setDestinationCoordinates] = useState(null);
  const [route, setRoute] = useState(false);
  const [riskLevels, setRiskLevels] = useState([]);
  useEffect(() => {
    // Get current GPS location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        setUserLocation({
          lat: userLat,
          lng: userLng,
        });
        console.log("loaction is", userLat, userLng);

        // Call generateEquidistantCoordinates with the user's location
        // Print the generated points to the console
      });
    }
  }, []);

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

        return {
          lat: lat,
          lng: lon,
        };
      } else {
        console.log("Location not found");
        return null;
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      return null;
    }
  };

  const generateEquidistantCoordinates = (
    latitude,
    longitude,
    radiusInKm,
    numberOfPoints
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
  function onRouteClose() {
    setRoute(false); // Close the map
    setStartJourney(false); // Disable map route
  }

  const handleJourneyStart = async () => {
    // Fetch latitudes and longitudes for source and destination
    const sourceCoordinates = await geocodeLocation(source);
    const destinationCoordinates = await geocodeLocation(destination);

    if (sourceCoordinates && destinationCoordinates) {
      setSourceCoordinates(sourceCoordinates);
      setDestinationCoordinates(destinationCoordinates);
      console.log("source cod", sourceCoordinates);
      console.log("destination cod", destinationCoordinates);
      setRoute(true); // Show the route map
      setStartJourney(true); // Enable route visualization
    } else {
      console.log("Error getting coordinates for source or destination");
    }

    // Log the current location's coordinates
    if (userLocation) {
      console.log(
        `Current Location - Latitude: ${userLocation.lat}, Longitude: ${userLocation.lng}`
      );
      const points = generateEquidistantCoordinates(
        userLocation.lat,
        userLocation.lng,
        0.5,
        8
      ); // 5 km radius, you can adjust as needed
      console.log("Equidistant Points:", points);
      points.push({ latitude: userLocation.lat, longitude: userLocation.lng });
      console.log("new points are", points);
      connectToWebSocket(points);
      console.log("risklevels", riskLevels);
    }
  };

  // Function to calculate the bounds for the rectangle (map zoom level)
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
      [51.505, -0.09],
      [51.505, -0.09],
    ]; // Default bounds if coordinates are not available
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white p-4 shadow-md">
        <div className="text-xl font-bold text-pink-600">SHE SECURE</div>
      </header>

      {/* Show the user's current location on the map */}
      {userLocation && !route && (
        <div className="container mx-auto mt-8 p-4 bg-white rounded-lg shadow-lg">
          <h3 className="text-xl text-gray-800 mb-4">Your Current Location</h3>
          <MapContainer
            center={[userLocation.lat, userLocation.lng]}
            zoom={13}
            style={{ height: "300px", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[userLocation.lat, userLocation.lng]}>
              <Popup>Your Current Location</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}

      {route && (
        <div className="relative">
          {/* Close Button */}
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={onRouteClose}
              className="text-white bg-red-500 rounded-full p-2"
            >
              X
            </button>
          </div>

          {/* Map Container */}
          <div className="container mx-auto mt-8 p-4 bg-white rounded-lg shadow-lg">
            <h3 className="text-xl text-gray-800 mb-4">Map</h3>
            <MapContainer
              center={
                userLocation
                  ? [userLocation.lat, userLocation.lng]
                  : [51.505, -0.09]
              }
              zoom={13}
              style={{ height: "400px", width: "100%" }}
              bounds={getBounds()} // Set bounds for the map to show source and destination
              scrollWheelZoom={false} // Disable scroll zoom for better user experience
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {userLocation && (
                <Marker position={[userLocation.lat, userLocation.lng]}>
                  <Popup>Your Location</Popup>
                </Marker>
              )}
              {startJourney && sourceCoordinates && destinationCoordinates && (
                <GetPath
                  sourceCoordinates={sourceCoordinates}
                  destinationCoordinates={destinationCoordinates}
                />
              )}
              {/* Rectangle to visualize the area between source and destination */}
              {sourceCoordinates && destinationCoordinates && (
                <Rectangle bounds={getBounds()} color="blue" />
              )}
            </MapContainer>
          </div>
        </div>
      )}

      {/* Travel Form */}
      {!route && (
        <div className="container mx-auto mt-8 p-4 bg-white rounded-lg shadow-lg">
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
            <div className="mt-4 text-center">
              <button
                type="button"
                className="px-6 py-3 bg-blue-500 text-white rounded-lg"
                onClick={handleJourneyStart}
              >
                Start your Journey
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Splash Screen Animation */}
      {startJourney && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-70 flex justify-center items-center">
          <motion.div
            initial={{ x: "-100vw" }}
            animate={{ x: "100vw" }}
            transition={{ duration: 3 }}
            className="w-16 h-16 bg-pink-500 rounded-lg flex justify-center items-center text-white"
          >
            <FaMapMarkedAlt size={30} className="z-50" />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TravelForm;
