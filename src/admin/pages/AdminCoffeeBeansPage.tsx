import { useEffect, useState } from "react";

import {
  Container,
  Card,
  Table,
  Spinner,
  Alert,
  Button,
  Form,
} from "react-bootstrap";

import { supabase } from "../../lib/supabase";

// ==========================================
// Types
// ==========================================

interface CoffeeBean {
  id: number;
  Name: string;
  origin: string;
  roast_level: string;
  description: string;
  image_url: string;
}

// ==========================================
// Component
// ==========================================

function AdminCoffeeBeansPage() {
  const [coffeeBeans, setCoffeeBeans] = useState<CoffeeBean[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingBeanId, setEditingBeanId] = useState<number | null>(null);

  const [newBean, setNewBean] = useState({
    Name: "",
    origin: "",
    roast_level: "",
    description: "",
    image_url: "",
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formError, setFormError] = useState("");

  // ==========================================
  // Fetch Data
  // ==========================================

  useEffect(() => {
    fetchCoffeeBeans();
  }, []);

  async function fetchCoffeeBeans() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("coffee_beans")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Fetch Coffee Beans Error:", error);
      setError(error.message);
    } else {
      setCoffeeBeans(data ?? []);
    }

    setLoading(false);
  }

  // ==========================================
  // Reset Form
  // ==========================================

  function resetForm() {
    setNewBean({
      Name: "",
      origin: "",
      roast_level: "",
      description: "",
      image_url: "",
    });

    setSelectedImage(null);
    setEditingBeanId(null);
    setFormError("");
  }

  // ==========================================
  // Edit Coffee Bean
  // ==========================================

  function handleEditBean(bean: CoffeeBean) {
    setNewBean({
      Name: bean.Name,
      origin: bean.origin ?? "",
      roast_level: bean.roast_level ?? "",
      description: bean.description ?? "",
      image_url: bean.image_url ?? "",
    });

    setSelectedImage(null);
    setEditingBeanId(bean.id);
    setShowForm(true);

    setSuccessMessage("");
    setFormError("");
  }

  // ==========================================
  // Upload Image
  // ==========================================

  async function uploadBeanImage(): Promise<string | null> {
    if (!selectedImage) {
      return newBean.image_url;
    }

    setUploadingImage(true);

    try {
      const fileExtension = selectedImage.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExtension}`;

      const { error } = await supabase.storage
        .from("product-images")
        .upload(fileName, selectedImage);

      if (error) {
        throw error;
      }

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error("Image Upload Error:", error);

      setFormError(
        error instanceof Error ? error.message : JSON.stringify(error),
      );

      return null;
    } finally {
      setUploadingImage(false);
    }
  }

  // ==========================================
  // Add or Update Coffee Bean
  // ==========================================

  async function handleSaveBean() {
    setFormError("");
    setSuccessMessage("");

    if (
      !newBean.Name.trim() ||
      !newBean.origin.trim() ||
      !newBean.roast_level.trim()
    ) {
      setFormError("Please fill in all required fields.");
      return;
    }

    setSaving(true);

    try {
      const imageUrl = await uploadBeanImage();

      if (imageUrl === null) {
        return;
      }

      const beanData = {
        Name: newBean.Name.trim(),
        origin: newBean.origin.trim(),
        roast_level: newBean.roast_level.trim(),
        description: newBean.description.trim(),
        image_url: imageUrl,
      };

      if (editingBeanId !== null) {
        const { data, error } = await supabase
          .from("coffee_beans")
          .update(beanData)
          .eq("id", editingBeanId)
          .select()
          .single();

        if (error) {
          throw error;
        }

        setCoffeeBeans((previousBeans) =>
          previousBeans.map((bean) =>
            bean.id === editingBeanId ? data : bean,
          ),
        );

        setSuccessMessage("Coffee bean updated successfully!");
      } else {
        const { data, error } = await supabase
          .from("coffee_beans")
          .insert([beanData])
          .select()
          .single();

        if (error) {
          throw error;
        }

        setCoffeeBeans((previousBeans) => [...previousBeans, data]);

        setSuccessMessage("Coffee bean added successfully!");
      }

      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error("Coffee Bean Save Error:", error);

      if (error && typeof error === "object" && "message" in error) {
        setFormError(String(error.message));
      } else {
        setFormError(JSON.stringify(error));
      }
    } finally {
      setSaving(false);
    }
  }

  // ==========================================
  // Delete Coffee Bean
  // ==========================================

  async function handleDeleteBean(id: number) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this coffee bean?",
    );

    if (!confirmDelete) {
      return;
    }

    setFormError("");
    setSuccessMessage("");

    const { error } = await supabase.from("coffee_beans").delete().eq("id", id);

    if (error) {
      console.error("Delete Coffee Bean Error:", error);
      setFormError(error.message);
      return;
    }

    setCoffeeBeans((previousBeans) =>
      previousBeans.filter((bean) => bean.id !== id),
    );

    setSuccessMessage("Coffee bean deleted successfully!");
  }

  // ==========================================
  // Render UI
  // ==========================================

  return (
    <Container className="py-4">
      {/* Page Header */}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Coffee Beans Management</h2>

        <Button
          variant="success"
          onClick={() => {
            if (showForm) {
              setShowForm(false);
              resetForm();
            } else {
              resetForm();
              setShowForm(true);
            }
          }}>
          {showForm ? "Close Form" : "Add Coffee Bean"}
        </Button>
      </div>

      {/* Success Message */}

      {successMessage && (
        <Alert
          variant="success"
          dismissible
          onClose={() => setSuccessMessage("")}>
          {successMessage}
        </Alert>
      )}

      {/* Add / Edit Form */}

      {showForm && (
        <Card bg="dark" text="light" className="mb-4">
          <Card.Body>
            <Card.Title className="mb-3">
              {editingBeanId !== null
                ? "Edit Coffee Bean"
                : "Add New Coffee Bean"}
            </Card.Title>

            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Coffee Bean Name</Form.Label>

                <Form.Control
                  type="text"
                  placeholder="Enter coffee bean name"
                  value={newBean.Name}
                  onChange={(e) =>
                    setNewBean({ ...newBean, Name: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Origin</Form.Label>

                <Form.Control
                  type="text"
                  placeholder="Enter origin"
                  value={newBean.origin}
                  onChange={(e) =>
                    setNewBean({ ...newBean, origin: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Roast Level</Form.Label>

                <Form.Select
                  value={newBean.roast_level}
                  onChange={(e) =>
                    setNewBean({ ...newBean, roast_level: e.target.value })
                  }>
                  <option value="" disabled>
                    Select roast level
                  </option>

                  <option value="Light">Light</option>
                  <option value="Medium">Medium</option>
                  <option value="Medium Dark">Medium Dark</option>
                  <option value="Dark">Dark</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>

                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter coffee bean description"
                  value={newBean.description}
                  onChange={(e) =>
                    setNewBean({ ...newBean, description: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Coffee Bean Image</Form.Label>

                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const input = e.target as HTMLInputElement;
                    const file = input.files?.[0] ?? null;

                    setSelectedImage(file);
                  }}
                />

                {selectedImage && (
                  <div className="mt-2">
                    <small>Selected image: {selectedImage.name}</small>
                  </div>
                )}
              </Form.Group>

              {formError && <Alert variant="danger">{formError}</Alert>}

              <Button
                type="button"
                variant="success"
                onClick={handleSaveBean}
                disabled={saving || uploadingImage}>
                {uploadingImage
                  ? "Uploading Image..."
                  : saving
                    ? "Saving..."
                    : editingBeanId !== null
                      ? "Update Coffee Bean"
                      : "Save Coffee Bean"}
              </Button>

              {editingBeanId !== null && (
                <Button
                  type="button"
                  variant="secondary"
                  className="ms-2"
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                  disabled={saving}>
                  Cancel Edit
                </Button>
              )}
            </Form>
          </Card.Body>
        </Card>
      )}

      {/* Coffee Beans Table */}

      <Card bg="dark" text="light">
        <Card.Body>
          <Card.Title className="mb-3">All Coffee Beans</Card.Title>

          {loading && (
            <div className="text-center py-4">
              <Spinner animation="border" />
            </div>
          )}

          {error && <Alert variant="danger">{error}</Alert>}

          {!loading && !error && (
            <Table variant="dark" responsive hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Origin</th>
                  <th>Roast Level</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {coffeeBeans.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center">
                      No coffee beans found.
                    </td>
                  </tr>
                ) : (
                  coffeeBeans.map((bean) => (
                    <tr key={bean.id}>
                      <td>{bean.id}</td>
                      <td>{bean.Name}</td>
                      <td>{bean.origin}</td>
                      <td>{bean.roast_level}</td>

                      <td>
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-2 mb-1"
                          onClick={() => handleEditBean(bean)}>
                          Edit
                        </Button>

                        <Button
                          variant="danger"
                          size="sm"
                          className="mb-1"
                          onClick={() => handleDeleteBean(bean.id)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AdminCoffeeBeansPage;
