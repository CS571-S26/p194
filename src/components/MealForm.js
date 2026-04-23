import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import Button from "./Button";
import Card from "./Card";
import { getLocalDateKey } from "../utils/fitness";

const emptyMeal = {
  name: "",
  calories: "",
  protein: "",
  carbs: "",
  fats: "",
  date: getLocalDateKey(),
};

export default function MealForm({
  onSaveMeal,
  editingMeal = null,
  onCancelEdit = null,
}) {
  const [meal, setMeal] = useState(emptyMeal);

  useEffect(() => {
    if (editingMeal) {
      setMeal({
        ...editingMeal,
        calories: String(editingMeal.calories ?? ""),
        protein: String(editingMeal.protein ?? ""),
        carbs: String(editingMeal.carbs ?? ""),
        fats: String(editingMeal.fats ?? ""),
      });
      return;
    }

    setMeal({ ...emptyMeal, date: getLocalDateKey() });
  }, [editingMeal]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!meal.name.trim()) {
      return;
    }

    onSaveMeal({
      ...meal,
      name: meal.name.trim(),
    });

    if (!editingMeal) {
      setMeal({ ...emptyMeal, date: getLocalDateKey() });
    }
  };

  return (
    <Card className="form-card">
      <div className="form-card__header">
        <span className="section-heading__eyebrow">Meal Form</span>
        <h2>{editingMeal ? "Edit meal" : "Add a meal"}</h2>
      </div>
      <div className="form-card__content">
        <Form onSubmit={handleSubmit}>
          <div className="form-grid">
            <Form.Group>
              <Form.Label>Meal Name</Form.Label>
              <Form.Control
                className="app-input"
                placeholder="Protein oats"
                value={meal.name}
                onChange={(event) =>
                  setMeal((currentMeal) => ({
                    ...currentMeal,
                    name: event.target.value,
                  }))
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Date</Form.Label>
              <Form.Control
                className="app-input"
                type="date"
                value={meal.date}
                onChange={(event) =>
                  setMeal((currentMeal) => ({
                    ...currentMeal,
                    date: event.target.value,
                  }))
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Calories</Form.Label>
              <Form.Control
                className="app-input"
                type="number"
                min="0"
                value={meal.calories}
                onChange={(event) =>
                  setMeal((currentMeal) => ({
                    ...currentMeal,
                    calories: event.target.value,
                  }))
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Protein</Form.Label>
              <Form.Control
                className="app-input"
                type="number"
                min="0"
                value={meal.protein}
                onChange={(event) =>
                  setMeal((currentMeal) => ({
                    ...currentMeal,
                    protein: event.target.value,
                  }))
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Carbs</Form.Label>
              <Form.Control
                className="app-input"
                type="number"
                min="0"
                value={meal.carbs}
                onChange={(event) =>
                  setMeal((currentMeal) => ({
                    ...currentMeal,
                    carbs: event.target.value,
                  }))
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Fats</Form.Label>
              <Form.Control
                className="app-input"
                type="number"
                min="0"
                value={meal.fats}
                onChange={(event) =>
                  setMeal((currentMeal) => ({
                    ...currentMeal,
                    fats: event.target.value,
                  }))
                }
              />
            </Form.Group>
          </div>
          <div className="form-actions">
            <Button type="submit" variant="primary" className="w-100">
              {editingMeal ? "Update Meal" : "Save Meal"}
            </Button>
            {editingMeal ? (
              <Button
                type="button"
                variant="secondary"
                className="w-100"
                onClick={onCancelEdit}
              >
                Cancel
              </Button>
            ) : null}
          </div>
        </Form>
      </div>
    </Card>
  );
}
