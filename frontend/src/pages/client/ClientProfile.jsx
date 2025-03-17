import React, { useState } from "react";
import { Col, Container, ProgressBar, Row } from "react-bootstrap";
import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";
import Ratings from "../../components/Ratings";
import Fade from "react-reveal/Fade";

const ClientProfile = () => {
  const [userData] = useState(JSON.parse(localStorage.getItem("user")));

  function calculateAge(dob) {
    const birthDate = new Date(dob);
    const currentDate = new Date();

    const yearsDiff = currentDate.getFullYear() - birthDate.getFullYear();
    const monthsDiff = currentDate.getMonth() - birthDate.getMonth();
    const daysDiff = currentDate.getDate() - birthDate.getDate();

    // Adjust age if the birthdate month and day haven't occurred yet this year
    if (monthsDiff < 0 || (monthsDiff === 0 && daysDiff < 0)) {
      return yearsDiff - 1;
    }

    return yearsDiff;
  }

  return (
    <>
      <Fade>
        <div>
          <Header />

          <section className="user-profile mt-md-5 mt-3">
            <Container className="py-5 px-4">
              <Row>
                <Col
                  xs={12}
                  className="grey-container users-details-container py-md-5 px-md-5 px-3 py-4"
                >
                  <Row>
                    <Col lg={7}>
                      <Row className="justify-content-center">
                        <Col
                          sm={4}
                          xs={6}
                          className="d-flex justify-content-md-start justify-content-center p-lg-0 p-md-3"
                        >
                          <img
                            src={userData?.image}
                            alt="user"
                            className="user-profile-pic rounded-circle"
                          />
                        </Col>
                        <Col
                          sm={8}
                          xs={12}
                          className="d-flex flex-column align-items-start justify-content-center ps-md-5 ps-3 py-md-0 py-3"
                        >
                          <h2 className="username font-montserrat text-text-uppercase">
                            {userData?.first_name + " " + userData?.last_name}
                          </h2>
                          <span className="designation-heading font-poppins text-primary-color">
                            Designation
                          </span>
                          <span className="designation font-poppins">
                            Chemical Engineer
                          </span>
                          <div className="contact-resume-btn d-flex gap-3 mt-md-5 mt-4">
                            <button className="primary-btn">Contact</button>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs={12} className="ps-lg-0 pe-4">
                          <div className="mt-4 client-ratings-and-reviews">
                            <div className="bg-transparent ratings d-flex flex-column gap-2">
                              <div className="d-flex justify-content-between align-items-center">
                                <Ratings ratings={4.6} />
                                <span className="font-poppins">4 reviews</span>
                              </div>
                              <Row className="align-items-center">
                                <Col className="w-100 pe-0">
                                  <ProgressBar now={85} />
                                </Col>
                                <Col xs="auto" className="px-3">
                                  <span className="font-poppins">
                                    85% trust
                                  </span>
                                </Col>
                              </Row>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                    <Col
                      lg={5}
                      className="lawyers-details px-3 d-flex flex-lg-row flex-column align-items-center px-lg-5 position-relative"
                    >
                      <Row className="position-relative w-100">
                        <Col xs={5} className="ps-0 pe-1">
                          <span className="detail-title">Age:</span>
                        </Col>
                        <Col xs={7} className="ps-1 pe-0">
                          <span className="detail-text">
                            {calculateAge(userData?.dob)}
                          </span>
                        </Col>
                        <Col xs={5} className="ps-0 pe-1">
                          <span className="detail-title">Location:</span>
                        </Col>
                        <Col xs={7} className="ps-1 pe-0">
                          <span className="detail-text">
                            {userData?.address}
                          </span>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Container>
          </section>
          <Footer />
        </div>
      </Fade>
    </>
  );
};

export default ClientProfile;
