import React, { useEffect } from "react";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import Ratings from "../../components/Ratings";
import { useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Fade from "react-reveal/Fade";
import { getLawyerById } from "../../redux/actions/webActions";
import { Avatar, Flex, Rating, Text } from "@mantine/core";

const LawyerProfile = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { id } = useParams();

  useEffect(() => {
    if (location.pathname === "/lawyer-profile") {
      dispatch(
        getLawyerById(
          location.state
            ? location.state
            : JSON.parse(localStorage.getItem("user"))?.id
        )
      );
    } else {
      dispatch(getLawyerById(id));
    }
  }, [dispatch, location.pathname, id, location.state]);

  const { user } = useSelector((state) => state.auth);
  const { LawyerById } = useSelector((state) => state.web);

  return (
    <>
      <Fade>
        {LawyerById?.first_name ? (
          <div>
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
                            xs={12}
                            className="d-flex justify-content-md-start justify-content-center p-lg-0 p-md-3"
                          >
                            <Avatar
                              src={LawyerById?.image}
                              alt={
                                `${LawyerById?.first_name} profile pic` ||
                                "user profile pic"
                              }
                              radius={1000}
                              size={"md"}
                              className="user-profile-pic profile-pic-lawyer"
                            />
                          </Col>
                          <Col
                            sm={8}
                            xs={12}
                            className="align-items-center pt-4"
                          >
                            <Col
                              xs={12}
                              className="d-flex flex-column align-items-start justify-content-center py-3"
                            >
                              {LawyerById ? (
                                <h2 className="username font-montserrat text-uppercase">
                                  {`${LawyerById?.first_name} ${LawyerById?.last_name}`}
                                </h2>
                              ) : (
                                <h2 className="username font-montserrat text-uppercase">
                                  {`${user?.userData?.first_name} ${user?.userData?.last_name}`}
                                </h2>
                              )}
                            </Col>
                            <Col xs={12} className="w-100 pe-0">
                              <span className="fw-bold">Email: </span>
                              <a href={`mailto:${LawyerById?.email}`}>
                                {LawyerById?.email}
                              </a>
                            </Col>
                            <Col xs="auto">
                              <span className="fw-bold">Phone: </span>
                              <a href={`tel:${LawyerById?.phone_number}`}>
                                {LawyerById?.phone_number}
                              </a>
                            </Col>

                            <Col xs={12} className="p-lg-0 p-md-3">
                              <div className="mt-4 client-ratings-and-reviews">
                                <div className="ratings d-flex flex-column gap-2">
                                  <div className="d-flex justify-content-between align-items-center">
                                    {LawyerById ? (
                                      <Ratings
                                        ratings={
                                          isNaN(LawyerById?.ratings)
                                            ? 0
                                            : Math.round(LawyerById?.ratings)
                                        }
                                      />
                                    ) : (
                                      <Ratings
                                        ratings={Math.round(
                                          user?.userData?.average_rating
                                        )}
                                      />
                                    )}
                                    <span className="font-poppins">
                                      {LawyerById
                                        ? LawyerById?.reviews?.length
                                        : 20}{" "}
                                      reviews
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </Col>
                          </Col>

                          <Col xs={12} className="py-4">
                            <h4 className="fw-bold">Lawyers Details:</h4>
                            <ul className="list-unstyled ps-3">
                              <li>
                                <span className="fw-bold">Country: </span>
                                {LawyerById?.country}
                              </li>
                              <li>
                                <span className="fw-bold">Address: </span>
                                {LawyerById?.address}
                              </li>
                              {LawyerById?.area_of_expertise?.length > 0 && (
                                <li>
                                  <span className="fw-bold">
                                    Practice Areas:{" "}
                                  </span>
                                  <ul>
                                    {LawyerById?.area_of_expertise?.map(
                                      (experty, i) => {
                                        return <li>{experty?.name}</li>;
                                      }
                                    )}
                                  </ul>
                                </li>
                              )}
                            </ul>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Container>
            </section>

            <section className="user-profile mb-5">
              <Container>
                <p className="top text-uppercase font-raleway fs-4 ms-1  fw-bold">
                  Reviews
                </p>
                <Row sm={1} md={2} lg={2}>
                  {LawyerById?.reviews?.length ? (
                    LawyerById?.reviews.map((value, index) => (
                      <Col key={index}>
                        <div
                          className="mt-3 px-3 col-5 mb-3 p-2 rounded w-100"
                          style={{ background: "#f8f8f9 " }}
                        >
                          <Flex gap={20} align={"center"}>
                            <Avatar
                              src={value.client_image}
                              alt={`${value.client_image} pic`}
                              size={50}
                              radius={"xl"}
                            />

                            <Flex direction={"column"} mb={20}>
                              <p className="fs-5 text-uppercase mt-2 mb-0">
                                {value.client_name}
                              </p>
                              <Rating value={value.rating} readOnly />
                            </Flex>
                          </Flex>
                          <div className="d-flex  ms-6 me-6">
                            <Text
                              sx={{
                                maxWidth: "75%",
                                "@media screen and (max-width: 767px)": {
                                  maxWidth: "100%",
                                },
                              }}
                            >
                              {value?.feedback
                                ? value?.feedback
                                : "No Comments!"}
                            </Text>
                          </div>
                        </div>
                      </Col>
                    ))
                  ) : (
                    <div className="d-flex">
                      <p className="fs-5 text-uppercase mt-2 ms-2">
                        No reviews yet...
                      </p>
                    </div>
                  )}
                  {/* </Col> */}
                  {/* <Col lg={4} className="d-flex justify-content-end mt-lg-0 mt-4">
                <SimilarProfiles />
              </Col> */}
                </Row>
              </Container>
            </section>
          </div>
        ) : (
          <div
            style={{
              minHeight: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Spinner
              size="xl"
              style={{
                margin: "auto",
              }}
            />
          </div>
        )}
        {/* <Footer /> */}
      </Fade>
    </>
  );
};

export default LawyerProfile;
