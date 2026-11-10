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

interface Product {
  id: number;
  Name: string;
  description: string;
  price: number | string;
  image_url: string;
  category_id: number;
  is_available: boolean;
}

interface Category {
  id: number;
  name: string;
}

// ==========================================
// Component
// ==========================================

function AdminProductsPage() {
  // ------------------------------------------
  // Products and Categories State
  // ------------------------------------------

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ------------------------------------------
  // Form State
  // ------------------------------------------

  const [showForm, setShowForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  const [newProduct, setNewProduct] = useState({
    Name: "",
    description: "",
    price: "",
    image_url: "",
    category_id: "",
    is_available: true,
  });

  // ------------------------------------------
  // Image Upload State
  // ------------------------------------------

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // ------------------------------------------
  // Save and Feedback State
  // ------------------------------------------

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formError, setFormError] = useState("");

  // ==========================================
  // Fetch Data on Component Mount
  // ==========================================

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // ==========================================
  // Fetch Products
  // ==========================================

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

  // ==========================================
  // Fetch Categories
  // ==========================================

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

  // ==========================================
  // Reset Form
  // ==========================================

  function resetForm() {
    setNewProduct({
      Name: "",
      description: "",
      price: "",
      image_url: "",
      category_id: "",
      is_available: true,
    });

    setSelectedImage(null);
    setEditingProductId(null);
    setFormError("");
  }

  // ==========================================
  // Open Form for Editing
  // ==========================================

  function handleEditProduct(product: Product) {
    setNewProduct({
      Name: product.Name,
      description: product.description ?? "",
      price: String(product.price),
      image_url: product.image_url ?? "",
      category_id: String(product.category_id),
      is_available: product.is_available,
    });

    setSelectedImage(null);
    setEditingProductId(product.id);
    setShowForm(true);

    setSuccessMessage("");
    setFormError("");
  }

  // ==========================================
  // Upload Product Image to Supabase Storage
  // ==========================================

  async function uploadProductImage(): Promise<string | null> {
    // Keep the existing image if no new image was selected.
    if (!selectedImage) {
      return newProduct.image_url;
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
      console.error(error);

      setFormError(
        error instanceof Error
          ? error.message
          : "Failed to upload product image.",
      );

      return null;
    } finally {
      setUploadingImage(false);
    }
  }

  // ==========================================
  // Add or Update Product
  // ==========================================

  async function handleSaveProduct() {
    // Validate required fields.
    if (
      !newProduct.Name.trim() ||
      !newProduct.price ||
      !newProduct.category_id
    ) {
      setFormError("Please fill in all required fields.");
      return;
    }

    if (Number(newProduct.price) <= 0) {
      setFormError("Price must be greater than zero.");
      return;
    }

    setSaving(true);
    setSuccessMessage("");
    setFormError("");

    try {
      // Upload the selected image before saving the product.
      const imageUrl = await uploadProductImage();

      if (imageUrl === null) {
        return;
      }

      // Prepare product data for Supabase.
      const productData = {
        Name: newProduct.Name.trim(),
        description: newProduct.description.trim(),
        price: Number(newProduct.price),
        image_url: imageUrl,
        category_id: Number(newProduct.category_id),
        is_available: newProduct.is_available,
      };

      // Update existing product.
      if (editingProductId !== null) {
        const { data, error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProductId)
          .select()
          .single();

        if (error) {
          throw error;
        }

        setProducts((previousProducts) =>
          previousProducts.map((product) =>
            product.id === editingProductId ? data : product,
          ),
        );

        setSuccessMessage("Product updated successfully!");
      } else {
        // Insert new product.
        const { data, error } = await supabase
          .from("products")
          .insert([productData])
          .select()
          .single();

        if (error) {
          throw error;
        }

        setProducts((previousProducts) => [...previousProducts, data]);

        setSuccessMessage("Product added successfully!");
      }

      // Clear the form after a successful save.
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error(error);

      setFormError(
        error instanceof Error
          ? error.message
          : "Something went wrong while saving the product.",
      );
    } finally {
      setSaving(false);
    }
  }

  // ==========================================
  // Delete Product
  // ==========================================

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

    // Remove deleted product from the UI.
    setProducts((previousProducts) =>
      previousProducts.filter((product) => product.id !== id),
    );

    setSuccessMessage("Product deleted successfully!");
    setFormError("");
  }

  // ==========================================
  // Render UI
  // ==========================================

  return (
    <Container className="py-4">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Products Management</h2>

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
          {showForm ? "Close Form" : "Add Product"}
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

      {/* Add / Edit Product Form */}
      {showForm && (
        <Card bg="dark" text="light" className="mb-4">
          <Card.Body>
            <Card.Title className="mb-3">
              {editingProductId !== null ? "Edit Product" : "Add New Product"}
            </Card.Title>

            <Form>
              {/* Product Name */}
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

              {/* Product Description */}
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

              {/* Product Price */}
              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>

                <Form.Control
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="Enter price"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                />
              </Form.Group>

              {/* Product Image Upload */}
              <Form.Group className="mb-3">
                <Form.Label>Product Image</Form.Label>

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

              {/* Product Category */}
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

              {/* Product Availability */}
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

              {/* Form Error */}
              {formError && <Alert variant="danger">{formError}</Alert>}

              {/* Save Button */}
              <Button
                type="button"
                variant="success"
                onClick={handleSaveProduct}
                disabled={saving || uploadingImage}>
                {uploadingImage
                  ? "Uploading Image..."
                  : saving
                    ? "Saving..."
                    : editingProductId !== null
                      ? "Update Product"
                      : "Save Product"}
              </Button>

              {/* Cancel Edit Button */}
              {editingProductId !== null && (
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

      {/* Products Table */}
      <Card bg="dark" text="light">
        <Card.Body>
          <Card.Title className="mb-3">All Products</Card.Title>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-4">
              <Spinner animation="border" />
            </div>
          )}

          {/* Fetch Error */}
          {error && <Alert variant="danger">{error}</Alert>}

          {/* Products List */}
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
                          variant="warning"
                          size="sm"
                          className="me-2 mb-1"
                          onClick={() => handleEditProduct(product)}>
                          Edit
                        </Button>

                        <Button
                          variant="danger"
                          size="sm"
                          className="mb-1"
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
