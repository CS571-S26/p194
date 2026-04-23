import { useMemo, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import MealForm from "../components/MealForm";
import MealList from "../components/MealList";
import Card from "../components/Card";
import { useFitPilot } from "../context/FitPilotContext";

export default function Nutrition() {
  const { meals, addMeal, updateMeal, deleteMeal } = useFitPilot();
  const [editingMeal, setEditingMeal] = useState(null);

  const totals = useMemo(
    () =>
      meals.reduce(
        (accumulator, meal) => ({
          calories: accumulator.calories + Number(meal.calories || 0),
          protein: accumulator.protein + Number(meal.protein || 0),
          carbs: accumulator.carbs + Number(meal.carbs || 0),
          fats: accumulator.fats + Number(meal.fats || 0),
        }),
        { calories: 0, protein: 0, carbs: 0, fats: 0 }
      ),
    [meals]
  );

  const handleSaveMeal = (meal) => {
    if (editingMeal) {
      updateMeal(editingMeal.id, meal);
      setEditingMeal(null);
      return;
    }

    addMeal(meal);
  };

  return (
    <main className="page-shell">
      <section className="page-section page-section--tight">
        <Container>
          <div className="section-heading">
            <span className="section-heading__eyebrow">Nutrition Dashboard</span>
            <h1>Track meals on the same timeline as training</h1>
            <p>
              Every meal stays editable, deletable, and attached to a specific
              date so the calendar can show your full training day.
            </p>
          </div>
          <Row className="g-4 align-items-start">
            <Col lg={5}>
              <MealForm
                onSaveMeal={handleSaveMeal}
                editingMeal={editingMeal}
                onCancelEdit={() => setEditingMeal(null)}
              />
            </Col>
            <Col lg={7}>
              <Card className="nutrition-summary">
                <div>
                  <span className="nutrition-summary__label">Calories</span>
                  <strong>{totals.calories}</strong>
                </div>
                <div>
                  <span className="nutrition-summary__label">Protein</span>
                  <strong>{totals.protein}g</strong>
                </div>
                <div>
                  <span className="nutrition-summary__label">Carbs</span>
                  <strong>{totals.carbs}g</strong>
                </div>
                <div>
                  <span className="nutrition-summary__label">Fats</span>
                  <strong>{totals.fats}g</strong>
                </div>
              </Card>
              <MealList
                meals={meals}
                onEditMeal={setEditingMeal}
                onDeleteMeal={deleteMeal}
              />
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
}
