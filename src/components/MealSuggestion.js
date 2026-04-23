import { Card, Button } from "react-bootstrap";
import { useState } from "react";

const meals = [
  "Grilled chicken with rice and vegetables.",
  "Greek yogurt with berries and nuts.",
  "Oats with whey protein and banana.",
];

export default function MealSuggestion() {
  const [meal, setMeal] = useState(meals[0]);

  const refreshMeal = () => {
    const random = meals[Math.floor(Math.random() * meals.length)];
    setMeal(random);
  };

  return (
    <Card className="shadow-lg rounded-4 p-3">
      <Card.Body>
        <Card.Title>Meal Suggestion</Card.Title>
        <Card.Text>{meal}</Card.Text>
        <Button onClick={refreshMeal}>Refresh</Button>
      </Card.Body>
    </Card>
  );
}