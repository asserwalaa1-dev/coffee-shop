import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";

import { getCoffeeBeanById } from "../services/coffeeBeanService";
import type { CoffeeBean } from "../types/coffeeBean";

function CoffeeBeanDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const [coffeeBean, setCoffeeBean] = useState<CoffeeBean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCoffeeBean() {
      try {
        if (!id || isNaN(Number(id))) {
          setError("Coffee bean not found");
          return;
        }

        const data = await getCoffeeBeanById(Number(id));

        if (!data) {
          setError("Coffee bean not found");
          return;
        }

        setCoffeeBean(data);
      } catch {
        setError("Failed to load coffee bean details");
      } finally {
        setLoading(false);
      }
    }

    loadCoffeeBean();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="warning" />
      </div>
    );
  }

  if (error || !coffeeBean) {
    return (
      <Container className="text-center py-5 text-white">
        <h2>{error || "Coffee bean not found"}</h2>

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
            src={coffeeBean.image_url}
            alt={coffeeBean.name}
            className="img-fluid rounded-3 w-100"
          />
        </Col>

        <Col md={6}>
          <p className="text-warning fw-bold text-uppercase">
            {coffeeBean.origin}
          </p>

          <h1 className="display-4 fw-bold">{coffeeBean.name}</h1>

          <p className="text-white-50">Roast Level: {coffeeBean.roast_level}</p>

          <p className="text-white-50 fs-5">{coffeeBean.description}</p>

          <hr className="border-secondary" />

          <h4 className="fw-bold mb-3">Available Variants</h4>

          {coffeeBean.variants.length > 0 ? (
            coffeeBean.variants.map((variant) => (
              <div
                key={variant.id}
                className="d-flex justify-content-between mb-3">
                <span>{variant.weight} g</span>

                <strong className="text-warning">{variant.price} EGP</strong>
              </div>
            ))
          ) : (
            <p className="text-white-50">No variants available.</p>
          )}

          <Button
            variant="warning"
            className="w-100 mt-3 fw-semibold"
            as="a"
            href={`https://wa.me/201099495963?text=${encodeURIComponent(
              `Hello, I'm interested in ${coffeeBean.name} coffee beans.`,
            )}`}
            target="_blank"
            rel="noreferrer">
            Order via WhatsApp
          </Button>

          <Link to="/" className="btn btn-outline-warning w-100 mt-3">
            Back to Menu
          </Link>
        </Col>
      </Row>
    </Container>
  );
}

export default CoffeeBeanDetailsPage;
