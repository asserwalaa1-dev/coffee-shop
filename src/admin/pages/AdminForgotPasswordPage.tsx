import { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";

import { supabase } from "../../lib/supabase";

function AdminForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handlePasswordReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const { data, error } = await supabase.functions.invoke(
        "admin-password-reset",
        {
          body: {
            email: email.trim(),
            redirectTo: `${window.location.origin}/admin/reset-password`,
          },
        },
      );

      if (error) {
        throw error;
      }

      setMessage(data.message);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container className="py-5">
      <Card
        className="mx-auto p-4 bg-dark text-white"
        style={{ maxWidth: "450px" }}>
        <h2 className="text-center mb-2">Forgot Password?</h2>

        <p className="text-secondary text-center mb-4">
          Enter your email address and we'll send you a reset link.
        </p>

        {error && <Alert variant="danger">{error}</Alert>}
        {message && (
          <Alert
            variant={
              message.includes("not registered as an admin")
                ? "danger"
                : "success"
            }>
            {message}
          </Alert>
        )}
        <Form onSubmit={handlePasswordReset}>
          <Form.Group className="mb-3">
            <Form.Label>Email Address</Form.Label>

            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </Form.Group>

          <Button
            type="submit"
            variant="warning"
            className="w-100 fw-semibold"
            disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </Form>

        <div className="text-center mt-3">
          <Link to="/admin/login" className="text-warning text-decoration-none">
            Back to Login
          </Link>
        </div>
      </Card>
    </Container>
  );
}

export default AdminForgotPasswordPage;
