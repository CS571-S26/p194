import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  createEmptySet,
  createExerciseRecord,
  createMealRecord,
  createDefaultWorkoutPlans,
  createWorkoutFromPlan,
  createWorkoutPlanRecord,
  createWorkoutPlansFromHistory,
  createWorkoutRecord,
  exerciseLibrary,
  getExercisePersonalRecords,
  getLocalDateKey,
  getWorkoutAnalytics,
  getWorkoutFatigue,
} from "../utils/fitness";

const STORAGE_KEY = "fitpilot-state-v2";

const FitPilotContext = createContext(null);

const defaultState = {
  workoutPlans: createDefaultWorkoutPlans(),
  workouts: [],
  meals: [],
};

function normalizeWorkoutPlan(plan) {
  return createWorkoutPlanRecord(plan);
}

function normalizeState(rawState) {
  const workouts = Array.isArray(rawState?.workouts)
    ? rawState.workouts.map((workout) => ({
        ...createWorkoutRecord(workout),
        exercises: (workout.exercises || []).map((exercise) => ({
          ...createExerciseRecord({
            ...exercise,
            id: exercise.id,
            sets: Array.isArray(exercise.sets) ? exercise.sets.length : exercise.defaultSets,
          }),
          sets: (exercise.sets || []).map((set, index) => ({
            ...createEmptySet(index),
            ...set,
            order: index + 1,
          })),
        })),
      }))
    : [];
  const meals = Array.isArray(rawState?.meals) ? rawState.meals.map(createMealRecord) : [];
  const storedPlans = Array.isArray(rawState?.workoutPlans)
    ? rawState.workoutPlans.map(normalizeWorkoutPlan)
    : [];
  const derivedPlans = createWorkoutPlansFromHistory(workouts);
  const workoutPlans =
    storedPlans.length > 0 ? storedPlans : derivedPlans.length > 0 ? derivedPlans : createDefaultWorkoutPlans();

  return {
    workoutPlans,
    workouts,
    meals,
  };
}

export function FitPilotProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const storedState = window.localStorage.getItem(STORAGE_KEY);
      return storedState ? normalizeState(JSON.parse(storedState)) : defaultState;
    } catch (error) {
      return defaultState;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const activeWorkout = useMemo(
    () => state.workouts.find((workout) => workout.status === "active") || null,
    [state.workouts]
  );

  const startWorkout = (input = "Workout Session") => {
    if (activeWorkout) {
      return activeWorkout;
    }

    const workout =
      typeof input === "string"
        ? createWorkoutRecord({ title: input })
        : input?.planId
          ? createWorkoutFromPlan(
              state.workoutPlans.find((plan) => plan.id === input.planId) || {
                id: input.planId,
                title: input.title || "Workout Session",
                exercises: input.exercises || [],
              },
              input
            )
          : createWorkoutRecord(input || {});

    setState((currentState) => ({
      ...currentState,
      workouts: [workout, ...currentState.workouts],
    }));
    return workout;
  };

  const createWorkoutPlan = (plan) => {
    const workoutPlan = createWorkoutPlanRecord(plan);
    setState((currentState) => ({
      ...currentState,
      workoutPlans: [workoutPlan, ...currentState.workoutPlans],
    }));
    return workoutPlan;
  };

  const updateWorkoutPlan = (planId, updates) => {
    setState((currentState) => ({
      ...currentState,
      workoutPlans: currentState.workoutPlans.map((plan) =>
        plan.id === planId
          ? createWorkoutPlanRecord({
              ...plan,
              ...updates,
              id: plan.id,
              createdAt: plan.createdAt,
              updatedAt: new Date().toISOString(),
            })
          : plan
      ),
    }));
  };

  const deleteWorkoutPlan = (planId) => {
    setState((currentState) => ({
      ...currentState,
      workoutPlans: currentState.workoutPlans.filter((plan) => plan.id !== planId),
    }));
  };

  const updateWorkout = (workoutId, updates) => {
    setState((currentState) => ({
      ...currentState,
      workouts: currentState.workouts.map((workout) =>
        workout.id === workoutId ? { ...workout, ...updates } : workout
      ),
    }));
  };

  const addExerciseToWorkout = (exercise, workoutId = activeWorkout?.id) => {
    if (!workoutId) {
      return null;
    }

    const exerciseRecord = createExerciseRecord(exercise);
    setState((currentState) => ({
      ...currentState,
      workouts: currentState.workouts.map((workout) =>
        workout.id === workoutId
          ? {
              ...workout,
              exercises: [...workout.exercises, exerciseRecord],
            }
          : workout
      ),
    }));
    return exerciseRecord;
  };

  const updateExercise = (workoutId, exerciseId, updates) => {
    setState((currentState) => ({
      ...currentState,
      workouts: currentState.workouts.map((workout) =>
        workout.id === workoutId
          ? {
              ...workout,
              exercises: workout.exercises.map((exercise) =>
                exercise.id === exerciseId ? { ...exercise, ...updates } : exercise
              ),
            }
          : workout
      ),
    }));
  };

  const deleteExercise = (workoutId, exerciseId) => {
    setState((currentState) => ({
      ...currentState,
      workouts: currentState.workouts.map((workout) =>
        workout.id === workoutId
          ? {
              ...workout,
              exercises: workout.exercises.filter((exercise) => exercise.id !== exerciseId),
            }
          : workout
      ),
    }));
  };

  const addSetToExercise = (workoutId, exerciseId) => {
    setState((currentState) => ({
      ...currentState,
      workouts: currentState.workouts.map((workout) => {
        if (workout.id !== workoutId) {
          return workout;
        }

        return {
          ...workout,
          exercises: workout.exercises.map((exercise) => {
            if (exercise.id !== exerciseId) {
              return exercise;
            }

            return {
              ...exercise,
              sets: [...exercise.sets, createEmptySet(exercise.sets.length)].map((set, index) => ({
                ...set,
                order: index + 1,
              })),
            };
          }),
        };
      }),
    }));
  };

  const deleteSetFromExercise = (workoutId, exerciseId, setId) => {
    setState((currentState) => ({
      ...currentState,
      workouts: currentState.workouts.map((workout) =>
        workout.id === workoutId
          ? {
              ...workout,
              exercises: workout.exercises.map((exercise) =>
                exercise.id === exerciseId
                  ? {
                      ...exercise,
                      sets: exercise.sets
                        .filter((set) => set.id !== setId)
                        .map((set, index) => ({ ...set, order: index + 1 })),
                    }
                  : exercise
              ),
            }
          : workout
      ),
    }));
  };

  const updateSet = (workoutId, exerciseId, setId, updates) => {
    setState((currentState) => ({
      ...currentState,
      workouts: currentState.workouts.map((workout) =>
        workout.id === workoutId
          ? {
              ...workout,
              exercises: workout.exercises.map((exercise) =>
                exercise.id === exerciseId
                  ? {
                      ...exercise,
                      sets: exercise.sets.map((set) =>
                        set.id === setId ? { ...set, ...updates } : set
                      ),
                    }
                  : exercise
              ),
            }
          : workout
      ),
    }));
  };

  const completeWorkout = (workoutId) => {
    setState((currentState) => ({
      ...currentState,
      workouts: currentState.workouts.map((workout) =>
        workout.id === workoutId
          ? {
              ...workout,
              status: "completed",
              endedAt: new Date().toISOString(),
            }
          : workout
      ),
    }));
  };

  const deleteWorkout = (workoutId) => {
    setState((currentState) => ({
      ...currentState,
      workouts: currentState.workouts.filter((workout) => workout.id !== workoutId),
    }));
  };

  const addMeal = (meal) => {
    const mealRecord = createMealRecord(meal);
    setState((currentState) => ({
      ...currentState,
      meals: [mealRecord, ...currentState.meals],
    }));
  };

  const updateMeal = (mealId, updates) => {
    setState((currentState) => ({
      ...currentState,
      meals: currentState.meals.map((meal) =>
        meal.id === mealId ? createMealRecord({ ...meal, ...updates }) : meal
      ),
    }));
  };

  const deleteMeal = (mealId) => {
    setState((currentState) => ({
      ...currentState,
      meals: currentState.meals.filter((meal) => meal.id !== mealId),
    }));
  };

  const getWorkoutInsights = (workoutId) => {
    const workout = state.workouts.find((candidate) => candidate.id === workoutId);
    if (!workout) {
      return null;
    }

    return {
      exercisePRs: getExercisePersonalRecords(state.workouts, workout),
      fatigue: getWorkoutFatigue(state.workouts, workout),
    };
  };

  const getWorkoutPlanById = (planId) =>
    state.workoutPlans.find((plan) => plan.id === planId) || null;

  const getWorkoutById = (workoutId) =>
    state.workouts.find((workout) => workout.id === workoutId) || null;

  const getWorkoutAnalyticsById = (workoutId) =>
    getWorkoutAnalytics(state.workouts, workoutId);

  const calendarIndex = useMemo(() => {
    const workoutsByDate = {};
    const mealsByDate = {};

    state.workouts.forEach((workout) => {
      const dateKey = workout.date || getLocalDateKey(workout.startedAt);
      workoutsByDate[dateKey] = [...(workoutsByDate[dateKey] || []), workout];
    });

    state.meals.forEach((meal) => {
      mealsByDate[meal.date] = [...(mealsByDate[meal.date] || []), meal];
    });

    return { workoutsByDate, mealsByDate };
  }, [state.meals, state.workouts]);

  const value = {
    exerciseLibrary,
    workoutPlans: state.workoutPlans,
    workouts: state.workouts,
    meals: state.meals,
    activeWorkout,
    startWorkout,
    createWorkoutPlan,
    updateWorkoutPlan,
    deleteWorkoutPlan,
    updateWorkout,
    addExerciseToWorkout,
    updateExercise,
    deleteExercise,
    addSetToExercise,
    deleteSetFromExercise,
    updateSet,
    completeWorkout,
    deleteWorkout,
    addMeal,
    updateMeal,
    deleteMeal,
    getWorkoutInsights,
    getWorkoutPlanById,
    getWorkoutById,
    getWorkoutAnalyticsById,
    calendarIndex,
  };

  return <FitPilotContext.Provider value={value}>{children}</FitPilotContext.Provider>;
}

export function useFitPilot() {
  const context = useContext(FitPilotContext);
  if (!context) {
    throw new Error("useFitPilot must be used inside FitPilotProvider");
  }
  return context;
}
