import { useMemo, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Card from "../components/Card";
import Button from "../components/Button";
import { useFitPilot } from "../context/FitPilotContext";
import { formatDateLabel, getLocalDateKey, getMonthMatrix, getWorkoutMetrics } from "../utils/fitness";

export default function Calendar() {
  const { calendarIndex } = useFitPilot();
  const [referenceMonth, setReferenceMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(getLocalDateKey());

  const days = useMemo(() => getMonthMatrix(referenceMonth), [referenceMonth]);
  const selectedWorkouts = calendarIndex.workoutsByDate[selectedDate] || [];
  const selectedMeals = calendarIndex.mealsByDate[selectedDate] || [];

  return (
    <main className="page-shell">
      <section className="page-section page-section--tight">
        <Container>
          <div className="section-heading">
            <span className="section-heading__eyebrow">Training Calendar</span>
            <h1>See meals and workouts together</h1>
            <p>
              Select any day to inspect what you trained, what you ate, and how
              dense that day looked at a glance.
            </p>
          </div>

          <Row className="g-4 align-items-start">
            <Col xl={8}>
              <Card className="calendar-card">
                <div className="calendar-card__header">
                  <h2>
                    {referenceMonth.toLocaleDateString(undefined, {
                      month: "long",
                      year: "numeric",
                    })}
                  </h2>
                  <div className="inline-actions">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() =>
                        setReferenceMonth(
                          new Date(referenceMonth.getFullYear(), referenceMonth.getMonth() - 1, 1)
                        )
                      }
                    >
                      Previous
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() =>
                        setReferenceMonth(
                          new Date(referenceMonth.getFullYear(), referenceMonth.getMonth() + 1, 1)
                        )
                      }
                    >
                      Next
                    </Button>
                  </div>
                </div>

                <div className="calendar-grid calendar-grid--labels">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((label) => (
                    <div key={label} className="calendar-grid__label">
                      {label}
                    </div>
                  ))}
                </div>

                <div className="calendar-grid">
                  {days.map((day) => {
                    const workoutCount = (calendarIndex.workoutsByDate[day.key] || []).length;
                    const mealCount = (calendarIndex.mealsByDate[day.key] || []).length;

                    return (
                      <button
                        key={day.key}
                        type="button"
                        className={`calendar-day ${day.inMonth ? "" : "calendar-day--muted"} ${
                          selectedDate === day.key ? "calendar-day--selected" : ""
                        } ${day.isToday ? "calendar-day--today" : ""}`}
                        onClick={() => setSelectedDate(day.key)}
                      >
                        <strong>{day.dayOfMonth}</strong>
                        <span>{workoutCount} workouts</span>
                        <span>{mealCount} meals</span>
                      </button>
                    );
                  })}
                </div>
              </Card>
            </Col>

            <Col xl={4}>
              <div className="calendar-sidebar">
                <Card className="detail-card">
                  <span className="section-heading__eyebrow">Selected Day</span>
                  <h2>{formatDateLabel(selectedDate)}</h2>
                  <p>
                    {selectedWorkouts.length} workouts · {selectedMeals.length} meals
                  </p>
                </Card>

                <Card className="detail-card">
                  <h3>Workouts</h3>
                  {selectedWorkouts.length === 0 ? (
                    <p>No workouts logged for this day.</p>
                  ) : (
                    <div className="calendar-entry-list">
                      {selectedWorkouts.map((workout) => {
                        const metrics = getWorkoutMetrics(workout);
                        return (
                          <div key={workout.id} className="calendar-entry">
                            <strong>{workout.title}</strong>
                            <span>{workout.status}</span>
                            <p>
                              {metrics.totalExercises} exercises · {metrics.totalCompletedSets} completed
                              sets · {metrics.totalVolume} volume
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Card>

                <Card className="detail-card">
                  <h3>Meals</h3>
                  {selectedMeals.length === 0 ? (
                    <p>No meals logged for this day.</p>
                  ) : (
                    <div className="calendar-entry-list">
                      {selectedMeals.map((meal) => (
                        <div key={meal.id} className="calendar-entry">
                          <strong>{meal.name}</strong>
                          <span>{meal.calories} kcal</span>
                          <p>
                            P {meal.protein}g · C {meal.carbs}g · F {meal.fats}g
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
}
