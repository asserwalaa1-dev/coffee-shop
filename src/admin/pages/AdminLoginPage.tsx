import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";

import { supabase } from "../../lib/supabase";

function AdminLoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (loginError) {
        setError("Invalid email or password.");
        return;
      }

      const { data: isAdmin, error: adminError } =
        await supabase.rpc("is_admin");

      if (adminError || !isAdmin) {
        await supabase.auth.signOut();
        setError("You don't have permission to access the dashboard.");
        return;
      }

      navigate("/admin");
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
        <h2 className="text-center mb-4">Admin Login</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        {message && <Alert variant="success">{message}</Alert>}

        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>

            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Password</Form.Label>

            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </Form.Group>

          <div className="text-end mb-3">
            <div className="text-end mb-3">
              <Link
                to="/admin/forgot-password"
                className="text-warning text-decoration-none">
                Forgot Password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            variant="warning"
            className="w-100 fw-semibold"
            disabled={loading}>
            {loading ? "Please wait..." : "Login"}
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default AdminLoginPage;
