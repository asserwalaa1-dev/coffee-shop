import { useRef } from "react";
import { Container, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import type { Product } from "../types/product";

interface ProductSectionProps {
  products: Product[];
}

function ProductSection({ products }: ProductSectionProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollSlider = (direction: "left" | "right") => {
    if (!sliderRef.current) return;

    sliderRef.current.scrollBy({
      left: direction === "right" ? 320 : -320,
      behavior: "smooth",
    });
  };

  return (
    <section id="menu" className="py-5 bg-dark text-white">
      <Container>
        <div className="text-center mb-5">
          <p className="text-warning text-uppercase fw-semibold">Our Menu</p>

          <h2 className="display-5 fw-bold rounded-circle border border-warning d-inline-block px-3 py-2">
            Explore Our Products
          </h2>

          <p className="text-white-50">
            Discover our selection of coffee and treats.
          </p>
        </div>

        {products.length === 0 ? (
          <p className="text-center text-white-50">
            Products will appear here.
          </p>
        ) : (
          <div className="d-flex align-items-center gap-3">
            <Button
              variant="outline-warning"
              className="d-none d-md-flex flex-shrink-0 rounded-circle align-items-center justify-content-center"
              style={{ width: "45px", height: "45px" }}
              onClick={() => scrollSlider("left")}
              aria-label="Previous products">
              &#8592;
            </Button>

            <div
              ref={sliderRef}
              className="d-flex gap-3 gap-md-4 overflow-auto pb-3 flex-grow-1"
              style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}>
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex-shrink-0"
                  style={{
                    width: "min(82vw, 300px)",
                    scrollSnapAlign: "center",
                  }}>
                  <Card className="h-100 bg-dark text-white border-secondary product-card">
                    <Card.Img
                      variant="top"
                      src={product.image_url}
                      alt={product.Name}
                      className="product-card-image"
                      style={{
                        height: "clamp(160px, 55vw, 220px)",
                        objectFit: "cover",
                      }}
                    />

                    <Card.Body className="d-flex flex-column">
                      <Card.Text className="text-warning fw-bold">
                        {product.category_name}
                      </Card.Text>

                      <Card.Title>{product.Name}</Card.Title>

                      <Card.Text className="text-white-50">
                        {product.description}
                      </Card.Text>

                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <strong className="text-warning">
                          {product.price} EGP
                        </strong>
                      </div>

                      <Link
                        to={`/products/${product.id}`}
                        className="btn bg-warning w-100 mt-3 fw-semibold">
                        View Details
                      </Link>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </div>

            <Button
              variant="outline-warning"
              className="d-none d-md-flex flex-shrink-0 rounded-circle align-items-center justify-content-center"
              style={{ width: "45px", height: "45px" }}
              onClick={() => scrollSlider("right")}
              aria-label="Next products">
              &#8594;
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
}

export default ProductSection;
