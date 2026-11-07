import { Container, Row, Col, Button } from "react-bootstrap";

function AboutSection() {
  return (
    <section id="about" className="bg-black text-white py-5">
      <Container>
        <Row className="align-items-center g-5">
          <Col lg={6}>
            <div className="bg-warning rounded-4 p-5 text-center">
              <h2 className="text-black display-4 fw-bold rounded-5 border border-5 border-black p-3 d-inline-block">
                BREW & BEAN
              </h2>

              <p className="text-black text-warning mb-0 fw-bold ">
                Coffee Made With Passion
              </p>
            </div>
          </Col>

          <Col lg={6}>
            <p className="text-warning fw-semibold text-uppercase">About Us</p>

            <h2 className="display-5 fw-bold mb-4">More Than Just Coffee</h2>

            <p className="text-white-50 fs-5">
              Discover a place where coffee meets comfort. Explore our menu and
              enjoy a selection of coffee, refreshing drinks, and delicious
              treats.
            </p>

            <Button variant="warning" href="#menu" className="mt-3 fw-semibold">
              Explore Our Menu
            </Button>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default AboutSection;
