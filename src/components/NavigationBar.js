import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";

export default function NavigationBar() {
  return (
    <Navbar expand="lg" className="app-navbar" sticky="top">
      <Container className="app-navbar__inner">
        <Navbar.Brand as={NavLink} to="/" className="app-navbar__brand">
          FitPilot
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="ms-auto app-navbar__links">
            <Nav.Link as={NavLink} to="/" end className="app-navbar__link">
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/workouts" className="app-navbar__link">
              Workouts
            </Nav.Link>
            <Nav.Link as={NavLink} to="/nutrition" className="app-navbar__link">
              Meals
            </Nav.Link>
            <Nav.Link as={NavLink} to="/calendar" className="app-navbar__link">
              Calendar
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
