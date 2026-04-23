import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import ExerciseSuggestion from "../components/ExerciseSuggestion";
import MealSuggestion from "../components/MealSuggestion";

export default function Dashboard() {
  return (
    <>
      <div className="hero-section text-white text-center py-5">
        <Container>
          <h1 className="display-4 fw-bold">Train Smarter.</h1>
          <p className="lead">
            Track workouts. Monitor nutrition. Get AI-powered suggestions.
          </p>
          <Button as={Link} to="/workouts" size="lg" variant="light">
            Start Training
          </Button>
        </Container>
      </div>

      <Container className="mt-5">
        <Row>
          <Col md={6}>
            <ExerciseSuggestion />
          </Col>
          <Col md={6}>
            <MealSuggestion />
          </Col>
        </Row>
      </Container>
    </>
  );
}