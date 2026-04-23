import { Card, Button } from "react-bootstrap";
import { useState } from "react";

const suggestions = [
  "Try 4 sets of squats for strength.",
  "Incorporate pull-ups for upper body development.",
  "Bench press today to focus on chest growth.",
];

export default function ExerciseSuggestion() {
  const [tip, setTip] = useState(suggestions[0]);

  const refreshTip = () => {
    const random = suggestions[Math.floor(Math.random() * suggestions.length)];
    setTip(random);
  };

  return (
    <Card className="shadow-lg rounded-4 p-3">
      <Card.Body>
        <Card.Title>Exercise Suggestion</Card.Title>
        <Card.Text>{tip}</Card.Text>
        <Button onClick={refreshTip}>Refresh</Button>
      </Card.Body>
    </Card>
  );
}