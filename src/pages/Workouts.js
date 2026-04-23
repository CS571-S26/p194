import { useMemo, useState } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import WorkoutForm from "../components/WorkoutForm";
import WorkoutList from "../components/WorkoutList";
import { useFitPilot } from "../context/FitPilotContext";
import { getWorkoutPlanMetrics } from "../utils/fitness";

export default function Workouts() {
  const navigate = useNavigate();
  const {
    activeWorkout,
    workoutPlans,
    workouts,
    exerciseLibrary,
    createWorkoutPlan,
    updateWorkoutPlan,
    deleteWorkoutPlan,
    startWorkout,
  } = useFitPilot();
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const completedSessionsByPlan = useMemo(
    () =>
      workouts.reduce((counts, workout) => {
        if (workout.status !== "completed" || !workout.planId) {
          return counts;
        }

        return {
          ...counts,
          [workout.planId]: (counts[workout.planId] || 0) + 1,
        };
      }, {}),
    [workouts]
  );

  const handleSubmit = (workout) => {
    if (editingWorkout) {
      updateWorkoutPlan(editingWorkout.id, workout);
    } else {
      createWorkoutPlan(workout);
    }

    setEditingWorkout(null);
    setShowForm(false);
  };

  const handleStart = (planId) => {
    if (activeWorkout) {
      navigate(`/workout/${activeWorkout.id}`);
      return;
    }

    const workout = startWorkout({ planId });
    navigate(`/workout/${workout.id}`);
  };

  const handleDelete = (planId) => {
    deleteWorkoutPlan(planId);
    if (editingWorkout?.id === planId) {
      setEditingWorkout(null);
      setShowForm(false);
    }
  };

  const getWorkoutStats = (workoutPlan) => {
    const metrics = getWorkoutPlanMetrics(workoutPlan);
    return {
      ...metrics,
      completedSessions: completedSessionsByPlan[workoutPlan.id] || 0,
    };
  };

  return (
    <main className="page-shell">
      <section className="page-section page-section--tight">
        <Container>
          <div className="section-heading">
            <span className="section-heading__eyebrow">Workout Selection</span>
            <h1>Choose the workout you want to run</h1>
            <p>
              Build reusable workouts, edit them any time, and start a session
              only when you are ready to train.
            </p>
          </div>

          <div className="top-toolbar">
            <div className="inline-actions">
              <Button
                type="button"
                variant="primary"
                onClick={() => {
                  setEditingWorkout(null);
                  setShowForm((currentValue) => !currentValue);
                }}
              >
                {showForm && !editingWorkout ? "Hide Form" : "Create Workout"}
              </Button>
              {activeWorkout ? (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate(`/workout/${activeWorkout.id}`)}
                >
                  Resume Active Session
                </Button>
              ) : null}
            </div>
            <span className="top-toolbar__note">
              {activeWorkout
                ? `An active session is running for ${activeWorkout.title}.`
                : "This screen stays focused on selecting and starting workouts."}
            </span>
          </div>

          {showForm || editingWorkout ? (
            <div className="mb-4">
              <WorkoutForm
                exerciseLibrary={exerciseLibrary}
                initialWorkout={editingWorkout}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setEditingWorkout(null);
                  setShowForm(false);
                }}
              />
            </div>
          ) : null}

          <WorkoutList
            workouts={workoutPlans}
            activeWorkout={activeWorkout}
            getWorkoutStats={getWorkoutStats}
            onStart={handleStart}
            onEdit={(workout) => {
              setEditingWorkout(workout);
              setShowForm(true);
            }}
            onDelete={handleDelete}
          />
        </Container>
      </section>
    </main>
  );
}
