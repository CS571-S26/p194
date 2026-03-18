import { useState, useEffect } from "react";

export default function Meals() {
  const [meals, setMeals] = useState([]);
  const [meal, setMeal] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("meals")) || [];
    setMeals(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("meals", JSON.stringify(meals));
  }, [meals]);

  const addMeal = () => {
    if (!meal) return;
    setMeals([...meals, meal]);
    setMeal("");
  };

  const deleteMeal = (index) => {
    setMeals(meals.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h2>Meals</h2>

      <input
        placeholder="Meal Name"
        value={meal}
        onChange={(e) => setMeal(e.target.value)}
      />
      <button onClick={addMeal}>Add</button>

      <ul>
        {meals.map((m, i) => (
          <li key={i}>
            {m}
            <button onClick={() => deleteMeal(i)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}