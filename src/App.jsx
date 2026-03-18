import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Workouts from "./pages/Workouts";
import Meals from "./pages/Meals";

export default function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Fitness Tracker</h1>

      <nav style={{ marginBottom: "20px" }}>
        <Link to="/" style={{ marginRight: "10px" }}>Home</Link>
        <Link to="/workouts" style={{ marginRight: "10px" }}>Workouts</Link>
        <Link to="/meals">Meals</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="/meals" element={<Meals />} />
      </Routes>
    </div>
  );
}