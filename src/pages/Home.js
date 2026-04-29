import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";

const features = [
  {
    title: "Workout Sessions",
    description:
      "Start a live session, track every set, run an automatic timer, and edit or delete movements later.",
  },
  {
    title: "Progress Analytics",
    description:
      "See exercise PR flags for volume, top weight, and reps, plus a workout fatigue score grounded in your recent training.",
  },
  {
    title: "Calendar View",
    description:
      "Review workouts and meals day by day with an interactive calendar that keeps recovery context visible.",
  },
];

export default function Home() {
  return (
    <main className="page-shell">
      <section className="hero">
        <Container>
          <div className="hero__content">
            <span className="hero__eyebrow">Training log and recovery insight</span>
            <h1>Train Smarter.Eat Better.</h1>
            <p>
              FitPilot helps users organize workouts, track nutrition, and
              log live training, manage meal history, review PRs, and inspect how
              each session fits into your recovery week.
            </p>
            <div className="hero__actions">
              <Button as={Link} to="/workouts" variant="primary">
                Start Workout Tracking
              </Button>
              <Button as={Link} to="/calendar" variant="secondary">
                Open Calendar
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <section className="page-section">
        <Container>
          <div className="section-heading">
            <span className="section-heading__eyebrow">WHY IT WORKS</span>
            <h2>My personal fitness tracker, inspired by Hevy</h2>
            <p>
              Update set counts, edit old sessions, remove exercises, and keep
              meal logging connected to the same timeline.
            </p>
          </div>
          <Row className="g-4">
            {features.map((feature) => (
              <Col md={6} xl={4} key={feature.title}>
                <Card className="feature-card">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </main>
  );
}
