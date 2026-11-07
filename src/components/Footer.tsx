import { Container, Row, Col, Nav } from "react-bootstrap";
import type { CafeInfo } from "../types/cafeInfo";

interface FooterProps {
  cafeInfo: CafeInfo | null;
}

function Footer({ cafeInfo }: FooterProps) {
  return (
    <footer className="bg-black text-white py-5" id="contact">
      <Container>
        <Row className="g-4">
          <Col md={4}>
            <h3 className="fw-bold">
              {cafeInfo?.Name || "BREW"}{" "}
              <span className="text-warning">& BEAN</span>
            </h3>
            <p className="text-white-50 mt-3">
              Your daily coffee experience. Made with passion, served with care.
            </p>
          </Col>

          <Col md={4}>
            <h5 className="fw-bold mb-3">Quick Links</h5>
            <Nav className="flex-column">
              <Nav.Link href="/" className="text-white-50 ps-0">
                Home
              </Nav.Link>
              <Nav.Link href="#menu" className="text-white-50 ps-0">
                Menu
              </Nav.Link>
              <Nav.Link href="#beans" className="text-white-50 ps-0">
                Coffee Beans
              </Nav.Link>
              <Nav.Link href="#about" className="text-white-50 ps-0">
                About Us
              </Nav.Link>
            </Nav>
          </Col>

          <Col md={4}>
            <h5 className="fw-bold mb-3">Contact Us</h5>
            <p className="text-white-50">
              Phone: {cafeInfo?.phone || "Not available"}
            </p>
            <p className="text-white-50">
              Address: {cafeInfo?.address || "Not available"}
            </p>
            <p className="text-white-50">
              Opening Hours: {cafeInfo?.opening_hours || "Not available"}
            </p>

            {cafeInfo?.whatsapp_url && (
              <a
                href={cafeInfo.whatsapp_url}
                target="_blank"
                rel="noreferrer"
                className="text-warning me-3">
                WhatsApp
              </a>
            )}

            {cafeInfo?.instagram_url && (
              <a
                href={cafeInfo.instagram_url}
                target="_blank"
                rel="noreferrer"
                className="text-warning me-3">
                Instagram
              </a>
            )}

            {cafeInfo?.facebook_url && (
              <a
                href={cafeInfo.facebook_url}
                target="_blank"
                rel="noreferrer"
                className="text-warning">
                Facebook
              </a>
            )}
          </Col>
        </Row>

        <hr className="border-secondary my-4" />

        <p className="text-center text-white-50 mb-0">
          © {new Date().getFullYear()} {cafeInfo?.Name || "Brew & Bean"}. All
          rights reserved.
        </p>
      </Container>
    </footer>
  );
}

export default Footer;
