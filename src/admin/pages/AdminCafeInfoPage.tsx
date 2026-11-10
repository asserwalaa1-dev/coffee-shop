import { useEffect, useState } from "react";

import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";

import { supabase } from "../../lib/supabase";

interface CafeInfo {
  id: number;
  Name: string;
  address: string;
  phone: string;
  opening_hours: string;
  instagram_url: string;
  facebook_url: string;
  whatsapp_url: string;
}

function AdminCafeInfoPage() {
  const [cafeInfo, setCafeInfo] = useState<CafeInfo | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchCafeInfo();
  }, []);

  const fetchCafeInfo = async () => {
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("cafe_info")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      setErrorMessage(error.message);
    } else if (data) {
      setCafeInfo(data as CafeInfo);
    } else {
      setErrorMessage("No cafe information found in the database.");
    }

    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!cafeInfo) return;

    setSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    const { error } = await supabase
      .from("cafe_info")
      .update({
        Name: cafeInfo.Name,
        address: cafeInfo.address,
        phone: cafeInfo.phone,
        opening_hours: cafeInfo.opening_hours,
        instagram_url: cafeInfo.instagram_url,
        facebook_url: cafeInfo.facebook_url,
        whatsapp_url: cafeInfo.whatsapp_url,
      })
      .eq("id", cafeInfo.id);

    if (error) {
      setErrorMessage(error.message);
    } else {
      setSuccessMessage("Cafe information updated successfully!");
    }

    setSaving(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setCafeInfo((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="light" />
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4">Cafe Info Management</h2>

      {successMessage && (
        <Alert
          variant="success"
          dismissible
          onClose={() => setSuccessMessage("")}>
          {successMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert variant="danger" dismissible onClose={() => setErrorMessage("")}>
          {errorMessage}
        </Alert>
      )}

      {cafeInfo && (
        <Card bg="dark" text="light" className="p-4">
          <Form onSubmit={handleSave}>
            <Form.Group className="mb-3">
              <Form.Label>Cafe Name</Form.Label>
              <Form.Control
                type="text"
                name="Name"
                value={cafeInfo.Name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="address"
                value={cafeInfo.address}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={cafeInfo.phone}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Opening Hours</Form.Label>
              <Form.Control
                type="text"
                name="opening_hours"
                value={cafeInfo.opening_hours}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Instagram URL</Form.Label>
              <Form.Control
                type="url"
                name="instagram_url"
                value={cafeInfo.instagram_url}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Facebook URL</Form.Label>
              <Form.Control
                type="url"
                name="facebook_url"
                value={cafeInfo.facebook_url}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>WhatsApp URL</Form.Label>
              <Form.Control
                type="url"
                name="whatsapp_url"
                value={cafeInfo.whatsapp_url}
                onChange={handleChange}
              />
            </Form.Group>

            <Button type="submit" variant="success" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </Form>
        </Card>
      )}
    </Container>
  );
}

export default AdminCafeInfoPage;
