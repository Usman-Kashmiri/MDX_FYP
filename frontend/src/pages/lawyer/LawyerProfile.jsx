import React, { useEffect, useState } from "react";
import { Col, Container, ProgressBar, Row, Spinner } from "react-bootstrap";
import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";
import Ratings from "../../components/Ratings";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Fade from "react-reveal/Fade";
import { getLawyerById } from "../../redux/actions/webActions";
import { Avatar, Button, Flex, Rating, Text } from "@mantine/core";
import { errorMessage } from "../../globalFunctions";
import { isAbleToChat } from "../../redux/actions/clientActions";
import { useAuth } from "../../hooks/auth";
import DescribeCaseModal from "../../components/layout/DescribeCaseModal";
import { useDisclosure } from "@mantine/hooks";
import chatNowIcon from "../../assets/images/chat-now-icon.png";

const LawyerProfile = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuthorized = useAuth();
  const [isChatInitiated, setIsChatInitiated] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isCaseModalOpened, { open: openCaseModal, close: closeCaseModal }] =
    useDisclosure(false);

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
  }, [dispatch, location.pathname]);

  const { user } = useSelector((state) => state.auth);
  const { LawyerById } = useSelector((state) => state.web);

  const handleChat = async () => {
    setIsChatLoading(true);
    !isAuthorized && navigate("/auth/login", { state: "/legal-professionals" });
    !isAuthorized && errorMessage("Please login first to initiate a case");
    const res = await dispatch(isAbleToChat(LawyerById?.id));
    isAuthorized && res.res && setIsChatInitiated(true);
    isAuthorized && !res.res && openCaseModal();
    isAuthorized &&
      res.res &&
      navigate(`/chat/${LawyerById?.id}`, {
        state: { lawyer_id: LawyerById?.id, userData: user?.userData },
      });
    setIsChatLoading(false);
  };

  return (
    <>
      <Fade>
        {/* <div
          style={{
            position: "fixed",
            zIndex: 999,
            top: "0",
            left: "0",
            right: "0",
            marginBottom: "2rem",
            minHeight: "100vh",
            maxHeight: "100vh",
          }}
        >
          <Header />
        </div> */}

        {LawyerById?.first_name ? (
          <div
          // style={{
          //   marginTop: "5rem",
          // }}
          >
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
                              // w={200}
                              // h={200}
                              size={"md"}
                              className="user-profile-pic profile-pic-lawyer"
                            />
                          </Col>
                          <Col
                            sm={8}
                            xs={12}
                            className="d-flex flex-column align-items-start justify-content-center ps-md-5 ps-3 py-md-0 py-3"
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
                            {location.pathname !== "/lawyer-profile" && (
                              <div className="contact-resume-btn d-flex gap-3 mt-md-5 mt-4">
                                <Button
                                  loading={isChatLoading}
                                  className="primary-btn"
                                  onClick={handleChat}
                                  h={45}
                                >
                                  <Flex
                                    align={"center"}
                                    justify={"center"}
                                    gap={6}
                                  >
                                    Chat
                                    <img
                                      src={chatNowIcon}
                                      alt="chat-now"
                                      width={20}
                                    />
                                  </Flex>
                                </Button>
                              </div>
                            )}
                          </Col>
                        </Row>
                        <Row>
                          <Col md={5} className="p-lg-0 p-md-3">
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
                                {/* <Row className="align-items-center">
                                  <Col className="w-100 pe-0">
                                    <ProgressBar now={85} />
                                  </Col>
                                  <Col xs="auto" className="px-3">
                                    <span className="font-poppins">
                                      85% trust
                                    </span>
                                  </Col>
                                </Row> */}
                              </div>
                            </div>
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

      <DescribeCaseModal
        opened={isCaseModalOpened}
        close={closeCaseModal}
        isChatInitiated={isChatInitiated}
        lawyerId={LawyerById?.id}
      />
    </>
  );
};

export default LawyerProfile;
