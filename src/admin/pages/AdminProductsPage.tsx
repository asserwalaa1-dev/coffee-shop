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

interface Product {
  id: number;
  Name: string;
  description: string;
  price: string;
  image_url: string;
  category_id: number;
  is_available: boolean;
}

interface Category {
  id: number;
  name: string;
}

function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [newProduct, setNewProduct] = useState({
    Name: "",
    description: "",
    price: "",
    image_url: "",
    category_id: "",
    is_available: true,
  });
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formError, setFormError] = useState("");
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  async function fetchProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error(error);
      setError("Failed to load products.");
    } else {
      setProducts(data ?? []);
    }

    setLoading(false);
  }

  async function fetchCategories() {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name")
      .order("id", { ascending: true });

    if (error) {
      console.error(error);
      setError("Failed to load categories.");
    } else {
      setCategories(data ?? []);
    }
  }

  async function handleAddProduct() {
    setSaving(true);
    setSuccessMessage("");
    setFormError("");

    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          Name: newProduct.Name.trim(),
          description: newProduct.description.trim(),
          price: Number(newProduct.price),
          image_url: newProduct.image_url.trim(),
          category_id: Number(newProduct.category_id),
          is_available: newProduct.is_available,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error(error);
      setFormError(error.message);
      setSaving(false);
      return;
    }

    setProducts((previousProducts) => [...previousProducts, data]);

    setNewProduct({
      Name: "",
      description: "",
      price: "",
      image_url: "",
      category_id: "",
      is_available: true,
    });

    setSuccessMessage("Product added successfully!");
    setSaving(false);
  }
  async function handleDeleteProduct(id: number) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmDelete) {
      return;
    }

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      console.error(error);
      setFormError(error.message);
      return;
    }

    setProducts((previousProducts) =>
      previousProducts.filter((product) => product.id !== id),
    );

    setSuccessMessage("Product deleted successfully!");
    setFormError("");
  }
  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Products Management</h2>

        <Button variant="success" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Close Form" : "Add Product"}
        </Button>
      </div>

      {showForm && (
        <Card bg="dark" text="light" className="mb-4">
          <Card.Body>
            <Card.Title className="mb-3">Add New Product</Card.Title>

            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter product name"
                  value={newProduct.Name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, Name: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter product description"
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter price"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Image URL</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter image URL"
                  value={newProduct.image_url}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, image_url: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={newProduct.category_id}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      category_id: e.target.value,
                    })
                  }>
                  <option value="" disabled>
                    Select category
                  </option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Product is available"
                  checked={newProduct.is_available}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      is_available: e.target.checked,
                    })
                  }
                />
              </Form.Group>

              <Button
                type="button"
                variant="success"
                onClick={handleAddProduct}
                disabled={saving}>
                {saving ? "Saving..." : "Save Product"}
              </Button>
              {successMessage && (
                <Alert variant="success" className="mt-3">
                  {successMessage}
                </Alert>
              )}

              {formError && (
                <Alert variant="danger" className="mt-3">
                  {formError}
                </Alert>
              )}
            </Form>
          </Card.Body>
        </Card>
      )}

      <Card bg="dark" text="light">
        <Card.Body>
          <Card.Title className="mb-3">All Products</Card.Title>

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
                  <th>Price</th>
                  <th>Category</th>
                  <th>Availability</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.Name}</td>
                      <td>{product.price}</td>
                      <td>
                        {categories.find(
                          (category) => category.id === product.category_id,
                        )?.name ?? "Unknown"}
                      </td>
                      <td>
                        {product.is_available ? "Available" : "Unavailable"}
                      </td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}>
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

export default AdminProductsPage;
