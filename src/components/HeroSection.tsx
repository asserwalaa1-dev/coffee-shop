import { Container, Row, Col, Button } from "react-bootstrap";

function HeroSection() {
  return (
    <section
      className="d-flex align-items-center"
      style={{
        minHeight: "100vh",
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)), url("https://images.squarespace-cdn.com/content/v1/58b37ee7be65940cc483f75a/2335d0a9-de49-4ae8-ab8c-dfd08cf8f340/AdobeStock_1694208225.jpeg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}>
      <Container>
        <Row>
          <Col lg={7}>
            <p className="text-warning fw-semibold text-uppercase">
              Welcome to Brew & Bean
            </p>

            <h1 className="display-2 fw-bold text-white">
              Coffee Made With Passion.
            </h1>

            <p className="text-white-50 fs-5 mt-4">
              Discover our coffee collection and enjoy a unique coffee
              experience.
            </p>

            <Button variant="warning" size="lg" href="#menu" className="mt-3">
              Explore Our Menu
            </Button>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default HeroSection;
