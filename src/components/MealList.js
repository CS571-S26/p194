import Button from "./Button";
import Card from "./Card";
import { formatDateLabel } from "../utils/fitness";

export default function MealList({
  meals,
  onEditMeal,
  onDeleteMeal,
}) {
  if (meals.length === 0) {
    return (
      <Card className="empty-state">
        <h3>No meals added yet</h3>
        <p>Your nutrition log will appear here as soon as you add the first meal.</p>
      </Card>
    );
  }

  return (
    <div className="meal-list">
      {meals.map((meal) => (
        <Card key={meal.id} className="meal-item">
          <div className="meal-item__header">
            <div>
              <h3>{meal.name}</h3>
              <p className="meal-item__date">{formatDateLabel(meal.date)}</p>
            </div>
            <span>{meal.calories} kcal</span>
          </div>
          <div className="meal-item__stats">
            <span>P {meal.protein}g</span>
            <span>C {meal.carbs}g</span>
            <span>F {meal.fats}g</span>
          </div>
          <div className="inline-actions">
            <Button variant="secondary" type="button" onClick={() => onEditMeal(meal)}>
              Edit Meal
            </Button>
            <Button variant="secondary" type="button" onClick={() => onDeleteMeal(meal.id)}>
              Delete Meal
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
