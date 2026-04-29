import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { FitPilotProvider } from "./context/FitPilotContext";
import NavigationBar from "./components/NavigationBar";
import Home from "./pages/Home";
import Nutrition from "./pages/Nutrition";
import Calendar from "./pages/Calendar";
import Workouts from "./pages/Workouts";
import WorkoutSession from "./pages/WorkoutSession";
import WorkoutAnalytics from "./pages/WorkoutAnalytics";
import "./styles.css";

function App() {
  const basename = process.env.PUBLIC_URL
    ? new URL(process.env.PUBLIC_URL, window.location.origin).pathname
    : "/";

  return (
    <FitPilotProvider>
      <Router basename={basename}>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/workout/:id" element={<WorkoutSession />} />
          <Route path="/workout/:id/analytics" element={<WorkoutAnalytics />} />
          <Route path="/nutrition" element={<Nutrition />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </FitPilotProvider>
  );
}

export default App;

// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import NavigationBar from "./components/NavigationBar";
// import Home from "./pages/Home";
// import Workouts from "./pages/Workouts";
// import Nutrition from "./pages/Nutrition";
// import "./styles.css";

// function App() {
//   return (
//     <Router>
//       <NavigationBar />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/workouts" element={<Workouts />} />
//         <Route path="/nutrition" element={<Nutrition />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
