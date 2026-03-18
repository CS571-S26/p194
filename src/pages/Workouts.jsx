import { useState, useEffect } from "react";

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [exercise, setExercise] = useState("");
  const [duration, setDuration] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("workouts")) || [];
    setWorkouts(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("workouts", JSON.stringify(workouts));
  }, [workouts]);

  const addWorkout = () => {
    if (!exercise || !duration) return;
    setWorkouts([...workouts, { exercise, duration }]);
    setExercise("");
    setDuration("");
  };

  const deleteWorkout = (index) => {
    setWorkouts(workouts.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h2>Workouts</h2>

      <input
        placeholder="Exercise"
        value={exercise}
        onChange={(e) => setExercise(e.target.value)}
      />
      <input
        placeholder="Duration (mins)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />
      <button onClick={addWorkout}>Add</button>

      <ul>
        {workouts.map((w, i) => (
          <li key={i}>
            {w.exercise} - {w.duration} mins
            <button onClick={() => deleteWorkout(i)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}