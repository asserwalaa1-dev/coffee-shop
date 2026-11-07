import { useRef } from "react";
import { Container, Card, Button } from "react-bootstrap";

import type { CoffeeBean } from "../types/coffeeBean";

interface CoffeeBeanSectionProps {
  coffeeBeans: CoffeeBean[];
}

function CoffeeBeanSection({ coffeeBeans }: CoffeeBeanSectionProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollSlider = (direction: "left" | "right") => {
    if (!sliderRef.current) return;

    sliderRef.current.scrollBy({
      left: direction === "right" ? 320 : -320,
      behavior: "smooth",
    });
  };

  return (
    <section id="beans" className="bg-black text-white py-5">
      <Container>
        <div className="text-center mb-5">
          <p className="text-warning fw-semibold text-uppercase">
            Premium Coffee Beans
          </p>

          <h2 className="display-5 fw-bold">Explore Our Coffee Beans</h2>

          <p className="text-white-50">
            Discover our selection of premium coffee beans.
          </p>
        </div>

        {coffeeBeans.length === 0 ? (
          <p className="text-center text-white-50">
            No coffee beans available.
          </p>
        ) : (
          <div className="d-flex align-items-center gap-3">
            {/* Previous Button */}
            <Button
              variant="outline-warning"
              className="flex-shrink-0 rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: "45px", height: "45px" }}
              onClick={() => scrollSlider("left")}
              aria-label="Previous coffee beans">
              &#8592;
            </Button>

            {/* Coffee Beans Slider */}
            <div
              ref={sliderRef}
              className="d-flex gap-4 overflow-auto pb-3 flex-grow-1"
              style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}>
              {coffeeBeans.map((bean) => (
                <div
                  key={bean.id}
                  className="flex-shrink-0"
                  style={{ width: "300px", scrollSnapAlign: "start" }}>
                  <Card className="h-100 bg-dark text-white border-secondary">
                    <Card.Img
                      variant="top"
                      src={bean.image_url}
                      alt={bean.name}
                      style={{ height: "220px", objectFit: "cover" }}
                    />

                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="fw-bold">{bean.name}</Card.Title>

                      <p className="text-warning mb-2">{bean.origin}</p>

                      <p className="text-white-50 small">
                        Roast: {bean.roast_level}
                      </p>

                      <Card.Text className="text-white-50">
                        {bean.description}
                      </Card.Text>

                      <hr className="border-secondary" />

                      <h6 className="fw-bold mb-3">Available Variants</h6>

                      {bean.variants.length > 0 ? (
                        bean.variants.map((variant) => (
                          <div
                            key={variant.id}
                            className="d-flex justify-content-between mb-2">
                            <span>{variant.weight} g</span>

                            <strong className="text-warning">
                              {variant.price} EGP
                            </strong>
                          </div>
                        ))
                      ) : (
                        <p className="text-white-50 small">
                          No variants available.
                        </p>
                      )}

                      <Button
                        variant="warning"
                        className="w-100 mt-auto fw-semibold"
                        href="#contact">
                        Inquire on WhatsApp
                      </Button>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </div>

            {/* Next Button */}
            <Button
              variant="outline-warning"
              className="flex-shrink-0 rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: "45px", height: "45px" }}
              onClick={() => scrollSlider("right")}
              aria-label="Next coffee beans">
              &#8594;
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
}

export default CoffeeBeanSection;
