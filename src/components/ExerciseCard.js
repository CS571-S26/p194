import Button from "./Button";
import Card from "./Card";
import benchPressImage from "../exercise_pics/bench_press.png";
import squatImage from "../exercise_pics/squat.png";
import pullUpsImage from "../exercise_pics/pull_ups.png";
import pecdeckflyImage from "../exercise_pics/pec_deck_fly.png"

const exerciseImagesByName = {
  "Bench Press": benchPressImage,
  "Pec Deck Fly": pecdeckflyImage,
  "Shoulder Press": benchPressImage,
  "Lateral Raises": benchPressImage,
  "Bicep Curl": benchPressImage,
  "Tricep Push Down": benchPressImage,
  Squat: squatImage,
  "Leg Press": squatImage,
  "Calf Raises": squatImage,
  "Pull-ups": pullUpsImage,
};

const exerciseImagesByMuscleGroup = {
  Chest: benchPressImage,
  Shoulders: benchPressImage,
  Arms: benchPressImage,
  Legs: squatImage,
  Back: pullUpsImage,
};

function getExerciseImage(name, muscleGroup) {
  return (
    exerciseImagesByName[name] ||
    exerciseImagesByMuscleGroup[muscleGroup] ||
    benchPressImage
  );
}

export default function ExerciseCard({
  name,
  muscleGroup,
  description,
  sets,
  onStart,
  buttonLabel = "Start Workout",
}) {
  return (
    <Card className="exercise-card">
      <img
        className="exercise-card__image"
        src={getExerciseImage(name, muscleGroup)}
        alt={name}
      />
      <div className="exercise-card__body">
        <span className="exercise-card__tag">{muscleGroup}</span>
        <h3>{name}</h3>
        <p>{description}</p>
        <div className="exercise-card__footer">
          <span className="exercise-card__sets">{sets} sets</span>
          <Button variant="primary" onClick={onStart}>
            {buttonLabel}
          </Button>
        </div>
      </div>
    </Card>
  );
}


// import Button from "./Button";
// import Card from "./Card";
// import benchPressImage from "../exercise_pics/bench_press.png";
// import squatImage from "../exercise_pics/squat.png";
// import pullUpsImage from "../exercise_pics/pull_ups.png";

// const exerciseImagesByName = {
//   "Bench Press": benchPressImage,
//   "Pec Deck Fly": benchPressImage,
//   "Shoulder Press": benchPressImage,
//   "Lateral Raises": benchPressImage,
//   "Bicep Curl": benchPressImage,
//   "Tricep Push Down": benchPressImage,
//   Squat: squatImage,
//   "Leg Press": squatImage,
//   "Calf Raises": squatImage,
//   "Pull-ups": pullUpsImage,
// };

// const exerciseImagesByMuscleGroup = {
//   Chest: benchPressImage,
//   Shoulders: benchPressImage,
//   Arms: benchPressImage,
//   Legs: squatImage,
//   Back: pullUpsImage,
// };

// function getExerciseImage(name, muscleGroup) {
//   return (
//     exerciseImagesByName[name] ||
//     exerciseImagesByMuscleGroup[muscleGroup] ||
//     benchPressImage
//   );
// }

// export default function ExerciseCard({
//   name,
//   muscleGroup,
//   description,
//   sets,
//   onStart,
//   onDelete,
// }) {
//   return (
//     <Card className="exercise-card">
//       <img
//         className="exercise-card__image"
//         src={getExerciseImage(name, muscleGroup)}
//         alt={name}
//       />
//       <div className="exercise-card__body">
//         <span className="exercise-card__tag">{muscleGroup}</span>
//         <h3>{name}</h3>
//         <p>{description}</p>
//         <div className="exercise-card__footer">
//           <span className="exercise-card__sets">{sets} sets</span>
//           <Button variant="primary" onClick={onStart}>
//             Start Workout
//           </Button>
//           {onDelete && (
//             <Button variant="danger" onClick={onDelete}>
//               Delete
//             </Button>
//           )}
//         </div>
//       </div>
//     </Card>
//   );
// }