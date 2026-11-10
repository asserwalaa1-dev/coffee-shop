import { useEffect, useState } from "react";

import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Badge,
  Alert,
} from "react-bootstrap";

import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
function AdminDashboardPage() {
  const navigate = useNavigate();
  const [totalReservations, setTotalReservations] = useState<number | null>(
    null,
  );
  const [pendingReservations, setPendingReservations] = useState<number | null>(
    null,
  );
  const [totalProducts, setTotalProducts] = useState<number | null>(null);
  const [totalCoffeeBeans, setTotalCoffeeBeans] = useState<number | null>(null);
  const [recentReservations, setRecentReservations] = useState<any[]>([]);

  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState(false);
  const [confirmedReservations, setConfirmedReservations] = useState<
    number | null
  >(null);
  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    const { count: reservationsCount } = await supabase
      .from("reservations")
      .select("*", { count: "exact", head: true });

    setTotalReservations(reservationsCount ?? 0);
    const { count: confirmedCount } = await supabase
      .from("reservations")
      .select("*", { count: "exact", head: true })
      .eq("status", "confirmed");

    setConfirmedReservations(confirmedCount ?? 0);
    const { count: pendingCount } = await supabase
      .from("reservations")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    setPendingReservations(pendingCount ?? 0);

    const { count: productsCount } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });

    setTotalProducts(productsCount ?? 0);

    const { count: beansCount } = await supabase
      .from("coffee_beans")
      .select("*", { count: "exact", head: true });

    setTotalCoffeeBeans(beansCount ?? 0);

    const { data, error } = await supabase
      .from("reservations")
      .select(
        "id, customer_name, reservation_date, reservation_time, guests_count, status",
      )
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      console.error("Fetch reservations error:", error);
      return;
    }

    setRecentReservations(data ?? []);
  }

  async function handleConfirmReservation(id: number) {
    setActionMessage("");
    setActionError(false);

    const { error } = await supabase
      .from("reservations")
      .update({ status: "confirmed" })
      .eq("id", id);

    if (error) {
      console.error(error);
      setActionMessage("Failed to confirm reservation. Please try again.");
      setActionError(true);
      return;
    }

    setRecentReservations((previousReservations) =>
      previousReservations.map((reservation) =>
        reservation.id === id
          ? { ...reservation, status: "confirmed" }
          : reservation,
      ),
    );

    setPendingReservations((previousCount) =>
      Math.max((previousCount ?? 0) - 1, 0),
    );

    setActionMessage("Reservation confirmed successfully.");
  }

  async function handleCancelReservation(id: number, currentStatus: string) {
    setActionMessage("");
    setActionError(false);

    const { error } = await supabase
      .from("reservations")
      .update({ status: "cancelled" })
      .eq("id", id);

    if (error) {
      console.error(error);
      setActionMessage("Failed to cancel reservation. Please try again.");
      setActionError(true);
      return;
    }

    setRecentReservations((previousReservations) =>
      previousReservations.map((reservation) =>
        reservation.id === id
          ? { ...reservation, status: "cancelled" }
          : reservation,
      ),
    );

    if (currentStatus === "pending") {
      setPendingReservations((previousCount) =>
        Math.max((previousCount ?? 0) - 1, 0),
      );
    }

    setActionMessage("Reservation cancelled successfully.");
  }

  async function handleDeleteReservation(id: number) {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this reservation?",
    );

    if (!confirmDelete) {
      return;
    }

    setActionMessage("");
    setActionError(false);

    console.log("Starting delete:", id);

    // Delete table assignments
    const { data: assignments, error: assignmentsError } = await supabase
      .from("reservation_tables")
      .delete()
      .eq("reservation_id", id)
      .select();
    console.log(assignments);

    if (assignmentsError) {
      console.error(assignmentsError);
      setActionMessage("Assignment Error: " + assignmentsError.message);
      setActionError(true);
      return;
    }

    // Delete reservation
    const { data, error } = await supabase
      .from("reservations")
      .delete()
      .eq("id", id)
      .select();

    if (error) {
      console.error(error);
      setActionMessage("Reservation Error: " + error.message);
      setActionError(true);
      return;
    }

    if (!data || data.length === 0) {
      setActionMessage(
        "No reservation was deleted. Check your database permissions.",
      );
      setActionError(true);
      return;
    }

    // Update dashboard
    setRecentReservations((previousReservations) =>
      previousReservations.filter((reservation) => reservation.id !== id),
    );

    setTotalReservations((previousCount) =>
      Math.max((previousCount ?? 0) - 1, 0),
    );

    setActionMessage("Reservation deleted successfully.");
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Admin Dashboard</h2>

        <Button variant="success" onClick={() => navigate("/admin/products")}>
          Add Product
        </Button>
      </div>
      {actionMessage && (
        <Alert
          variant={actionError ? "danger" : "success"}
          dismissible
          onClose={() => setActionMessage("")}>
          {actionMessage}
        </Alert>
      )}

      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card className="h-100 bg-dark text-light">
            <Card.Body>
              <Card.Title>Total Reservations</Card.Title>
              <h3>{totalReservations ?? "..."}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="h-100 bg-dark text-light">
            <Card.Body>
              <Card.Title>Pending Reservations</Card.Title>
              <h3>{pendingReservations ?? "..."}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="h-100 bg-dark text-light">
            <Card.Body>
              <Card.Title>Confirmed Reservations</Card.Title>
              <h3>{confirmedReservations ?? "..."}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100 bg-dark text-light">
            <Card.Body>
              <Card.Title>Total Products</Card.Title>
              <h3>{totalProducts ?? "..."}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="h-100 bg-dark text-light">
            <Card.Body>
              <Card.Title>Coffee Beans</Card.Title>
              <h3>{totalCoffeeBeans ?? "..."}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card bg="dark" text="light">
        <Card.Body>
          <Card.Title className="mb-3">Recent Reservations</Card.Title>

          <Table variant="dark">
            <thead>
              <tr>
                <th className="">Customer</th>
                <th>Date & Time</th>
                <th>Guests</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentReservations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center">
                    No reservations found.
                  </td>
                </tr>
              ) : (
                recentReservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <td>{reservation.customer_name}</td>

                    <td>
                      {reservation.reservation_date}
                      {reservation.reservation_time}
                    </td>

                    <td>{reservation.guests_count}</td>

                    <td>
                      <Badge
                        bg={
                          reservation.status === "pending"
                            ? "warning"
                            : reservation.status === "confirmed"
                              ? "success"
                              : "secondary"
                        }>
                        {reservation.status}
                      </Badge>
                    </td>

                    <td>
                      {reservation.status === "pending" && (
                        <Button
                          variant="success"
                          size="sm"
                          className="me-2 mb-1"
                          onClick={() =>
                            handleConfirmReservation(reservation.id)
                          }>
                          Confirm
                        </Button>
                      )}

                      {reservation.status !== "cancelled" && (
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-2 mb-1"
                          onClick={() =>
                            handleCancelReservation(
                              reservation.id,
                              reservation.status,
                            )
                          }>
                          Cancel
                        </Button>
                      )}

                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="mb-1"
                        onClick={() => handleDeleteReservation(reservation.id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AdminDashboardPage;
