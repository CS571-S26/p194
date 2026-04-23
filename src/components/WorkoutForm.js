import { useEffect, useMemo, useState } from "react";
import { Form } from "react-bootstrap";
import Button from "./Button";
import Card from "./Card";
import { createId, muscleGroups } from "../utils/fitness";

function createDraftExercise(exercise = {}) {
  return {
    id: exercise.id || createId("draft-exercise"),
    name: exercise.name || "",
    muscleGroup: exercise.muscleGroup || "Chest",
    defaultSets: Number(exercise.defaultSets || 3),
    description: exercise.description || "",
  };
}

export default function WorkoutForm({
  exerciseLibrary,
  initialWorkout,
  onSubmit,
  onCancel,
}) {
  const [title, setTitle] = useState(initialWorkout?.title || "");
  const [notes, setNotes] = useState(initialWorkout?.notes || "");
  const [exercises, setExercises] = useState(
    (initialWorkout?.exercises || []).map(createDraftExercise)
  );
  const [selectedLibraryExercise, setSelectedLibraryExercise] = useState(
    exerciseLibrary[0]?.name || ""
  );
  const [customExercise, setCustomExercise] = useState({
    name: "",
    muscleGroup: "Chest",
    defaultSets: 3,
    description: "",
  });

  useEffect(() => {
    setTitle(initialWorkout?.title || "");
    setNotes(initialWorkout?.notes || "");
    setExercises((initialWorkout?.exercises || []).map(createDraftExercise));
  }, [initialWorkout]);

  const selectedExercise = useMemo(
    () => exerciseLibrary.find((exercise) => exercise.name === selectedLibraryExercise) || null,
    [exerciseLibrary, selectedLibraryExercise]
  );

  const handleExerciseChange = (exerciseId, key, value) => {
    setExercises((currentExercises) =>
      currentExercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              [key]: key === "defaultSets" ? Math.max(1, Number(value || 1)) : value,
            }
          : exercise
      )
    );
  };

  const handleAddLibraryExercise = () => {
    if (!selectedExercise) {
      return;
    }

    setExercises((currentExercises) => [...currentExercises, createDraftExercise(selectedExercise)]);
  };

  const handleAddCustomExercise = () => {
    if (!customExercise.name.trim()) {
      return;
    }

    setExercises((currentExercises) => [
      ...currentExercises,
      createDraftExercise({
        ...customExercise,
        name: customExercise.name.trim(),
      }),
    ]);
    setCustomExercise({
      name: "",
      muscleGroup: "Chest",
      defaultSets: 3,
      description: "",
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!title.trim()) {
      return;
    }

    onSubmit({
      title: title.trim(),
      notes: notes.trim(),
      exercises: exercises.map((exercise) => ({
        name: exercise.name.trim() || "Exercise",
        muscleGroup: exercise.muscleGroup,
        defaultSets: Number(exercise.defaultSets || 1),
        description: exercise.description.trim(),
      })),
    });
  };

  return (
    <Card className="form-card">
      <div className="form-card__header">
        <span className="section-heading__eyebrow">
          {initialWorkout ? "Edit Workout" : "New Workout"}
        </span>
        <h2>{initialWorkout ? "Update your workout" : "Create a workout plan"}</h2>
      </div>

      <div className="form-card__content">
        <Form onSubmit={handleSubmit}>
          <div className="form-grid">
            <Form.Group>
              <Form.Label>Workout Name</Form.Label>
              <Form.Control
                className="app-input"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                className="app-input app-textarea"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />
            </Form.Group>
          </div>

          <div className="workout-builder">
            <div className="workout-builder__section">
              <div className="workout-builder__header">
                <h3>Add from library</h3>
                <Button type="button" variant="secondary" onClick={handleAddLibraryExercise}>
                  Add Exercise
                </Button>
              </div>
              <Form.Select
                className="app-input"
                value={selectedLibraryExercise}
                onChange={(event) => setSelectedLibraryExercise(event.target.value)}
              >
                {exerciseLibrary.map((exercise) => (
                  <option key={exercise.name} value={exercise.name}>
                    {exercise.name} · {exercise.muscleGroup}
                  </option>
                ))}
              </Form.Select>
            </div>

            <div className="workout-builder__section">
              <div className="workout-builder__header">
                <h3>Add custom exercise</h3>
                <Button type="button" variant="secondary" onClick={handleAddCustomExercise}>
                  Add Custom
                </Button>
              </div>
              <div className="form-grid">
                <Form.Control
                  className="app-input"
                  placeholder="Exercise name"
                  value={customExercise.name}
                  onChange={(event) =>
                    setCustomExercise((currentExercise) => ({
                      ...currentExercise,
                      name: event.target.value,
                    }))
                  }
                />
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
                <Form.Control
                  as="textarea"
                  rows={2}
                  className="app-input app-textarea"
                  placeholder="Description"
                  value={customExercise.description}
                  onChange={(event) =>
                    setCustomExercise((currentExercise) => ({
                      ...currentExercise,
                      description: event.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>

          <div className="workout-plan-editor">
            {exercises.length === 0 ? (
              <Card className="empty-state">
                <h3>No exercises yet</h3>
                <p>Add library or custom exercises to build this workout.</p>
              </Card>
            ) : (
              exercises.map((exercise) => (
                <Card key={exercise.id} className="workout-plan-editor__item">
                  <div className="workout-plan-editor__grid">
                    <Form.Control
                      className="app-input"
                      value={exercise.name}
                      onChange={(event) =>
                        handleExerciseChange(exercise.id, "name", event.target.value)
                      }
                    />
                    <Form.Select
                      className="app-input"
                      value={exercise.muscleGroup}
                      onChange={(event) =>
                        handleExerciseChange(exercise.id, "muscleGroup", event.target.value)
                      }
                    >
                      {muscleGroups.map((group) => (
                        <option key={group}>{group}</option>
                      ))}
                    </Form.Select>
                    <Form.Control
                      className="app-input"
                      type="number"
                      min="1"
                      max="12"
                      value={exercise.defaultSets}
                      onChange={(event) =>
                        handleExerciseChange(exercise.id, "defaultSets", event.target.value)
                      }
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() =>
                        setExercises((currentExercises) =>
                          currentExercises.filter((item) => item.id !== exercise.id)
                        )
                      }
                    >
                      Remove
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>

          <div className="inline-actions mt-3">
            <Button type="submit" variant="primary">
              {initialWorkout ? "Save Workout" : "Create Workout"}
            </Button>
            {onCancel ? (
              <Button type="button" variant="secondary" onClick={onCancel}>
                Cancel
              </Button>
            ) : null}
          </div>
        </Form>
      </div>
    </Card>
  );
}
