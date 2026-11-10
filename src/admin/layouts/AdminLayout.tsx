import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <div className="min-vh-100 bg-dark text-white">
      <Container className="py-4">
        <h3 className="mb-4">Brew & Bean Admin</h3>

        <Outlet />
      </Container>
    </div>
  );
}

export default AdminLayout;
