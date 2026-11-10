import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";

import { supabase } from "../../lib/supabase";

function AdminResetPasswordPage() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleResetPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    navigate("/admin/login");
  }

  return (
    <Container className="py-5">
      <Card
        className="mx-auto p-4 bg-dark text-white"
        style={{ maxWidth: "450px" }}>
        <h2 className="text-center mb-4">Reset Password</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleResetPassword}>
          <Form.Group className="mb-3">
            <Form.Label>New Password</Form.Label>

            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Confirm Password</Form.Label>

            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
            />
          </Form.Group>

          <Button
            type="submit"
            variant="warning"
            className="w-100 fw-semibold"
            disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default AdminResetPasswordPage;
