import React, { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import leftImage from "../assets/images/progress-left-img.png";
import signatures from "../assets/images/history-right-sign.png";
import { aboutCountdowns, aboutSkills, servicesData } from "../data/data";
import SkillProgressBar from "../components/SkillProgressBar";
import LawyerCard from "../components/LawyerCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeaturedLawyers } from "../redux/actions/webActions";
import TopSection from "../components/TopSection";
import Fade from "react-reveal/Fade";

const About = () => {
  const dispatch = useDispatch();
  const { featuredLawyers } = useSelector((state) => state?.web);

  useEffect(() => {
    dispatch(fetchFeaturedLawyers());
  }, [dispatch]);

  const limitedFeaturedLawyers = featuredLawyers.slice(0, 4);

  return (
    <>
      <Fade>
        <TopSection
          sectionClass="about-top-section"
          topSpan="Our History"
          heading="About Us"
          activePage="About Us"
        />

        <section className="py-5">
          <Container>
            <Row>
              <Col md={6} xs={12}>
                <div className="Title-area">
                  <h3 className="font-lora">Our History</h3>
                  <h2 className="font-raleway text-uppercase">
                    All About Law Solution
                  </h2>
                  <p className="font-open-sans">
                    Law solution is a business theme perfectly suited legal
                    advisers and offices, lawyers, attorneys, counsels,
                    advocates and other legal and law related services.
                  </p>
                </div>
              </Col>
            </Row>

            <Row>
              <Col xs={12} lg={8} className="px-md-0">
                <Row>
                  <Col
                    md={6}
                    xs={12}
                    className="progress-left-img position-relative"
                  >
                    <span>
                      <svg
                        width="20"
                        height="25"
                        viewBox="0 0 20 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M17 13.8166V3.81656H10V21.5822C11.2396 20.9259 12.349 20.2124 13.3281 19.4416C15.776 17.5249 17 15.6499 17 13.8166ZM20 1.81656V13.8166C20 14.7124 19.8255 15.6004 19.4766 16.4806C19.1276 17.3608 18.6953 18.1421 18.1797 18.8244C17.6641 19.5067 17.0495 20.1707 16.3359 20.8166C15.6224 21.4624 14.9635 21.9989 14.3594 22.4259C13.7552 22.853 13.125 23.2567 12.4688 23.6369C11.8125 24.0171 11.3464 24.2749 11.0703 24.4103C10.7943 24.5457 10.5729 24.6499 10.4062 24.7228C10.2812 24.7853 10.1458 24.8166 10 24.8166C9.85417 24.8166 9.71875 24.7853 9.59375 24.7228C9.42708 24.6499 9.20573 24.5457 8.92969 24.4103C8.65365 24.2749 8.1875 24.0171 7.53125 23.6369C6.875 23.2567 6.24479 22.853 5.64062 22.4259C5.03646 21.9989 4.3776 21.4624 3.66406 20.8166C2.95052 20.1707 2.33594 19.5067 1.82031 18.8244C1.30469 18.1421 0.872396 17.3608 0.523438 16.4806C0.174479 15.6004 0 14.7124 0 13.8166V1.81656C0 1.54572 0.0989583 1.31135 0.296875 1.11343C0.494792 0.915518 0.729167 0.816559 1 0.816559H19C19.2708 0.816559 19.5052 0.915518 19.7031 1.11343C19.901 1.31135 20 1.54572 20 1.81656Z"
                          fill="white"
                        />
                      </svg>
                    </span>
                    <img src={leftImage} className="w-100" alt="left-pic" />
                  </Col>
                  <Col
                    md={6}
                    xs={12}
                    className="history-right-column mt-md-0 mt-3"
                  >
                    <p className="font-raleway position-relative fst-italic">
                      Law solution is a business theme perfectly suited legal
                      advisers and offices, lawyers, attorneys, and other legal
                      and law related services. We have started as a sole
                      practitioner providing services to the area community.
                      Aiming to provide high quality legal consultancy, support
                      and results for your legal issues. Using their practice
                      and experience, Law solution law firm documents and builds
                      their clients' cases to obtain the best results they could
                      achieve.
                    </p>
                    <img src={signatures} alt="signatures" />
                  </Col>
                </Row>
              </Col>
              <Col xs={12} lg={4} className="mt-lg-0 mt-5 ps-lg-3 px-0">
                <div className="progressbar position-relative">
                  {aboutSkills?.map((skill, i) => {
                    return (
                      <SkillProgressBar
                        skill_title={skill?.skill_title}
                        progress={skill?.progress}
                        key={i}
                      />
                    );
                  })}
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        <section className="py-5">
          <Container>
            <Row>
              <Col md={6} xs={12}>
                <div className="Title-area">
                  <h3 className="font-lora">Our Legal Team</h3>
                  <h2 className="font-raleway text-uppercase">
                    Meet Our Attorneys
                  </h2>
                  <p className="font-open-sans">
                    Each lawyer at Law Solution law firm focuses exclusively on
                    civil matters, we have choosed our lawyers taking into
                    account their experience and ability to handle all cases.
                  </p>
                </div>
              </Col>
              <Col
                md={6}
                xs={12}
                className="d-flex justify-content-md-end justify-content-start align-items-center mb-md-0 mb-4"
              >
                <Link to={"/legal-professionals"}>
                  <button
                    type="button"
                    className="asset-button rounded-0 font-open-sans"
                  >
                    Find Legal Professionals
                  </button>
                </Link>
              </Col>
            </Row>

            <Row className="py-5 px-md-0 px-sm-5 px-0 gap-xl-0 gap-5 justify-content-md-between justify-content-center align-items-stretch">
              {limitedFeaturedLawyers?.map((lawyer, i) => {
                return <LawyerCard lawyerDetails={lawyer} key={i} />;
              })}
            </Row>
          </Container>
        </section>

        <section className="py-5">
          <Container>
            <Row>
              <Col md={6} xs={12}>
                <div className="Title-area">
                  <h3 className="font-lora">Want Help</h3>
                  <h2 className="font-raleway text-uppercase">
                    PRACTICE AREAS
                  </h2>
                  <p className="font-open-sans">
                    In Law Solution, we have got a wide range of legal services.
                    We practice general civil law for businesses, individuals,
                    and local governments too.is abusiness theme perfectly
                    suited legal advisers and offices, lawyers, attorneys,
                    counsels, advocates and other legal and law related
                    services.
                  </p>
                </div>
              </Col>
              <Col
                md={6}
                xs={12}
                className="d-flex justify-content-md-end justify-content-start align-items-center mb-md-0 mb-4"
              >
                <Link to={"/practice-areas"}>
                  <button
                    type="button"
                    className="asset-button rounded-0 font-open-sans"
                  >
                    View All Practice Areas
                  </button>
                </Link>
              </Col>
            </Row>

            <Row className="mt-md-0 mt-3">
              {servicesData.slice(0, 4).map((item, i) => {
                const url = `/practice-areas/${item.slug}/${item.id}`;
                return (
                  <Col
                    sm={6}
                    xs={12}
                    lg={3}
                    key={i}
                    className="about-services cursor-pointer"
                  >
                    <div className="h-2-p-c-details">
                      <div className="h-2-p-c-default">
                        <span className="symbol">{item.svg}</span>
                        <h2>
                          <Link to={url} className="text-decoration-none">
                            {item.heading}
                          </Link>
                        </h2>
                        <p>{item.description}</p>
                        <Link
                          to={url}
                          className="more-icon text-dark-color text-decoration-none font-montserrat d-flex gap-2 align-items-center"
                        >
                          More
                          <svg
                            width="28"
                            height="24"
                            viewBox="0 0 8 4"
                            fill="none"
                          >
                            <path
                              d="M7.5 2L5 0.556624V3.44338L7.5 2ZM0 2.25H5.25V1.75H0V2.25Z"
                              fill="#D5AA6D"
                            />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </Container>
        </section>

        <section className="fun-fact-area">
          <div className="welcome-title-area">
            <Container>
              <Row>
                <Col xs={12} md={6}>
                  <div className="Title-area contact-title h-5-title">
                    <h3 className="font-lora">Fun Facts</h3>
                    <h2 className="text-white text-uppercase font-raleway">
                      Law Solution In Numbers
                    </h2>
                    <p className="font-open-sans text-white">
                      Since 1900, Law Solution start working aiming to build
                      awide range circle of customers, and to win all the cases
                      brought by the customers, have alook in our numbers.
                    </p>
                  </div>
                </Col>
              </Row>
              <Row className="counter-container">
                {aboutCountdowns.map((item, i) => {
                  return (
                    <Col
                      xs={12}
                      md={6}
                      lg={3}
                      key={i}
                      className="d-flex countdown-content align-items-center justify-content-between"
                    >
                      <div className="h-5-countdown-content">
                        <h2 className="text-white">
                          <span className="counter">{item.count}</span>+
                        </h2>
                        <p className="text-white">{item.title}</p>
                      </div>
                      <div className="countdown-icon h-5-countdown-icon">
                        {item.icon}
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </Container>
          </div>
        </section>

        <section className="testimonials-section">
          <Container>
            <Row>
              <Col md={6} xs={12}>
                <div className="Title-area">
                  <h3 className="font-lora">All About Us</h3>
                  <h2 className="font-raleway text-uppercase">
                    Testimonials & News
                  </h2>
                  <p className="font-open-sans">
                    See what our clients say about us, we have been known for
                    doing what we says, aiming to bring favourable results for
                    its customers as soon as possible.
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </Fade>
    </>
  );
};

export default About;
