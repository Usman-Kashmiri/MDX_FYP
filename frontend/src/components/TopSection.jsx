import React from "react";
import { Breadcrumb, Col, Container, Row } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

const TopSection = ({ sectionClass, topSpan, heading, activePage }) => {
  const location = useLocation();

  return (
    <section
      className={`top-section ${sectionClass} d-flex justify-content-center align-items-center`}
    >
      <Container>
        <Row>
          <Col xs={12}>
            <div className="content">
              <div className="text-center">
                <span className="font-lora fst-italic text-capitalize">
                  {topSpan}
                </span>
                <h2 className="text-uppercase fw-bold text-white mt-4">
                  {heading}
                </h2>
              </div>
              <div className="breadcrumbs position-relative d-flex justify-content-center mt-3">
                <Breadcrumb>
                  <Link to="/" className="breadcrumb-item">
                    Home
                  </Link>
                  {location.pathname === "/practice-area" && (
                    <Link to="/practice-areas" className="breadcrumb-item">
                      Practice Areas
                    </Link>
                  )}
                  <Link
                    active="true"
                    className="breadcrumb-item text-capitalize"
                  >
                    {activePage}
                  </Link>
                </Breadcrumb>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default TopSection;
