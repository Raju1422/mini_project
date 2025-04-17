import React, { useState, useEffect } from "react";
import { FaMapMarkedAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { useMap } from "react-leaflet";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Circle,
} from "react-leaflet";
import GetPath from "../components/GetPath";

const Livetrack = () => {
  const [userPath, setUserPath] = useState([]);

  const [userLocation, setUserLocation] = useState(null);
  const [sourceCoordinates, setSourceCoordinates] = useState([]);
  const [riskLevels, setRiskLevels] = useState([]);
  const [startJourney, setStartJourney] = useState(false);

  const riskColorMapping = {
    Safe: "green",
    "Low Risk": "orange",
    "Moderate Risk": "yellow",
    "High Risk": "red",
  };
  const MapUpdater = () => {
    const map = useMap(); // Access the map instance
    useEffect(() => {
      if (userLocation) {
        map.setView([userLocation.lat, userLocation.lng], 13); // Update map center when userLocation changes
      }
    }, [userLocation, map]);

    return null; // This component doesn't render anything
  };
  const predefinedCoordinates = [
    { latitude: 34.120127, longitude: -118.338835 },
    { latitude: 34.119758, longitude: -118.338693 },
    { latitude: 34.119455, longitude: -118.338543 },
    { latitude: 34.119227, longitude: -118.338428 },
    { latitude: 34.119004, longitude: -118.33832 },
    { latitude: 34.118755, longitude: -118.338206 },
    { latitude: 34.11851, longitude: -118.338103 },
    { latitude: 34.118307, longitude: -118.33802 },
    { latitude: 34.118192, longitude: -118.337975 },
    { latitude: 34.118081, longitude: -118.337934 },
    { latitude: 34.117993, longitude: -118.337911 },
    { latitude: 34.117905, longitude: -118.337897 },
    { latitude: 34.117869, longitude: -118.337894 },
    { latitude: 34.117747, longitude: -118.337885 },
    { latitude: 34.117629, longitude: -118.337879 },
    { latitude: 34.117497, longitude: -118.337888 },
    { latitude: 34.117399, longitude: -118.337905 },
    { latitude: 34.117056, longitude: -118.337959 },
    { latitude: 34.116952, longitude: -118.33797 },
    { latitude: 34.116854, longitude: -118.337975 },
    { latitude: 34.116776, longitude: -118.337976 },
    { latitude: 34.116584, longitude: -118.337946 },
    { latitude: 34.116467, longitude: -118.337922 },
    { latitude: 34.116354, longitude: -118.337887 },
    { latitude: 34.116249, longitude: -118.337842 },
    { latitude: 34.116154, longitude: -118.337783 },
    { latitude: 34.115975, longitude: -118.337667 },
    { latitude: 34.115896, longitude: -118.337616 },
    { latitude: 34.115809, longitude: -118.337563 },
    { latitude: 34.115722, longitude: -118.337515 },
    { latitude: 34.115574, longitude: -118.33745 },
    { latitude: 34.115254, longitude: -118.337361 },
    { latitude: 34.114709, longitude: -118.337148 },
    { latitude: 34.114399, longitude: -118.337079 },
    { latitude: 34.11426, longitude: -118.337032 },
    { latitude: 34.114124, longitude: -118.336978 },
    { latitude: 34.11366, longitude: -118.336783 },
    { latitude: 34.112888, longitude: -118.336459 },
    { latitude: 34.112485, longitude: -118.336302 },
    { latitude: 34.112328, longitude: -118.336241 },
    { latitude: 34.112212, longitude: -118.336204 },
    { latitude: 34.112145, longitude: -118.336191 },
    { latitude: 34.112105, longitude: -118.336183 },
    { latitude: 34.111994, longitude: -118.336171 },
    { latitude: 34.111981, longitude: -118.336169 },
    { latitude: 34.111861, longitude: -118.33617 },
    { latitude: 34.11173, longitude: -118.336182 },
    { latitude: 34.111653, longitude: -118.336191 },
    { latitude: 34.111587, longitude: -118.336199 },
    { latitude: 34.111401, longitude: -118.336235 },
    { latitude: 34.111192, longitude: -118.336278 },
    { latitude: 34.111123, longitude: -118.33629 },
    { latitude: 34.110994, longitude: -118.33631 },
    { latitude: 34.110305, longitude: -118.336403 },
    { latitude: 34.10987, longitude: -118.336461 },
    { latitude: 34.109665, longitude: -118.336488 },
    { latitude: 34.109467, longitude: -118.336515 },
    { latitude: 34.109444, longitude: -118.336518 },
    { latitude: 34.10936, longitude: -118.336533 },
    { latitude: 34.10925, longitude: -118.33656 },
    { latitude: 34.109143, longitude: -118.336596 },
    { latitude: 34.109021, longitude: -118.336649 },
    { latitude: 34.108897, longitude: -118.336715 },
    { latitude: 34.108811, longitude: -118.336769 },
    { latitude: 34.108727, longitude: -118.336761 },
    { latitude: 34.108628, longitude: -118.336827 },
    { latitude: 34.108282, longitude: -118.337057 },
    { latitude: 34.108191, longitude: -118.337113 },
    { latitude: 34.108116, longitude: -118.33716 },
    { latitude: 34.108003, longitude: -118.337223 },
    { latitude: 34.107886, longitude: -118.337283 },
    { latitude: 34.107755, longitude: -118.337339 },
    { latitude: 34.107629, longitude: -118.337391 },
    { latitude: 34.107591, longitude: -118.337403 },
    { latitude: 34.10753, longitude: -118.337423 },
    { latitude: 34.107504, longitude: -118.337432 },
    { latitude: 34.107376, longitude: -118.337466 },
    { latitude: 34.107244, longitude: -118.337489 },
    { latitude: 34.107143, longitude: -118.337498 },
    { latitude: 34.10711, longitude: -118.337501 },
    { latitude: 34.106977, longitude: -118.337504 },
    { latitude: 34.106258, longitude: -118.337492 },
    { latitude: 34.106121, longitude: -118.33749 },
    { latitude: 34.106035, longitude: -118.337488 },
    { latitude: 34.105983, longitude: -118.337487 },
    { latitude: 34.105831, longitude: -118.337485 },
    { latitude: 34.105473, longitude: -118.337484 },
    { latitude: 34.105281, longitude: -118.33748 },
    { latitude: 34.105191, longitude: -118.33748 },
    { latitude: 34.105116, longitude: -118.337481 },
    { latitude: 34.104997, longitude: -118.337488 },
    { latitude: 34.104889, longitude: -118.337511 },
    { latitude: 34.104785, longitude: -118.337548 },
    { latitude: 34.104645, longitude: -118.337623 },
    { latitude: 34.104521, longitude: -118.337719 },
    { latitude: 34.104455, longitude: -118.337785 },
    { latitude: 34.104427, longitude: -118.337813 },
    { latitude: 34.104388, longitude: -118.337868 },
    { latitude: 34.104344, longitude: -118.337931 },
    { latitude: 34.104296, longitude: -118.33803 },
    { latitude: 34.10426, longitude: -118.338115 },
    { latitude: 34.10422, longitude: -118.338205 },
    { latitude: 34.104169, longitude: -118.338296 },
    { latitude: 34.104113, longitude: -118.33838 },
    { latitude: 34.104003, longitude: -118.33853 },
    { latitude: 34.103932, longitude: -118.338577 },
    { latitude: 34.103832, longitude: -118.338641 },
    { latitude: 34.103711, longitude: -118.338685 },
    { latitude: 34.103628, longitude: -118.338704 },
    { latitude: 34.103545, longitude: -118.338716 },
    { latitude: 34.103503, longitude: -118.338723 },
    { latitude: 34.103378, longitude: -118.338736 },
    { latitude: 34.10317, longitude: -118.338741 },
    { latitude: 34.103107, longitude: -118.338741 },
    { latitude: 34.103021, longitude: -118.338741 },
    { latitude: 34.102932, longitude: -118.338726 },
    { latitude: 34.102879, longitude: -118.338726 },
    { latitude: 34.102847, longitude: -118.338725 },
    { latitude: 34.102319, longitude: -118.338722 },
    { latitude: 34.102271, longitude: -118.338722 },
    { latitude: 34.102236, longitude: -118.338722 },
    { latitude: 34.102152, longitude: -118.338721 },
    { latitude: 34.101942, longitude: -118.33872 },
    { latitude: 34.101668, longitude: -118.338719 },
    { latitude: 34.101556, longitude: -118.338718 },
    { latitude: 34.101545, longitude: -118.338718 },
    { latitude: 34.101434, longitude: -118.338717 },
    { latitude: 34.101038, longitude: -118.338715 },
    { latitude: 34.101006, longitude: -118.338715 },
    { latitude: 34.100896, longitude: -118.338714 },
    { latitude: 34.100734, longitude: -118.338713 },
    { latitude: 34.10054, longitude: -118.338712 },
    { latitude: 34.100349, longitude: -118.338711 },
    { latitude: 34.099715, longitude: -118.338707 },
    { latitude: 34.099614, longitude: -118.338705 },
    { latitude: 34.099261, longitude: -118.3387 },
    { latitude: 34.099101, longitude: -118.338698 },
    { latitude: 34.098852, longitude: -118.338695 },
    { latitude: 34.098543, longitude: -118.338691 },
    { latitude: 34.098471, longitude: -118.338691 },
    { latitude: 34.098262, longitude: -118.338688 },
    { latitude: 34.098105, longitude: -118.338685 },
    { latitude: 34.097978, longitude: -118.338684 },
    { latitude: 34.097854, longitude: -118.338682 },
    { latitude: 34.097376, longitude: -118.338676 },
    { latitude: 34.097321, longitude: -118.338734 },
    { latitude: 34.097041, longitude: -118.338732 },
    { latitude: 34.096956, longitude: -118.338671 },
    { latitude: 34.096887, longitude: -118.33867 },
    { latitude: 34.096693, longitude: -118.338668 },
    { latitude: 34.096534, longitude: -118.338666 },
    { latitude: 34.09616, longitude: -118.338661 },
    { latitude: 34.095842, longitude: -118.338657 },
    { latitude: 34.095587, longitude: -118.338661 },
    { latitude: 34.095537, longitude: -118.338719 },
    { latitude: 34.095025, longitude: -118.338706 },
    { latitude: 34.094953, longitude: -118.338645 },
    { latitude: 34.094654, longitude: -118.338642 },
    { latitude: 34.094374, longitude: -118.338638 },
    { latitude: 34.093957, longitude: -118.338633 },
    { latitude: 34.093845, longitude: -118.338634 },
    { latitude: 34.09377, longitude: -118.338715 }
  ]

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setUserPath(prev => [...prev, [latitude, longitude]]);

          console.log("Initial Location:", latitude, longitude);
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    }
  }, []);

  const generateEquidistantCoordinates = (
    latitude,
    longitude,
    radiusInKm,
    numberOfPoints
  ) => {
    const points = [];
    const earthRadius = 6371; // Earth radius in kilometers
    const angleIncrement = (2 * Math.PI) / numberOfPoints;

    for (let i = 0; i < numberOfPoints; i++) {
      const angle = angleIncrement * i;
      const deltaLat =
        (radiusInKm / earthRadius) * (180 / Math.PI) * Math.sin(angle);
      const deltaLon =
        ((radiusInKm / earthRadius) * (180 / Math.PI) * Math.cos(angle)) /
        Math.cos((latitude * Math.PI) / 180);

      points.push({
        latitude: latitude + deltaLat,
        longitude: longitude + deltaLon,
      });
    }

    return points;
  };

  // const connectToWebSocket = (points) => {
  //   const ws = new WebSocket("ws://localhost:8000/ws/predict-risk/");
  //   ws.onopen = () => {
  //     console.log("WebSocket Connected");
  //     ws.send(JSON.stringify(points));
  //   };
  //   ws.onmessage = (event) => {
  //     const data = JSON.parse(event.data);
  //     setRiskLevels(data);
  //     console.log("Risk Levels:", data);
  //   };
  //   ws.onerror = (error) => console.error("WebSocket Error:", error);
  //   ws.onclose = () => console.log("WebSocket Closed");
  // };

  // const handleJourneyStart = () => {
  //   if (!navigator.geolocation) {
  //     alert("Geolocation is not supported by your browser.");
  //     return;
  //   }
  //   const getRandomCoordinates = () => {
  //     const randomIndex = Math.floor(
  //       Math.random() * predefinedCoordinates.length
  //     );
  //     return predefinedCoordinates[randomIndex];
  //   };

  //   const updateCoordinates = () => {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         // const { latitude, longitude } = position.coords;

  //         // const { latitude, longitude } = predefinedCoordinates[0];
  //         const { latitude, longitude } = getRandomCoordinates();
  //         setUserLocation({ lat: latitude, lng: longitude });
  //         console.log("Current Location:", latitude, longitude);
  //         // const { latitude, longitude }=predefinedCoordinates[0];
  //         const neighborPoints = generateEquidistantCoordinates(
  //           latitude,
  //           longitude,
  //           0.5,
  //           8
  //         );
  //         const allPoints = [{ latitude, longitude }, ...neighborPoints];
  //         setSourceCoordinates(allPoints);
  //         connectToWebSocket(allPoints);
  //       },
  //       (error) => console.error("Error updating location:", error)
  //     );
  //   };

  //   setStartJourney(true);
  //   updateCoordinates();
  //   const intervalId = setInterval(updateCoordinates, 1000);

  //   return () => clearInterval(intervalId);
  // };
  let ws = null; // global-like scope within the component

  const connectToWebSocket = (points) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      // just send data if already connected
      ws.send(JSON.stringify(points));
      return;
    }

    // Establish connection only if not connected
    ws = new WebSocket("ws://localhost:8000/ws/predict-risk/");

    ws.onopen = () => {
      console.log("WebSocket Connected");
      ws.send(JSON.stringify(points));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setRiskLevels(data);
      console.log("Risk Levels:", data);
      if (data[0].risk == "High Risk") {
        sendSOS()

      }
    };

    ws.onerror = (error) => console.error("WebSocket Error:", error);

    ws.onclose = () => console.log("WebSocket Closed");
  };

  let journeyIntervalId = null; // store interval ID globally
  const sendSOS = async () => {



    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("No token found, please log in.");
        return;
      }

      const recipients = [
        "lakshman652004@gmail.com",
        "aravindudiyana123@gmail.com",
      ];

      const response = await axios.post(
        "http://localhost:8000/api/user/send-email/",
        { recipients },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("mail called in live track");
      if (response.status === 200) {
        alert("SOS email sent successfully!");
      }
    } catch (err) {
      console.error("Error sending SOS email:", err);
    }
  };


  const handleJourneyStart = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    let index = 0;
    const getRandomCoordinates = () => {
      // const randomIndex = Math.floor(
      //   Math.random() * predefinedCoordinates.length
      // );
      return predefinedCoordinates[index++];
    };

    const updateCoordinates = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = getRandomCoordinates();
          // const { latitude, longitude } = position.coords // or use real coords
          setUserLocation({ lat: latitude, lng: longitude });
          setUserPath(prev => [...prev, [latitude, longitude]]);
          console.log("Current Location:", latitude, longitude);

          const neighborPoints = generateEquidistantCoordinates(
            latitude,
            longitude,
            0.5,
            8
          );
          const allPoints = [{ latitude, longitude }, ...neighborPoints];
          setSourceCoordinates(allPoints);
          connectToWebSocket(allPoints);
        },
        (error) => console.error("Error updating location:", error)
      );
    };

    setStartJourney(true);
    updateCoordinates(); // immediately send first data
    journeyIntervalId = setInterval(updateCoordinates, 1000); // then every second
  };

  const handleJourneyStop = () => {
    setStartJourney(false);
    if (journeyIntervalId) {
      clearInterval(journeyIntervalId);
      journeyIntervalId = null;
    }
    if (ws) {
      ws.close();
      ws = null;
    }
  };

  const getBounds = () => {
    if (!sourceCoordinates.length) return null;
    const latitudes = sourceCoordinates.map((p) => p.latitude);
    const longitudes = sourceCoordinates.map((p) => p.longitude);

    return [
      [Math.min(...latitudes), Math.min(...longitudes)],
      [Math.max(...latitudes), Math.max(...longitudes)],
    ];
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white p-4 shadow-md">
        <div className="text-xl font-bold text-pink-600">TRACK N SECURE</div>
      </header>

      {userLocation && (
        <div className="container mx-auto mt-8 p-4 bg-white rounded-lg shadow-lg">
          <h3 className="text-xl text-gray-800 mb-4">Your Current Location</h3>
          <MapContainer
            center={[userLocation.lat, userLocation.lng]}
            zoom={13}
            style={{ height: "300px", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[userLocation.lat, userLocation.lng]}>
              {/* <Popup>Your Current Location</Popup> */}
            </Marker>
            {/* {riskLevels.map((item, idx) => {
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
            })} */}
            {riskLevels.map((item, idx) => {
              if (!item.coordinates || !item.risk) {
                console.warn("Skipping invalid risk data:", item);
                return null;
              }
              const { coordinates, risk } = item;
              const color = riskColorMapping[risk] || "gray";

              const latLng =
                coordinates.latitude && coordinates.longitude
                  ? [coordinates.latitude, coordinates.longitude]
                  : coordinates; // fallback in case backend sends [lat, lng] directly

              return (
                <Circle
                  key={idx}
                  center={latLng}
                  radius={500}
                  pathOptions={{
                    color,
                    fillColor: color,
                    fillOpacity: 0.2,
                  }}
                />
              );
            })}

            <Polyline positions={userPath} color="gray" />
            <MapUpdater />
          </MapContainer>
        </div>
      )}

      <div className="container mx-auto mt-8 p-4 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl text-gray-800 font-semibold mb-4">
          Start Your Journey
        </h2>
        <button
          type="button"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg"
          onClick={handleJourneyStart}
        >
          Start Journey
        </button>
      </div>
    </div>
  );
};

export default Livetrack;
