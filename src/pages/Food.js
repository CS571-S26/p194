import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import MealForm from "../components/MealForm";
import MealList from "../components/MealList";

export default function Food() {
  const [meals, setMeals] = useState([]);

  const addMeal = (meal) => {
    setMeals([meal, ...meals]);
  };

  return (
    <Container className="mt-5">
      <h2 className="text-white mb-4">Nutrition Tracker</h2>
      <Row>
        <Col md={4}>
          <MealForm onAddMeal={addMeal} />
        </Col>
        <Col md={8}>
          <MealList meals={meals} />
        </Col>
      </Row>
    </Container>
  );
}