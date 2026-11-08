import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Spinner } from "react-bootstrap";

import { getProductById } from "../services/productService";
import type { Product } from "../types/product";

function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        if (!id || isNaN(Number(id))) {
          setError("Product not found");
          return;
        }

        const data = await getProductById(Number(id));

        if (!data) {
          setError("Product not found");
          return;
        }

        setProduct(data);
      } catch {
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="warning" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <Container className="text-center py-5 text-white">
        <h2>{error || "Product not found"}</h2>
        <Link to="/" className="btn btn-warning mt-3">
          Back to Home
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-5 text-white">
      <Row className="align-items-center g-5">
        <Col md={6}>
          <img
            src={product.image_url}
            alt={product.Name}
            className="img-fluid rounded-3 w-100"
          />
        </Col>

        <Col md={6}>
          <p className="text-warning fw-bold text-uppercase">
            {product.category_name}
          </p>

          <h1 className="display-4 fw-bold">{product.Name}</h1>

          <p className="text-white-50 fs-5">{product.description}</p>

          <h3 className="text-warning mb-4">{product.price} EGP</h3>

          <Link to="/" className="btn btn-outline-warning">
            Back to Menu
          </Link>
        </Col>
      </Row>
    </Container>
  );
}

export default ProductDetailsPage;
