import { Container, Nav, Navbar as BootstrapNavbar } from "react-bootstrap";
import { Link } from "react-router-dom";
interface NavbarProps {
  cafeName: string | null;
  whatsappUrl: string | null;
}

function Navbar({ cafeName }: NavbarProps) {
  return (
    <BootstrapNavbar expand="lg" variant="dark" className="bg-dark py-3">
      <Container>
        <BootstrapNavbar.Brand
          href="/"
          className="fw-bolder fs-1 text-warning border border-warning rounded px-3 py-2 brand-hover">
          {cafeName || "BREW & BEAN"}
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="main-navbar" />

        <BootstrapNavbar.Collapse id="main-navbar">
          <Nav className="ms-auto align-items-lg-center gap-lg-3 fs-5">
            {["Home", "Menu", "Coffee Beans", "About Us", "Contact"].map(
              (item, index) => {
                const links = ["/", "#menu", "#beans", "#about", "#contact"];

                return (
                  <Nav.Link
                    key={item}
                    href={links[index]}
                    className="text-white nav-hover">
                    {item}
                  </Nav.Link>
                );
              },
            )}

            <Nav.Link
              as={Link}
              to="/reservation"
              className="btn bg-warning text-dark fw-semibold reserve-hover px-3">
              Reserve a Table
            </Nav.Link>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

export default Navbar;
