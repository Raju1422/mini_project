import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Prime from "./pages/Prime.jsx";
import ReportForm from "./pages/ReportForm.jsx";
import TravelForm from "./pages/TravelForm.jsx";
import Analypath from "./pages/Analypath.jsx";
import Livetrack from "./pages/Livetrack.jsx";
import FeaturesPage from "./components/FeaturesPage.jsx";
import SafePlaces from "./components/SafePlaces.jsx";
import RiskAreas from "./components/RiskArea.jsx";
import ReviewPage from "./pages/ReviewPage.jsx";
import About from "./pages/About.jsx";
import SafeRouteAnalysis from "./components/SafeRouteAnalysis.jsx";
const Router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Prime />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/dashboard",
        element: localStorage.getItem("accessToken") ? <><Home /></> : <><Login /></>,
      },
      {
        path: "/report",
        element: <ReportForm />,
      },
      {
        path: "/start-travel",
        element: <Livetrack />,
      },
      {
        path: "live-track",
        element: <Livetrack />,
      },
      {
        path: "path-analysis",
        element: <Analypath />,
      },
      {
        path: "about",
        element: <About />,
      },

      {
        path: "/features",
        element: <FeaturesPage />,
      },
      {
        path: "/safe-places",
        element: <SafePlaces />,
      },
      {
        path: "/risk-areas",
        element: <RiskAreas />,
      },
      {
        path: "/feedback",
        element: <ReviewPage />,
      },
      {
        path: "/safe-route",
        element: <SafeRouteAnalysis />,
      },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={Router} />
  </React.StrictMode>
);
