import { Fragment, useEffect, useMemo, useState } from "react";
import { Container, Form, Row, Col } from "react-bootstrap";
import Button from "../components/Button";
import Card from "../components/Card";
import ExerciseCard from "../components/ExerciseCard";
import { useFitPilot } from "../context/FitPilotContext";
import {
  formatClock,
  formatDateLabel,
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
        <Button variant="secondary" type="button" onClick={() => onDeleteExercise(workout.id, exercise.id)}>
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
            <div className="set-grid__cell set-grid__cell--label">
              {set.order}
            </div>
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

function WorkoutPanel({
  workout,
  active,
  insights,
  now,
  onUpdateWorkout,
  onCompleteWorkout,
  onDeleteWorkout,
  onUpdateExercise,
  onDeleteExercise,
  onAddSet,
  onDeleteSet,
  onUpdateSet,
}) {
  const workoutMetrics = getWorkoutMetrics(workout);
  const elapsedSeconds = Math.floor(
    ((workout.endedAt ? new Date(workout.endedAt) : now) - new Date(workout.startedAt)) / 1000
  );

  return (
    <Card className="workout-session-card">
      <div className="workout-session-card__header">
        <div>
          <span className="section-heading__eyebrow">
            {active ? "Active Workout" : "Workout History"}
          </span>
          <div className="workout-session-card__heading">
            <Form.Control
              className="app-input workout-session-card__title"
              value={workout.title}
              onChange={(event) =>
                onUpdateWorkout(workout.id, { title: event.target.value || "Workout Session" })
              }
            />
            <span className={`status-badge ${active ? "status-badge--live" : ""}`}>
              {active ? "Live" : "Completed"}
            </span>
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
            onChange={(event) => onUpdateWorkout(workout.id, { date: event.target.value })}
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
        onChange={(event) => onUpdateWorkout(workout.id, { notes: event.target.value })}
      />

      {insights ? (
        <Card className="fatigue-card">
          <div>
            <span className="section-heading__eyebrow">Workout Fatigue</span>
            <h3>
              {insights.fatigue.label} strain · {insights.fatigue.score}/100
            </h3>
            <p>
              Formula uses total volume, reps, completed sets, rest days across
              the last 4 days, and whether today&apos;s muscles were trained in the
              previous 48 hours.
            </p>
          </div>
          <div className="fatigue-card__stats">
            <span>{insights.fatigue.restDays} rest days in last 4</span>
            <span>
              {Math.round(insights.fatigue.recentMuscleHitRatio * 100)}% muscle overlap in 48h
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
              onUpdateExercise={onUpdateExercise}
              onDeleteExercise={onDeleteExercise}
              onAddSet={onAddSet}
              onDeleteSet={onDeleteSet}
              onUpdateSet={onUpdateSet}
            />
          ))
        )}
      </div>

      <div className="inline-actions">
        {active ? (
          <Button type="button" variant="primary" onClick={() => onCompleteWorkout(workout.id)}>
            Finish Workout
          </Button>
        ) : null}
        <Button type="button" variant="secondary" onClick={() => onDeleteWorkout(workout.id)}>
          Delete Workout
        </Button>
      </div>
    </Card>
  );
}

export default function Exercises() {
  const {
    activeWorkout,
    workouts,
    exerciseLibrary,
    startWorkout,
    updateWorkout,
    addExerciseToWorkout,
    updateExercise,
    deleteExercise,
    addSetToExercise,
    deleteSetFromExercise,
    updateSet,
    completeWorkout,
    deleteWorkout,
    getWorkoutInsights,
  } = useFitPilot();

  const [now, setNow] = useState(new Date());
  const [customExercise, setCustomExercise] = useState({
    name: "",
    muscleGroup: "Chest",
    defaultSets: 3,
    description: "",
  });

  useEffect(() => {
    if (!activeWorkout) {
      return undefined;
    }

    const interval = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, [activeWorkout]);

  const completedWorkouts = useMemo(
    () =>
      workouts
        .filter((workout) => workout.status === "completed")
        .sort((left, right) => new Date(right.startedAt) - new Date(left.startedAt)),
    [workouts]
  );

  const handleCreateWorkout = () => {
    startWorkout(`Workout ${formatDateLabel(new Date().toISOString().slice(0, 10))}`);
  };

  const handleAddExercise = (exercise) => {
    const workout = activeWorkout || startWorkout(`${exercise.muscleGroup} Session`);
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

  return (
    <main className="page-shell">
      <section className="page-section page-section--tight">
        <Container>
          <div className="section-heading">
            <span className="section-heading__eyebrow">Workout Tracker</span>
            <h1>Run live workouts with set-by-set control</h1>
            <p>
              Start a workout to launch the timer, log every set, update old
              sessions, and review PR flags plus fatigue after each session.
            </p>
          </div>

          <div className="top-toolbar">
            <Button
              type="button"
              variant="primary"
              onClick={handleCreateWorkout}
              disabled={Boolean(activeWorkout)}
            >
              {activeWorkout ? "Workout Already Running" : "Start New Workout"}
            </Button>
            {activeWorkout ? (
              <span className="top-toolbar__note">
                Active workout started on {formatDateLabel(activeWorkout.date)}.
              </span>
            ) : (
              <span className="top-toolbar__note">
                Start a workout first, then add library or custom exercises.
              </span>
            )}
          </div>

          <Row className="g-4 align-items-start">
            <Col xl={5}>
              <div className="library-stack">
                <Card className="form-card">
                  <div className="form-card__header">
                    <span className="section-heading__eyebrow">Custom Exercise</span>
                    <h2>Record your own movement</h2>
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
                        Add To Current Workout
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
              <div className="workout-sidebar">
                {activeWorkout ? (
                  <WorkoutPanel
                    workout={activeWorkout}
                    active
                    now={now}
                    insights={getWorkoutInsights(activeWorkout.id)}
                    onUpdateWorkout={updateWorkout}
                    onCompleteWorkout={completeWorkout}
                    onDeleteWorkout={deleteWorkout}
                    onUpdateExercise={updateExercise}
                    onDeleteExercise={deleteExercise}
                    onAddSet={addSetToExercise}
                    onDeleteSet={deleteSetFromExercise}
                    onUpdateSet={updateSet}
                  />
                ) : (
                  <Card className="empty-state">
                    <h3>No active workout</h3>
                    <p>
                      Start a new workout to begin the timer and log each set
                      directly inside the session editor.
                    </p>
                  </Card>
                )}

                <div className="history-stack">
                  <div className="section-heading section-heading--compact">
                    <span className="section-heading__eyebrow">Workout History</span>
                    <h2>Editable completed sessions</h2>
                  </div>
                  {completedWorkouts.length === 0 ? (
                    <Card className="empty-state">
                      <h3>No completed workouts yet</h3>
                      <p>Your finished workouts will appear here with PR and fatigue details.</p>
                    </Card>
                  ) : (
                    completedWorkouts.map((workout) => (
                      <WorkoutPanel
                        key={workout.id}
                        workout={workout}
                        active={false}
                        now={now}
                        insights={getWorkoutInsights(workout.id)}
                        onUpdateWorkout={updateWorkout}
                        onCompleteWorkout={completeWorkout}
                        onDeleteWorkout={deleteWorkout}
                        onUpdateExercise={updateExercise}
                        onDeleteExercise={deleteExercise}
                        onAddSet={addSetToExercise}
                        onDeleteSet={deleteSetFromExercise}
                        onUpdateSet={updateSet}
                      />
                    ))
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
}
