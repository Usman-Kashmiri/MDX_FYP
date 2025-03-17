import React, { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  details,
  services_text,
  story_and_history,
  values_and_philosophy,
} from "../data/data";
import LawyerCard from "../components/LawyerCard";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCarouselsForHomePage,
  fetchFeaturedLawyers,
} from "../redux/actions/webActions";
import Fade from "react-reveal/Fade";
import { useDisclosure } from "@mantine/hooks";
import ReadMoreModal from "../components/layout/ReadMoreModal";
import { Box, LoadingOverlay } from "@mantine/core";
import DescribeCaseModal from "../components/layout/DescribeCaseModal";
import { errorMessage } from "../globalFunctions";
import { verifyEmail } from "../redux/actions/authActions";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { code } = useParams();
  const { featuredLawyers, fetchCarousel } = useSelector((state) => state?.web);
  const { isAuthenticated } = useSelector((state) => state?.auth);
  const role = JSON.parse(localStorage.getItem("user"))?.role;
  const [imageIndex, setImageIndex] = useState(0);
  const [carousels, setCarousels] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const handleSelect = (selectedIndex, e) => {
    setImageIndex(selectedIndex);
  };

  const handleEmailVerificationWithLink = async () => {
    const res = await dispatch(verifyEmail({ token: code }));
    if (res.res === "success") {
      const role = res?.user?.role?.replace("Super", "")?.toLowerCase();
      navigate(`/${role}/account-settings`);
    }
  };

  useEffect(() => {
    if (code !== undefined && pathname.includes("verify-email")) {
      handleEmailVerificationWithLink();
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchFeaturedLawyers());
  }, [dispatch]);

  const [opened, { open, close }] = useDisclosure(false);
  const [isCaseModalOpened, { open: openCaseModal, close: closeCaseModal }] =
    useDisclosure(false);

  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState("");

  const handleTermsOfServiceModal = (modalType) => {
    if (modalType === "sah") {
      setModalTitle("Story & History");
      setModalContent(story_and_history);
    } else if (modalType === "vap") {
      setModalTitle("Values & Philosophy");
      setModalContent(values_and_philosophy);
    } else {
      setModalTitle("Services");
      setModalContent(services_text);
    }
    open();
  };

  useEffect(() => {
    setCarousels(fetchCarousel);
  }, [fetchCarousel]);

  useEffect(() => {
    dispatch(fetchCarouselsForHomePage());
  }, [dispatch]);

  useEffect(() => {
    carousels?.carousel_images?.length > 0 && setIsLoading(false);
  }, [carousels]);

  const handleCaseModal = () => {
    !isAuthenticated && errorMessage("Please login first to submit a case");
    isAuthenticated
      ? openCaseModal()
      : navigate("/auth/login", { state: "/legal-professionals" });
  };

  return (
    <>
      <Fade>
        {/* // ? Banner Section */}
        <div className="banner">
          <div className="banner-slider">
            {/* // ? <BannerSlider /> */}
            <div className="d-flex justify-content-center align-items-end slider-container position-relative">
              <Box mih={400} pos="relative">
                <LoadingOverlay
                  visible={isLoading}
                  overlayBlur={2}
                  transitionDuration={500}
                  loaderProps={{
                    size: "xl",
                    color: "#d28b13",
                    variant: "oval",
                  }}
                  overlayOpacity={0.3}
                  overlayColor="#444"
                />
                <Carousel
                  className="w-100"
                  controls={false}
                  activeIndex={imageIndex}
                  onSelect={handleSelect}
                >
                  {carousels?.carousel_images?.map((item, i) => {
                    return (
                      <Carousel.Item key={i}>
                        <img
                          className="d-block w-100"
                          src={`${item?.image}`}
                          alt={item?.alt_text}
                        />
                      </Carousel.Item>
                    );
                  })}
                </Carousel>
              </Box>
              <div className="slider-caption-container container-fluid row position-absolute text-center justify-content-center align-items-center">
                <div className="slider-caption col-12 col-lg-8 mb-sm-5 mb-3">
                  <h3 className="text-white font-montserrat">
                    {carousels?.carousel_text?.text}
                  </h3>
                  <h1 className="text-white font-montserrat">
                    {carousels?.carousel_text?.punchline}
                  </h1>
                  {role !== "Lawyer" && (
                    <button
                      onClick={handleCaseModal}
                      className="py-lg-2 py-1 px-3 px-lg-5 mb-md-0 mb-4"
                    >
                      REQUEST A FREE CONSULTATION
                    </button>
                  )}
                  <DescribeCaseModal
                    opened={isCaseModalOpened}
                    close={closeCaseModal}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Milestones Section */}
        <Container className="milestones-container">
          <Row className="mt-5">
            <Col sm={9} className="how mt-5">
              <h2 className="font-raleway fw-bold">What We Do?</h2>
              <p className="font-montserrat">
                Welcome to The MDX Lawsuit where finding and purchasing The MDX
                Lawsuit legal services is simplified. We connect you with
                seasoned legal professionals, offering a wide array of services
                tailored to your specific needs. Whether you're seeking
                assistance with a single legal task or navigating a complex
                issue, our marketplace is designed with you in mind.
              </p>

              <ul className="what_we_do_list">
                <li>
                  <b>Affordable:</b> Choose from an array of The MDX Lawsuit
                  services to only pay for what you need.
                </li>
                <li>
                  <b>Transparent:</b> Clear pricing and detailed service
                  descriptions leave no surprises.
                </li>
                <li>
                  <b>Accessible:</b> Easily browse and purchase services from
                  the comfort of your home.
                </li>
                <li>
                  <b>Reliable:</b> Our network of trusted legal experts is
                  committed to delivering top-notch service.
                </li>
              </ul>

              <strong>
                Take control of your legal needs and explore the future of legal
                support. Start your journey today.
              </strong>
            </Col>
          </Row>

          <Row className="mt-5">
            <Col sm={9} className="how mt-5">
              <h2 className="font-raleway fw-bold">HOW IT WORKS?</h2>
              <p className="font-montserrat">
                You can do a lot of things by yourself in the legal world. In
                fact, more and more people are doing just that. Unfortunately,
                they sometimes get lost in the system and never end up getting a
                resolution. The MDX Lawsuit legal services allows you to consult
                a lawyer when you need one, while doing the rest yourself. This
                allows you to control costs and get a fair result.
              </p>
            </Col>
          </Row>

          {/* Details */}
          <Container className="details-container pb-3">
            <Row>
              {details?.map((detail, i) => {
                return (
                  <Col md={4} className="pe-5" key={i}>
                    <div className="title row justify-content-between flex-lg-row flex-md-column-reverse">
                      <h2 className="col-md-12 col-lg-6 font-raleway fw-bold fs-3">
                        {detail.heading}
                      </h2>
                      <span className="count col-auto fs-1">0{i + 1}.</span>
                    </div>
                    <div>
                      <p>{detail.description}</p>
                    </div>
                    <Link
                      to={detail.link}
                      className="more-icon text-dark-color text-decoration-none font-montserrat d-flex gap-2 align-items-center"
                      onClick={
                        detail.heading === "Story & History"
                          ? () => handleTermsOfServiceModal("sah")
                          : detail.heading === "Values & Philosophy"
                          ? () => handleTermsOfServiceModal("vap")
                          : () => handleTermsOfServiceModal("services")
                      }
                    >
                      More
                      <svg width="28" height="24" viewBox="0 0 8 4" fill="none">
                        <path
                          d="M7.5 2L5 0.556624V3.44338L7.5 2ZM0 2.25H5.25V1.75H0V2.25Z"
                          fill="#D5AA6D"
                        />
                      </svg>
                    </Link>
                  </Col>
                );
              })}
            </Row>
            <ReadMoreModal
              isOpen={opened}
              isClosed={close}
              modalTittle={modalTitle}
              content={modalContent}
            />
          </Container>
        </Container>

        {/* // ? Featured Lawyers Section */}
        <div>
          {featuredLawyers?.length > 0 && (
            <div className="featured-lawyer">
              <Container>
                <Row className="mt-5">
                  <Col
                    xs={12}
                    className="feature-heading mt-5 d-flex justify-content-between"
                  >
                    <h2 className="mt-1 mb-5 font-raleway fw-bold">
                      FEATURED LAWYER
                    </h2>
                    <svg
                      className="featured-lawyer-svg"
                      xmlns="http://www.w3.org/2000/svg"
                      width="93"
                      height="128"
                      fill="none"
                      viewBox="0 0 93 128"
                    >
                      <g filter="url(#filter0_d_75_637)">
                        <path
                          fill="#D5AA6D"
                          d="M2 0h81v90.012H14.222L2 116V0z"
                        ></path>
                        <path
                          fill="#fff"
                          d="M43 25l4.94 15.202h15.983l-12.931 9.395 4.94 15.201L43 55.403l-12.931 9.395 4.939-15.201-12.931-9.395H38.06L43 25z"
                        ></path>
                      </g>
                      <defs>
                        <filter
                          id="filter0_d_75_637"
                          width="93"
                          height="128"
                          x="0"
                          y="0"
                          colorInterpolationFilters="sRGB"
                          filterUnits="userSpaceOnUse"
                        >
                          <feFlood
                            floodOpacity="0"
                            result="BackgroundImageFix"
                          ></feFlood>
                          <feColorMatrix
                            in="SourceAlpha"
                            result="hardAlpha"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                          ></feColorMatrix>
                          <feOffset dx="4" dy="6"></feOffset>
                          <feGaussianBlur stdDeviation="3"></feGaussianBlur>
                          <feComposite
                            in2="hardAlpha"
                            operator="out"
                          ></feComposite>
                          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"></feColorMatrix>
                          <feBlend
                            in2="BackgroundImageFix"
                            result="effect1_dropShadow_75_637"
                          ></feBlend>
                          <feBlend
                            in="SourceGraphic"
                            in2="effect1_dropShadow_75_637"
                            result="shape"
                          ></feBlend>
                        </filter>
                      </defs>
                    </svg>
                  </Col>
                </Row>
                <Row className="py-5 gap-5 justify-content-md-start justify-content-center align-items-stretch">
                  {featuredLawyers?.slice(0, 6)?.map((lawyer, i) => {
                    return <LawyerCard lawyerDetails={lawyer} key={i} />;
                  })}
                </Row>
                <Row className="justify-content-end my-5">
                  <Link
                    to="/legal-professionals"
                    className="more-icon text-dark-color text-decoration-none font-montserrat d-flex gap-2 align-items-center justify-content-end"
                  >
                    More
                    <svg width="28" height="24" viewBox="0 0 8 4" fill="none">
                      <path
                        d="M7.5 2L5 0.556624V3.44338L7.5 2ZM0 2.25H5.25V1.75H0V2.25Z"
                        fill="#D5AA6D"
                      />
                    </svg>
                  </Link>
                </Row>
              </Container>
            </div>
          )}
        </div>

        {/* // ? Start Conversion Section */}
        <>
          {role === "Client" && (
            <div className="start-conversion-section py-5 mt-5">
              <Container>
                <Row className="justify-content-md-between justify-content-center gap-4">
                  <Col xl={6} lg={6} md={7} xs={12}>
                    <h3 className="font-raleway fw-bold">
                      Describe your problem and get advice
                    </h3>
                  </Col>
                  <Col
                    lg={3}
                    md={4}
                    sm={6}
                    xs={12}
                    className="d-flex align-items-center fw-semibold"
                  >
                    <Button
                      className="grey-gradient-btn font-poppins"
                      onClick={handleCaseModal}
                    >
                      Get Advice
                    </Button>
                  </Col>
                </Row>
              </Container>
            </div>
          )}
        </>
      </Fade>
    </>
  );
};

export default Home;
