import { Fragment, useEffect, useMemo, useState } from "react";
import { Container, Form, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import ExerciseCard from "../components/ExerciseCard";
import { useFitPilot } from "../context/FitPilotContext";
import {
  formatClock,
  getExerciseMetrics,
  getWorkoutMetrics,
  muscleGroups,
} from "../utils/fitness";

function PRPill({ label, hit }) {
  return (
    <span className={`pr-pill ${hit ? "pr-pill--hit" : ""}`}>
      {label}: {hit ? "Hit" : "No"}
    </span>
  );
}

function ExerciseEditor({
  workout,
  exercise,
  analytics,
  onUpdateExercise,
  onDeleteExercise,
  onAddSet,
  onDeleteSet,
  onUpdateSet,
}) {
  const metrics = getExerciseMetrics(exercise);
  const record = analytics?.find((item) => item.exerciseId === exercise.id);

  return (
    <Card className="session-exercise-card">
      <div className="session-exercise-card__header">
        <div className="session-exercise-card__fields">
          <Form.Control
            className="app-input"
            value={exercise.name}
            onChange={(event) =>
              onUpdateExercise(workout.id, exercise.id, { name: event.target.value })
            }
          />
          <Form.Select
            className="app-input"
            value={exercise.muscleGroup}
            onChange={(event) =>
              onUpdateExercise(workout.id, exercise.id, {
                muscleGroup: event.target.value,
              })
            }
          >
            {muscleGroups.map((group) => (
              <option key={group}>{group}</option>
            ))}
          </Form.Select>
        </div>
        <Button
          variant="secondary"
          type="button"
          onClick={() => onDeleteExercise(workout.id, exercise.id)}
        >
          Delete Exercise
        </Button>
      </div>

      <div className="session-exercise-card__meta">
        <span>{metrics.completedSets}/{exercise.sets.length} sets complete</span>
        <span>{metrics.totalVolume} volume</span>
        <span>{metrics.totalReps} reps</span>
        <span>{metrics.maxWeight} max weight</span>
      </div>

      <div className="pr-pill-row">
        <PRPill label="Volume PR" hit={Boolean(record?.volumePR)} />
        <PRPill label="Weight PR" hit={Boolean(record?.weightPR)} />
        <PRPill label="Rep PR" hit={Boolean(record?.repPR)} />
      </div>

      <div className="set-grid">
        <div className="set-grid__header">Set</div>
        <div className="set-grid__header">Reps</div>
        <div className="set-grid__header">Weight</div>
        <div className="set-grid__header">Done</div>
        <div className="set-grid__header">Action</div>
        {exercise.sets.map((set) => (
          <Fragment key={set.id}>
            <div className="set-grid__cell set-grid__cell--label">{set.order}</div>
            <Form.Control
              className="app-input set-grid__cell"
              type="number"
              min="0"
              value={set.reps}
              onChange={(event) =>
                onUpdateSet(workout.id, exercise.id, set.id, { reps: event.target.value })
              }
            />
            <Form.Control
              className="app-input set-grid__cell"
              type="number"
              min="0"
              step="0.5"
              value={set.weight}
              onChange={(event) =>
                onUpdateSet(workout.id, exercise.id, set.id, { weight: event.target.value })
              }
            />
            <button
              type="button"
              className={`completion-chip ${set.completed ? "completion-chip--done" : ""}`}
              onClick={() =>
                onUpdateSet(workout.id, exercise.id, set.id, {
                  completed: !set.completed,
                })
              }
            >
              {set.completed ? "Completed" : "Pending"}
            </button>
            <Button
              variant="secondary"
              type="button"
              className="set-grid__delete"
              onClick={() => onDeleteSet(workout.id, exercise.id, set.id)}
            >
              Delete
            </Button>
          </Fragment>
        ))}
      </div>

      <Form.Control
        as="textarea"
        rows={2}
        className="app-input app-textarea mt-3"
        placeholder="Exercise notes"
        value={exercise.notes || ""}
        onChange={(event) =>
          onUpdateExercise(workout.id, exercise.id, { notes: event.target.value })
        }
      />

      <div className="inline-actions mt-3">
        <Button variant="secondary" type="button" onClick={() => onAddSet(workout.id, exercise.id)}>
          Add Set
        </Button>
      </div>
    </Card>
  );
}

export default function WorkoutSession() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    activeWorkout,
    exerciseLibrary,
    getWorkoutById,
    getWorkoutInsights,
    updateWorkout,
    addExerciseToWorkout,
    updateExercise,
    deleteExercise,
    addSetToExercise,
    deleteSetFromExercise,
    updateSet,
    completeWorkout,
    deleteWorkout,
  } = useFitPilot();
  const workout = getWorkoutById(id);
  const insights = workout ? getWorkoutInsights(workout.id) : null;
  const [now, setNow] = useState(new Date());
  const [customExercise, setCustomExercise] = useState({
    name: "",
    muscleGroup: "Chest",
    defaultSets: 3,
    description: "",
  });

  useEffect(() => {
    if (!workout) {
      return;
    }

    if (workout.status === "completed") {
      navigate(`/workout/${workout.id}/analytics`, { replace: true });
    }
  }, [navigate, workout]);

  useEffect(() => {
    if (!workout || workout.status !== "active") {
      return undefined;
    }

    const interval = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, [workout]);

  const elapsedSeconds = useMemo(() => {
    if (!workout) {
      return 0;
    }

    return Math.floor((now - new Date(workout.startedAt)) / 1000);
  }, [now, workout]);

  const workoutMetrics = workout ? getWorkoutMetrics(workout) : null;

  const handleAddExercise = (exercise) => {
    if (!workout) {
      return;
    }

    addExerciseToWorkout(
      {
        ...exercise,
        defaultSets: exercise.defaultSets || exercise.sets || 3,
      },
      workout.id
    );
  };

  const handleCustomSubmit = (event) => {
    event.preventDefault();
    if (!customExercise.name.trim()) {
      return;
    }

    handleAddExercise({
      ...customExercise,
      name: customExercise.name.trim(),
      source: "custom",
    });
    setCustomExercise({
      name: "",
      muscleGroup: "Chest",
      defaultSets: 3,
      description: "",
    });
  };

  if (!workout) {
    return (
      <main className="page-shell">
        <section className="page-section page-section--tight">
          <Container>
            <Card className="empty-state">
              <h3>Workout not found</h3>
              <p>This session is no longer available.</p>
              <div className="inline-actions mt-3">
                <Button type="button" variant="primary" onClick={() => navigate("/workouts")}>
                  Back to Workouts
                </Button>
              </div>
            </Card>
          </Container>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="page-section page-section--tight">
        <Container>
          <div className="section-heading">
            <span className="section-heading__eyebrow">Workout Session</span>
            <h1>{workout.title}</h1>
            <p>
              Log your sets, adjust exercises while training, and finish the
              session to jump straight into analytics.
            </p>
          </div>

          {activeWorkout && activeWorkout.id !== workout.id ? (
            <Card className="detail-card mb-4">
              <h3>Another workout is active</h3>
              <p>{activeWorkout.title} is still running in this account.</p>
              <div className="inline-actions mt-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate(`/workout/${activeWorkout.id}`)}
                >
                  Open Active Workout
                </Button>
              </div>
            </Card>
          ) : null}

          <Row className="g-4 align-items-start">
            <Col xl={5}>
              <div className="library-stack">
                <Card className="form-card">
                  <div className="form-card__header">
                    <span className="section-heading__eyebrow">Custom Exercise</span>
                    <h2>Add a movement mid-session</h2>
                  </div>
                  <div className="form-card__content">
                    <Form onSubmit={handleCustomSubmit}>
                      <div className="form-grid">
                        <Form.Group>
                          <Form.Label>Exercise Name</Form.Label>
                          <Form.Control
                            className="app-input"
                            value={customExercise.name}
                            onChange={(event) =>
                              setCustomExercise((currentExercise) => ({
                                ...currentExercise,
                                name: event.target.value,
                              }))
                            }
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>Muscle Group</Form.Label>
                          <Form.Select
                            className="app-input"
                            value={customExercise.muscleGroup}
                            onChange={(event) =>
                              setCustomExercise((currentExercise) => ({
                                ...currentExercise,
                                muscleGroup: event.target.value,
                              }))
                            }
                          >
                            {muscleGroups.map((group) => (
                              <option key={group}>{group}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>Sets</Form.Label>
                          <Form.Control
                            className="app-input"
                            type="number"
                            min="1"
                            max="12"
                            value={customExercise.defaultSets}
                            onChange={(event) =>
                              setCustomExercise((currentExercise) => ({
                                ...currentExercise,
                                defaultSets: event.target.value,
                              }))
                            }
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>Description</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            className="app-input app-textarea"
                            value={customExercise.description}
                            onChange={(event) =>
                              setCustomExercise((currentExercise) => ({
                                ...currentExercise,
                                description: event.target.value,
                              }))
                            }
                          />
                        </Form.Group>
                      </div>
                      <Button type="submit" variant="primary" className="w-100 mt-3">
                        Add To Workout
                      </Button>
                    </Form>
                  </div>
                </Card>

                <div className="exercise-library-grid">
                  {exerciseLibrary.map((exercise) => (
                    <ExerciseCard
                      key={exercise.name}
                      name={exercise.name}
                      muscleGroup={exercise.muscleGroup}
                      description={exercise.description}
                      sets={exercise.defaultSets}
                      buttonLabel="Add To Workout"
                      onStart={() => handleAddExercise(exercise)}
                    />
                  ))}
                </div>
              </div>
            </Col>

            <Col xl={7}>
              <Card className="workout-session-card">
                <div className="workout-session-card__header">
                  <div>
                    <span className="section-heading__eyebrow">Live Session</span>
                    <div className="workout-session-card__heading">
                      <Form.Control
                        className="app-input workout-session-card__title"
                        value={workout.title}
                        onChange={(event) =>
                          updateWorkout(workout.id, {
                            title: event.target.value || "Workout Session",
                          })
                        }
                      />
                      <span className="status-badge status-badge--live">Live</span>
                    </div>
                  </div>
                  <div className="timer-card">
                    <span>Timer</span>
                    <strong>{formatClock(elapsedSeconds)}</strong>
                  </div>
                </div>

                <div className="session-summary-grid">
                  <label>
                    Date
                    <Form.Control
                      className="app-input"
                      type="date"
                      value={workout.date}
                      onChange={(event) =>
                        updateWorkout(workout.id, { date: event.target.value })
                      }
                    />
                  </label>
                  <div className="summary-box">
                    <span>Exercises</span>
                    <strong>{workoutMetrics.totalExercises}</strong>
                  </div>
                  <div className="summary-box">
                    <span>Completed Sets</span>
                    <strong>{workoutMetrics.totalCompletedSets}</strong>
                  </div>
                  <div className="summary-box">
                    <span>Total Volume</span>
                    <strong>{workoutMetrics.totalVolume}</strong>
                  </div>
                </div>

                <Form.Control
                  as="textarea"
                  rows={3}
                  className="app-input app-textarea"
                  placeholder="Workout notes"
                  value={workout.notes}
                  onChange={(event) => updateWorkout(workout.id, { notes: event.target.value })}
                />

                {insights ? (
                  <Card className="fatigue-card">
                    <div>
                      <span className="section-heading__eyebrow">Workout Fatigue</span>
                      <h3>
                        {insights.fatigue.label} strain · {insights.fatigue.score}/100
                      </h3>
                      <p>
                        Formula uses completed sets, reps, volume, and recent
                        training overlap from stored workout history.
                      </p>
                    </div>
                    <div className="fatigue-card__stats">
                      <span>{insights.fatigue.restDays} rest days in last 4</span>
                      <span>
                        {Math.round(insights.fatigue.recentMuscleHitRatio * 100)}% muscle overlap
                        in 48h
                      </span>
                    </div>
                  </Card>
                ) : null}

                <div className="exercise-editor-list">
                  {workout.exercises.length === 0 ? (
                    <Card className="empty-state">
                      <h3>No exercises yet</h3>
                      <p>Add an exercise from the library or custom form to begin logging sets.</p>
                    </Card>
                  ) : (
                    workout.exercises.map((exercise) => (
                      <ExerciseEditor
                        key={exercise.id}
                        workout={workout}
                        exercise={exercise}
                        analytics={insights?.exercisePRs}
                        onUpdateExercise={updateExercise}
                        onDeleteExercise={deleteExercise}
                        onAddSet={addSetToExercise}
                        onDeleteSet={deleteSetFromExercise}
                        onUpdateSet={updateSet}
                      />
                    ))
                  )}
                </div>

                <div className="inline-actions">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => {
                      completeWorkout(workout.id);
                      navigate(`/workout/${workout.id}/analytics`);
                    }}
                  >
                    Finish Workout
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      deleteWorkout(workout.id);
                      navigate("/workouts");
                    }}
                  >
                    Delete Session
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
}
