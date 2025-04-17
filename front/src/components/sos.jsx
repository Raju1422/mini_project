import React, { useState, useRef } from "react";
import axios from "axios";
import "./App.css";

const SOS = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alarmPlaying, setAlarmPlaying] = useState(false);
  const [alarmTimeout, setAlarmTimeout] = useState(null);
  const [emailSent, setEmailSent] = useState(false);

  const alarmSound = useRef(new Audio("/emergency-alarm-69780.mp3"));

  const playAlarm = () => {
    console.log("hai");
    alarmSound.current.loop = true;
    alarmSound.current.play();
    setAlarmPlaying(true);

    const timeout = setTimeout(() => {
      alarmSound.current.pause();
      setAlarmPlaying(false);
      sendSOS();
    }, 10000);

    setAlarmTimeout(timeout);
  };

  const stopAlarm = () => {
    setAlarmPlaying(false);
    clearTimeout(alarmTimeout);
    alarmSound.current.pause();
    alarmSound.current.currentTime = 0;
  };

  const sendSOS = async () => {
    setLoading(true);
    setError(null);
    setEmailSent(false);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("No token found, please log in.");
        stopAlarm();
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
      console.log("mail called");
      if (response.status === 200) {
        alert("SOS email sent successfully!");
        setEmailSent(true);
        stopAlarm();
      }
    } catch (err) {
      console.error("Error sending SOS email:", err);
      setError("Failed to send SOS email.");
      stopAlarm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <button
        className="sos-button"
        onClick={playAlarm}
        disabled={loading || emailSent}
      >
        🚨
      </button>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {alarmPlaying && (
        <button className="cancel-alarm-button" onClick={stopAlarm}>
          ❌ Stop SOS
        </button>
      )}
    </div>
  );
};

export default SOS;
