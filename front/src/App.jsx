import "./App.css";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import Allapi from "./common";
import SOS from "./components/sos";
import Indication from "./components/Indication";

function App() {
  const fetchuserdetails = async () => {
    try {
      const response = await fetch(Allapi.userdet.url, {
        method: Allapi.userdet.method,
        credentials: "include",
      });

      if (!response.ok) {
        // Handle non-2xx HTTP responses
        console.error("HTTP error", response.status, response.statusText);
        return;
      }

      const current_user = await response.json();
      console.log("current user is", current_user);

      if (current_user.success) {
        console.log(current_user);
      } else {
        console.error("Failed to fetch user details:", current_user.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
  useEffect(() => {
    fetchuserdetails();
  }, []);

  return (
    <>
      <ToastContainer />
      <main className="min-h-[calc(100vh-90px)] pt-16">
        <Outlet />
        <div className="">
          {/* <Indication /> */}
          <SOS />
        </div>
      </main>
      <ToastContainer />
    </>
  );
}

export default App;
