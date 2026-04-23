import { Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import { useFitPilot } from "../context/FitPilotContext";
import { formatDateLabel } from "../utils/fitness";

function InsightCard({ label, value, helper }) {
  return (
    <Card className="detail-card">
      <span className="section-heading__eyebrow">{label}</span>
      <h3>{value}</h3>
      {helper ? <p>{helper}</p> : null}
    </Card>
  );
}

export default function WorkoutAnalytics() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getWorkoutAnalyticsById } = useFitPilot();
  const analytics = getWorkoutAnalyticsById(id);

  if (!analytics) {
    return (
      <main className="page-shell">
        <section className="page-section page-section--tight">
          <Container>
            <Card className="empty-state">
              <h3>Analytics unavailable</h3>
              <p>This workout summary could not be found.</p>
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

  const { workout, summary, progression, insights } = analytics;
  const maxVolume = Math.max(...progression.map((entry) => entry.totalVolume), 0);

  return (
    <main className="page-shell">
      <section className="page-section page-section--tight">
        <Container>
          <div className="section-heading">
            <span className="section-heading__eyebrow">Workout Analytics</span>
            <h1>{workout.title}</h1>
            <p>
              Summary and progression are derived entirely from stored workouts
              tied to this plan or matching workout history.
            </p>
          </div>

          <div className="top-toolbar">
            <div className="inline-actions">
              <Button type="button" variant="primary" onClick={() => navigate("/workouts")}>
                Back to Workouts
              </Button>
            </div>
            <span className="top-toolbar__note">{formatDateLabel(workout.date)}</span>
          </div>

          <div className="analytics-summary-grid">
            <InsightCard label="Exercises" value={summary.totalExercises} />
            <InsightCard label="Completed Sets" value={summary.totalCompletedSets} />
            <InsightCard label="Total Reps" value={summary.totalReps} />
            <InsightCard label="Volume" value={summary.totalVolume} />
          </div>

          <div className="analytics-summary-grid mt-4">
            <InsightCard
              label="Completed Sessions"
              value={insights.completedSessions}
              helper="Historical sessions found for this workout."
            />
            <InsightCard
              label="Average Duration"
              value={insights.averageDurationMinutes ? `${insights.averageDurationMinutes} min` : "N/A"}
              helper="Based on completed workouts with recorded end times."
            />
            <InsightCard
              label="Volume Change"
              value={
                insights.volumeDelta === null
                  ? "N/A"
                  : `${insights.volumeDelta > 0 ? "+" : ""}${insights.volumeDelta}`
              }
              helper="Compared with the previous completed session."
            />
            <InsightCard
              label="Rep Change"
              value={
                insights.repDelta === null
                  ? "N/A"
                  : `${insights.repDelta > 0 ? "+" : ""}${insights.repDelta}`
              }
              helper="Compared with the previous completed session."
            />
          </div>

          <div className="analytics-layout mt-4">
            <Card className="detail-card">
              <span className="section-heading__eyebrow">Progression</span>
              <h2>Volume over time</h2>
              {progression.length === 0 ? (
                <p>No completed history is available yet.</p>
              ) : (
                <div className="progression-list">
                  {progression.map((entry) => (
                    <div key={entry.id} className="progression-row">
                      <div className="progression-row__meta">
                        <strong>{formatDateLabel(entry.date)}</strong>
                        <span>
                          {entry.totalCompletedSets} sets · {entry.totalReps} reps · {entry.totalVolume}
                          {" "}volume
                        </span>
                      </div>
                      <div className="progression-row__bar">
                        <span
                          style={{
                            width: `${maxVolume > 0 ? (entry.totalVolume / maxVolume) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card className="detail-card">
              <span className="section-heading__eyebrow">Derived Insights</span>
              <h2>What the stored data says</h2>
              <div className="analytics-insights">
                <p>
                  Best volume:
                  {" "}
                  {insights.bestSession
                    ? `${insights.bestSession.totalVolume} on ${formatDateLabel(insights.bestSession.date)}`
                    : "No completed session volume yet."}
                </p>
                <p>
                  Session density:
                  {" "}
                  {summary.totalCompletedSets > 0
                    ? `${Math.round(summary.totalReps / summary.totalCompletedSets)} average reps per completed set`
                    : "No completed sets recorded in this session."}
                </p>
                <p>
                  Exercise spread:
                  {" "}
                  {summary.totalExercises > 0
                    ? `${summary.totalExercises} exercise${summary.totalExercises === 1 ? "" : "s"} logged`
                    : "No exercises logged."}
                </p>
              </div>
            </Card>
          </div>
        </Container>
      </section>
    </main>
  );
}
