import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";

import { supabase } from "../lib/supabase";

function ReservationPage() {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [reservationDate, setReservationDate] = useState("");
  const [reservationTime, setReservationTime] = useState("");
  const [guestsCount, setGuestsCount] = useState("2");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "danger">(
    "success",
  );

  const today = new Date();

  const minDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  function validateReservation() {
    const phoneRegex = /^01[0125][0-9]{8}$/;

    if (customerName.trim().length < 2) {
      return "Please enter a valid name.";
    }

    if (!phoneRegex.test(customerPhone.trim())) {
      return "Please enter a valid Egyptian phone number.";
    }

    if (reservationDate < minDate) {
      return "Please select today or a future date.";
    }

    if (reservationDate === minDate) {
      const selectedDateTime = new Date(
        `${reservationDate}T${reservationTime}`,
      );

      if (selectedDateTime <= new Date()) {
        return "Please select a future time.";
      }
    }

    const guests = Number(guestsCount);

    if (!Number.isInteger(guests) || guests < 1 || guests > 100) {
      return "Number of guests must be between 1 and 100.";
    }

    return null;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setMessage("");

    const validationError = validateReservation();

    if (validationError) {
      setMessage(validationError);
      setMessageType("danger");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.rpc(
        "create_reservation_with_tables",
        {
          p_customer_name: customerName.trim(),
          p_customer_phone: customerPhone.trim(),
          p_reservation_date: reservationDate,
          p_reservation_time: reservationTime,
          p_guests_count: Number(guestsCount),
        },
      );

      if (error) throw error;

      const result = Array.isArray(data) ? data[0] : data;

      if (!result) {
        throw new Error("No reservation response received.");
      }

      if (result.reservation_status === "confirmed") {
        setMessage(
          `Thank you, ${customerName.trim()}! Your table has been successfully reserved. We look forward to welcoming you at Brew & Bean. Your booking reference is #${result.reservation_id}.`,
        );

        setMessageType("success");

        setCustomerName("");
        setCustomerPhone("");
        setReservationDate("");
        setReservationTime("");
        setGuestsCount("2");
      } else {
        setMessage(
          "We're sorry, but all tables are currently reserved for your selected time. Please choose another date or time, and we'll be happy to welcome you.",
        );

        setMessageType("danger");
      }
    } catch (error) {
      console.error("Reservation error:", error);

      setMessage(
        "We couldn't complete your reservation right now. Please try again in a few moments. If the problem continues, contact us directly.",
      );

      setMessageType("danger");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-dark text-white min-vh-100 py-5">
      <Container>
        <Row className="justify-content-center mb-4">
          <Col lg={8} className="text-center">
            <p className="text-warning fw-semibold text-uppercase">
              Your Table Is Waiting
            </p>

            <h1 className="display-4 fw-bold mb-3">Reserve Your Table</h1>

            <p className="text-white-50">
              Book your perfect coffee experience with us.
            </p>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col lg={7} md={9}>
            <Card className="bg-dark text-white border-secondary shadow-lg">
              <Card.Body className="p-4 p-md-5">
                <h3 className="fw-bold mb-4">Reservation Details</h3>

                {message && (
                  <Alert variant={messageType} className="mb-4">
                    {message}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-warning">Full Name</Form.Label>

                    <Form.Control
                      type="text"
                      placeholder="Enter your full name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      minLength={2}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="text-warning">
                      Phone Number
                    </Form.Label>

                    <Form.Control
                      type="tel"
                      placeholder="01xxxxxxxxx"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                      maxLength={11}
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-warning">
                          Reservation Date
                        </Form.Label>

                        <Form.Control
                          type="date"
                          min={minDate}
                          value={reservationDate}
                          onChange={(e) => setReservationDate(e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-warning">
                          Reservation Time
                        </Form.Label>

                        <Form.Control
                          type="time"
                          value={reservationTime}
                          onChange={(e) => setReservationTime(e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Label className="text-warning">
                      Number of Guests
                    </Form.Label>

                    <Form.Control
                      type="number"
                      min="1"
                      max="100"
                      step="1"
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(e.target.value)}
                      required
                    />

                    <Form.Text className="text-white-50">
                      Each table accommodates up to 5 guests.
                    </Form.Text>
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="outline-warning"
                    className="w-100 fw-semibold py-3"
                    disabled={loading}>
                    {loading ? (
                      <>
                        <Spinner
                          size="sm"
                          animation="border"
                          className="me-2"
                        />
                        Processing Reservation...
                      </>
                    ) : (
                      "Confirm Reservation"
                    )}
                  </Button>

                  <p className="text-white-50 text-center small mt-3 mb-0">
                    Reservations are automatically confirmed when tables are
                    available.
                  </p>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default ReservationPage;
