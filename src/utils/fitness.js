const EXERCISE_LIBRARY = [
  {
    name: "Pull-ups",
    muscleGroup: "Back",
    description:
      "Build upper-body strength with a bodyweight pull pattern that targets lats and grip.",
    defaultSets: 4,
  },
  {
    name: "Squat",
    muscleGroup: "Legs",
    description:
      "A foundational lower-body lift for power, balance, and full-leg development.",
    defaultSets: 4,
  },
  {
    name: "Bench Press",
    muscleGroup: "Chest",
    description:
      "A classic pressing movement that develops chest, shoulders, and triceps strength.",
    defaultSets: 4,
  },
  {
    name: "Pec Deck Fly",
    muscleGroup: "Chest",
    description:
      "An isolation chest movement that helps with controlled tension and finishing volume.",
    defaultSets: 3,
  },
  {
    name: "Leg Press",
    muscleGroup: "Legs",
    description:
      "A stable lower-body press variation that lets you accumulate quad-focused training volume.",
    defaultSets: 4,
  },
  {
    name: "Lateral Raises",
    muscleGroup: "Shoulders",
    description:
      "A shoulder isolation exercise for building width and improving upper-body symmetry.",
    defaultSets: 3,
  },
  {
    name: "Calf Raises",
    muscleGroup: "Legs",
    description:
      "Direct calf work that adds lower-leg strength, balance, and extra lower-body detail.",
    defaultSets: 4,
  },
  {
    name: "Shoulder Press",
    muscleGroup: "Shoulders",
    description:
      "A compound overhead press for front delts, triceps, and upper-body pressing strength.",
    defaultSets: 4,
  },
  {
    name: "Bicep Curl",
    muscleGroup: "Arms",
    description:
      "A simple arm accessory movement that helps target elbow flexion and biceps growth.",
    defaultSets: 3,
  },
  {
    name: "Tricep Push Down",
    muscleGroup: "Arms",
    description:
      "A cable-based triceps finisher for controlled reps and higher-volume arm work.",
    defaultSets: 3,
  },
];

export const muscleGroups = [
  "Chest",
  "Back",
  "Legs",
  "Shoulders",
  "Bicep",
  "Tricep",
  "Core",
  "Full Body",
];

export const exerciseLibrary = EXERCISE_LIBRARY;

const DEFAULT_WORKOUT_PLANS = [
  {
    title: "Upper Body Push",
    notes: "Pressing-focused session for chest, shoulders, and triceps.",
    exercises: ["Bench Press", "Pec Deck Fly", "Shoulder Press", "Tricep Push Down"],
  },
  {
    title: "Pull Day",
    notes: "Back and arm pulling volume with a mix of compound and accessory work.",
    exercises: ["Pull-ups", "Bicep Curl", "Lateral Raises"],
  },
  {
    title: "Lower Body",
    notes: "Lower-body strength and volume session.",
    exercises: ["Squat", "Leg Press", "Calf Raises"],
  },
];

export function createId(prefix = "item") {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getLocalDateKey(dateInput = new Date()) {
  const date = new Date(dateInput);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}

export function formatClock(totalSeconds) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds || 0));
  const hours = String(Math.floor(safeSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((safeSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(safeSeconds % 60).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

export function formatDateLabel(dateKey) {
  if (!dateKey) {
    return "No date";
  }

  return new Date(`${dateKey}T12:00:00`).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function createEmptySet(index) {
  return {
    id: createId("set"),
    order: index + 1,
    reps: "",
    weight: "",
    completed: false,
  };
}

export function createExerciseRecord(exercise) {
  const setCount = Number(exercise.defaultSets || exercise.sets || 3);

  return {
    id: exercise.id || createId("exercise"),
    name: exercise.name,
    muscleGroup: exercise.muscleGroup || "Full Body",
    description: exercise.description || "",
    notes: exercise.notes || "",
    source: exercise.source || "library",
    sets: Array.from({ length: setCount }, (_, index) => createEmptySet(index)),
  };
}

export function createWorkoutPlanExercise(exercise) {
  return {
    id: exercise.id || createId("plan-exercise"),
    name: exercise.name?.trim() || "Exercise",
    muscleGroup: exercise.muscleGroup || "Full Body",
    description: exercise.description || "",
    defaultSets: Math.max(1, Number(exercise.defaultSets || exercise.sets || 3)),
  };
}

export function createWorkoutPlanRecord(overrides = {}) {
  const createdAt = overrides.createdAt || new Date().toISOString();

  return {
    id: overrides.id || createId("plan"),
    title: overrides.title?.trim() || "Untitled Workout",
    notes: overrides.notes || "",
    createdAt,
    updatedAt: overrides.updatedAt || createdAt,
    exercises: (overrides.exercises || []).map(createWorkoutPlanExercise),
  };
}

export function createDefaultWorkoutPlans() {
  return DEFAULT_WORKOUT_PLANS.map((plan) =>
    createWorkoutPlanRecord({
      ...plan,
      exercises: plan.exercises
        .map((exerciseName) => exerciseLibrary.find((exercise) => exercise.name === exerciseName))
        .filter(Boolean),
    })
  );
}

export function createWorkoutPlansFromHistory(workouts) {
  const plansByTitle = new Map();

  workouts.forEach((workout) => {
    if (plansByTitle.has(workout.title) || !workout.exercises?.length) {
      return;
    }

    plansByTitle.set(
      workout.title,
      createWorkoutPlanRecord({
        id: workout.planId || undefined,
        title: workout.title,
        notes: workout.notes || "",
        exercises: workout.exercises.map((exercise) => ({
          name: exercise.name,
          muscleGroup: exercise.muscleGroup,
          description: exercise.description,
          defaultSets: exercise.sets?.length || 3,
        })),
      })
    );
  });

  return Array.from(plansByTitle.values());
}

export function createWorkoutRecord(overrides = {}) {
  const startedAt = overrides.startedAt || new Date().toISOString();
  const date = overrides.date || getLocalDateKey(startedAt);

  return {
    id: overrides.id || createId("workout"),
    planId: overrides.planId || null,
    title: overrides.title || "Untitled Workout",
    date,
    startedAt,
    endedAt: overrides.endedAt || null,
    status: overrides.status || "active",
    notes: overrides.notes || "",
    exercises: overrides.exercises || [],
  };
}

export function createWorkoutFromPlan(plan, overrides = {}) {
  return createWorkoutRecord({
    ...overrides,
    title: overrides.title || plan.title,
    planId: plan.id,
    exercises: plan.exercises.map((exercise) => createExerciseRecord(exercise)),
  });
}

export function createMealRecord(meal) {
  return {
    id: meal.id || createId("meal"),
    name: meal.name?.trim() || "Meal",
    calories: Number(meal.calories || 0),
    protein: Number(meal.protein || 0),
    carbs: Number(meal.carbs || 0),
    fats: Number(meal.fats || 0),
    date: meal.date || getLocalDateKey(),
  };
}

export function createSorenessRecord(entry = {}) {
  return {
    date: entry.date || getLocalDateKey(),
    muscles:
      Object.entries(entry.muscles || {}).reduce((accumulator, [muscle, score]) => {
        const normalizedScore = Number(score);
        if (!Number.isFinite(normalizedScore)) {
          return accumulator;
        }

        return {
          ...accumulator,
          [muscle]: Math.max(0, Math.min(10, normalizedScore)),
        };
      }, {}) || {},
  };
}

export function getSetMetrics(set) {
  const reps = Number(set.reps || 0);
  const weight = Number(set.weight || 0);
  const completed = Boolean(set.completed);

  return {
    reps,
    weight,
    completed,
    volume: completed ? reps * weight : 0,
  };
}

export function getExerciseMetrics(exercise) {
  return exercise.sets.reduce(
    (totals, set) => {
      const metrics = getSetMetrics(set);
      return {
        completedSets: totals.completedSets + (metrics.completed ? 1 : 0),
        totalReps: totals.totalReps + (metrics.completed ? metrics.reps : 0),
        totalVolume: totals.totalVolume + metrics.volume,
        maxWeight: Math.max(totals.maxWeight, metrics.completed ? metrics.weight : 0),
      };
    },
    { completedSets: 0, totalReps: 0, totalVolume: 0, maxWeight: 0 }
  );
}

export function getWorkoutMetrics(workout) {
  return workout.exercises.reduce(
    (totals, exercise) => {
      const metrics = getExerciseMetrics(exercise);
      return {
        totalExercises: totals.totalExercises + 1,
        totalCompletedSets: totals.totalCompletedSets + metrics.completedSets,
        totalReps: totals.totalReps + metrics.totalReps,
        totalVolume: totals.totalVolume + metrics.totalVolume,
      };
    },
    { totalExercises: 0, totalCompletedSets: 0, totalReps: 0, totalVolume: 0 }
  );
}

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

export function getSetIntensity(set) {
  const reps = Number(set.reps || 0);
  const weight = Number(set.weight || 0);

  if (reps <= 0) {
    return 0;
  }

  if (weight > 0) {
    const estimatedOneRepMax = weight * (1 + reps / 30);
    return clamp(weight / estimatedOneRepMax, 0.35, 1);
  }

  return clamp(1 / (1 + reps / 30), 0.35, 0.95);
}

export function getSetFatigueScore(set, alpha = 0.071) {
  const metrics = getSetMetrics(set);

  if (!metrics.completed || metrics.reps <= 0) {
    return 0;
  }

  const intensity = getSetIntensity(set);
  const effectiveWeight = metrics.weight > 0 ? metrics.weight : 25;
  return effectiveWeight * metrics.reps * Math.exp(alpha * intensity * 100);
}

export function getExerciseFatigueScore(exercise) {
  return exercise.sets.reduce((total, set) => total + getSetFatigueScore(set), 0);
}

export function getWorkoutMuscleFatigue(workout) {
  const rawScores = workout.exercises.reduce((totals, exercise) => {
    const muscleGroup = exercise.muscleGroup || "Full Body";
    const fatigueScore = getExerciseFatigueScore(exercise);

    if (fatigueScore <= 0) {
      return totals;
    }

    return {
      ...totals,
      [muscleGroup]: (totals[muscleGroup] || 0) + fatigueScore,
    };
  }, {});

  return Object.entries(rawScores)
    .sort((left, right) => right[1] - left[1])
    .map(([muscleGroup, score]) => ({
      muscleGroup,
      score,
    }));
}

export function getWorkoutPlanMetrics(plan) {
  return plan.exercises.reduce(
    (totals, exercise) => ({
      totalExercises: totals.totalExercises + 1,
      totalSets: totals.totalSets + Number(exercise.defaultSets || 0),
    }),
    { totalExercises: 0, totalSets: 0 }
  );
}

function getPastCompletedWorkouts(workouts, currentWorkout) {
  return workouts.filter(
    (workout) =>
      workout.id !== currentWorkout.id &&
      workout.status === "completed" &&
      new Date(workout.startedAt).getTime() < new Date(currentWorkout.startedAt).getTime()
  );
}

export function getExercisePersonalRecords(workouts, currentWorkout) {
  const previousWorkouts = getPastCompletedWorkouts(workouts, currentWorkout);

  return currentWorkout.exercises.map((exercise) => {
    const currentMetrics = getExerciseMetrics(exercise);
    const historicalExercises = previousWorkouts.flatMap((workout) =>
      workout.exercises.filter((candidate) => candidate.name === exercise.name)
    );

    const bestVolume = historicalExercises.reduce(
      (best, candidate) => Math.max(best, getExerciseMetrics(candidate).totalVolume),
      0
    );
    const bestWeight = historicalExercises.reduce(
      (best, candidate) => Math.max(best, getExerciseMetrics(candidate).maxWeight),
      0
    );
    const bestReps = historicalExercises.reduce(
      (best, candidate) => Math.max(best, getExerciseMetrics(candidate).totalReps),
      0
    );

    return {
      exerciseId: exercise.id,
      name: exercise.name,
      volumePR: currentMetrics.totalVolume > 0 && currentMetrics.totalVolume > bestVolume,
      weightPR: currentMetrics.maxWeight > 0 && currentMetrics.maxWeight > bestWeight,
      repPR: currentMetrics.totalReps > 0 && currentMetrics.totalReps > bestReps,
      metrics: currentMetrics,
    };
  });
}

function getRestDaysInPastFourDays(workouts, currentWorkout) {
  const recentWorkoutDays = new Set(
    workouts
      .filter((workout) => workout.id !== currentWorkout.id && workout.status === "completed")
      .map((workout) => workout.date)
  );

  const currentDate = new Date(`${currentWorkout.date}T12:00:00`);
  let restDays = 0;

  for (let daysAgo = 1; daysAgo <= 4; daysAgo += 1) {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() - daysAgo);
    const key = getLocalDateKey(date);
    if (!recentWorkoutDays.has(key)) {
      restDays += 1;
    }
  }

  return restDays;
}

function getRecentMuscleHitRatio(workouts, currentWorkout) {
  const currentMuscles = Array.from(
    new Set(currentWorkout.exercises.map((exercise) => exercise.muscleGroup))
  );

  if (currentMuscles.length === 0) {
    return 0;
  }

  const cutoff = new Date(currentWorkout.startedAt).getTime() - 48 * 60 * 60 * 1000;
  const recentlyHitMuscles = new Set();

  workouts
    .filter((workout) => workout.id !== currentWorkout.id && workout.status === "completed")
    .forEach((workout) => {
      if (new Date(workout.startedAt).getTime() < cutoff) {
        return;
      }

      workout.exercises.forEach((exercise) => {
        recentlyHitMuscles.add(exercise.muscleGroup);
      });
    });

  const overlap = currentMuscles.filter((muscle) => recentlyHitMuscles.has(muscle)).length;
  return overlap / currentMuscles.length;
}

export function getWorkoutFatigue(workouts, currentWorkout) {
  const metrics = getWorkoutMetrics(currentWorkout);
  const restDays = getRestDaysInPastFourDays(workouts, currentWorkout);
  const recentMuscleHitRatio = getRecentMuscleHitRatio(workouts, currentWorkout);

  const volumeScore = Math.min(metrics.totalVolume / 3500, 1) * 40;
  const repsScore = Math.min(metrics.totalReps / 140, 1) * 20;
  const densityScore = Math.min(metrics.totalCompletedSets / 28, 1) * 15;
  const restPenalty = ((4 - restDays) / 4) * 15;
  const repeatPenalty = recentMuscleHitRatio * 10;

  const score = Math.round(
    Math.min(100, volumeScore + repsScore + densityScore + restPenalty + repeatPenalty)
  );

  let label = "Low";
  if (score >= 75) {
    label = "High";
  } else if (score >= 45) {
    label = "Moderate";
  }

  return {
    score,
    label,
    restDays,
    recentMuscleHitRatio,
    metrics,
  };
}

const RECOVERY_FACTORS_BY_DAY = {
  0: 0.7,
  1: 1,
  2: 0.6,
};

function getDayDifference(startDateKey, endDateKey) {
  const start = new Date(`${startDateKey}T12:00:00`);
  const end = new Date(`${endDateKey}T12:00:00`);
  return Math.round((end - start) / (24 * 60 * 60 * 1000));
}

function normalizeMuscleFatigueScore(rawScore, referenceScore) {
  if (rawScore <= 0 || referenceScore <= 0) {
    return 0;
  }

  return Number(((rawScore / referenceScore) * 10).toFixed(1));
}

function getRecoveryRecommendation(score) {
  if (score <= 2) {
    return "Low fatigue: next session can add 1 set or raise load 2.5-5%.";
  }

  if (score <= 6) {
    return "Sweet spot: keep load steady and progress normally.";
  }

  if (score <= 8) {
    return "High fatigue: trim next-session volume by about 20%.";
  }

  return "Very high fatigue: deload or give this muscle an extra rest day.";
}

export function getCalendarMuscleRecovery(workouts, sorenessByDate, selectedDate) {
  const completedWorkouts = workouts.filter((workout) => workout.status === "completed");
  const rawEntries = completedWorkouts.flatMap((workout) => getWorkoutMuscleFatigue(workout));
  const referenceScore = rawEntries.reduce(
    (maximum, entry) => Math.max(maximum, entry.score),
    1
  );

  const predictedScores = completedWorkouts.reduce((totals, workout) => {
    const dayDifference = getDayDifference(workout.date, selectedDate);
    const recoveryFactor = RECOVERY_FACTORS_BY_DAY[dayDifference];

    if (recoveryFactor === undefined) {
      return totals;
    }

    return getWorkoutMuscleFatigue(workout).reduce(
      (muscleTotals, entry) => ({
        ...muscleTotals,
        [entry.muscleGroup]:
          (muscleTotals[entry.muscleGroup] || 0) + entry.score * recoveryFactor,
      }),
      totals
    );
  }, {});

  const recordedSoreness = sorenessByDate[selectedDate]?.muscles || {};
  const muscleGroupsForDay = Array.from(
    new Set([...muscleGroups, ...Object.keys(predictedScores), ...Object.keys(recordedSoreness)])
  ).sort((left, right) => (predictedScores[right] || 0) - (predictedScores[left] || 0));

  return muscleGroupsForDay.map((muscleGroup) => {
    const predicted = normalizeMuscleFatigueScore(predictedScores[muscleGroup] || 0, referenceScore);
    const actual = recordedSoreness[muscleGroup];
    const actualScore = actual === undefined ? null : Number(actual);
    const delta = actualScore === null ? null : Number((actualScore - predicted).toFixed(1));

    return {
      muscleGroup,
      predicted,
      actual: actualScore,
      delta,
      recommendation: getRecoveryRecommendation(actualScore ?? predicted),
    };
  });
}

export function getCalendarDayFatigueBadge(workouts, selectedDate) {
  const completedWorkouts = workouts.filter((workout) => workout.status === "completed");
  const referenceScore = completedWorkouts
    .flatMap((workout) => getWorkoutMuscleFatigue(workout))
    .reduce((maximum, entry) => Math.max(maximum, entry.score), 1);

  const predictedMax = completedWorkouts.reduce((maximum, workout) => {
    const dayDifference = getDayDifference(workout.date, selectedDate);
    const recoveryFactor = RECOVERY_FACTORS_BY_DAY[dayDifference];

    if (recoveryFactor === undefined) {
      return maximum;
    }

    const muscleMax = getWorkoutMuscleFatigue(workout).reduce(
      (currentMaximum, entry) => Math.max(currentMaximum, entry.score * recoveryFactor),
      0
    );

    return Math.max(maximum, muscleMax);
  }, 0);

  return normalizeMuscleFatigueScore(predictedMax, referenceScore);
}

function getRelatedCompletedWorkouts(workouts, currentWorkout) {
  return workouts
    .filter((workout) => {
      if (workout.status !== "completed") {
        return false;
      }

      if (currentWorkout.planId && workout.planId) {
        return workout.planId === currentWorkout.planId;
      }

      return workout.title === currentWorkout.title;
    })
    .sort((left, right) => new Date(left.startedAt) - new Date(right.startedAt));
}

export function getWorkoutProgression(workouts, workoutId) {
  const workout = workouts.find((candidate) => candidate.id === workoutId);
  if (!workout) {
    return [];
  }

  return getRelatedCompletedWorkouts(workouts, workout).map((entry) => {
    const metrics = getWorkoutMetrics(entry);
    const durationMinutes = entry.endedAt
      ? Math.round((new Date(entry.endedAt) - new Date(entry.startedAt)) / 60000)
      : 0;

    return {
      id: entry.id,
      title: entry.title,
      date: entry.date,
      durationMinutes,
      ...metrics,
    };
  });
}

export function getWorkoutAnalytics(workouts, workoutId) {
  const workout = workouts.find((candidate) => candidate.id === workoutId);
  if (!workout) {
    return null;
  }

  const summary = getWorkoutMetrics(workout);
  const progression = getWorkoutProgression(workouts, workoutId);
  const bestSession = progression.reduce(
    (best, entry) => (entry.totalVolume > (best?.totalVolume || 0) ? entry : best),
    null
  );
  const latestIndex = progression.findIndex((entry) => entry.id === workout.id);
  const previousSession = latestIndex > 0 ? progression[latestIndex - 1] : null;
  const averageDurationMinutes = progression.length
    ? Math.round(
        progression.reduce((total, entry) => total + (entry.durationMinutes || 0), 0) /
          progression.length
      )
    : 0;

  return {
    workout,
    summary,
    progression,
    insights: {
      completedSessions: progression.length,
      bestSession,
      averageDurationMinutes,
      volumeDelta: previousSession ? summary.totalVolume - previousSession.totalVolume : null,
      repDelta: previousSession ? summary.totalReps - previousSession.totalReps : null,
    },
  };
}

export function getMonthMatrix(referenceDate = new Date()) {
  const start = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
  const matrixStart = new Date(start);
  matrixStart.setDate(start.getDate() - start.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(matrixStart);
    date.setDate(matrixStart.getDate() + index);
    return {
      key: getLocalDateKey(date),
      dayOfMonth: date.getDate(),
      inMonth: date.getMonth() === referenceDate.getMonth(),
      isToday: getLocalDateKey(date) === getLocalDateKey(),
    };
  });
}
