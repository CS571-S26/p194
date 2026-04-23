import Button from "./Button";
import Card from "./Card";

function WorkoutStats({ stats }) {
  const items = [
    { label: "Exercises", value: stats.totalExercises },
    { label: "Planned Sets", value: stats.totalSets },
    { label: "Sessions", value: stats.completedSessions },
  ].filter((item) => item.value || item.value === 0);

  return (
    <div className="workout-card__stats">
      {items.map((item) => (
        <span key={item.label} className="workout-card__stat">
          {item.label}: {item.value}
        </span>
      ))}
    </div>
  );
}

export default function WorkoutList({
  workouts,
  activeWorkout,
  getWorkoutStats,
  onStart,
  onEdit,
  onDelete,
}) {
  if (workouts.length === 0) {
    return (
      <Card className="empty-state">
        <h3>No workouts yet</h3>
        <p>Create a workout to start building your training library.</p>
      </Card>
    );
  }

  return (
    <div className="workout-card-grid">
      {workouts.map((workout) => {
        const stats = getWorkoutStats(workout);
        const isActive = activeWorkout?.planId === workout.id;

        return (
          <Card key={workout.id} className="workout-card">
            <div className="workout-card__body">
              <div className="workout-card__header">
                <div>
                  <span className="section-heading__eyebrow">Workout</span>
                  <h3>{workout.title}</h3>
                </div>
                {isActive ? <span className="status-badge status-badge--live">Active</span> : null}
              </div>

              {workout.notes ? <p>{workout.notes}</p> : <p>Ready to start whenever you are.</p>}
              <WorkoutStats stats={stats} />
            </div>

            <div className="workout-card__actions">
              <Button type="button" variant="primary" onClick={() => onStart(workout.id)}>
                {isActive ? "Resume" : "Start"}
              </Button>
              <Button type="button" variant="secondary" onClick={() => onEdit(workout)}>
                Edit
              </Button>
              <Button type="button" variant="secondary" onClick={() => onDelete(workout.id)}>
                Delete
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
