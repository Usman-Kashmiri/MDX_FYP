import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import TopSection from "../components/TopSection";
import { servicesData } from "../data/data";

import Fade from "react-reveal/Fade";
import { useNavigate, useParams } from "react-router-dom";
import DescribeCaseModal from "../components/layout/DescribeCaseModal";
import { useSelector } from "react-redux";
import { useDisclosure } from "@mantine/hooks";
import { errorMessage } from "../globalFunctions";

const PracticeArea = () => {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const [practiceArea, setPracticeArea] = useState(null);
  const role = JSON.parse(localStorage.getItem("user"))?.role;
  const { isAuthenticated } = useSelector((state) => state?.auth);
  useEffect(() => {
    const data = servicesData?.find(
      (item) => item.id === Number(id) && item.slug === slug
    );

    setPracticeArea(data);
  });
  const [isCaseModalOpened, { open: openCaseModal, close: closeCaseModal }] =
    useDisclosure(false);
  const handleCaseModal = () => {
    !isAuthenticated && errorMessage("Please login first to submit a case");
    isAuthenticated
      ? openCaseModal()
      : navigate("/auth/login", { state: "/legal-professionals" });
  };

  return (
    <>
      <Fade>
        <TopSection
          sectionClass="practice-areas-top-section"
          topSpan="Practice Area"
          heading={practiceArea?.heading}
          activePage={practiceArea?.heading}
        />

        <section>
          <Container>
            <Row className="faqs-content-area justify-content-center">
              <Col lg={9} className="ps-0 pe-3">
                <div className="inner-single-practice">
                  <img
                    src={practiceArea?.image}
                    className="w-100"
                    alt="practice-area"
                  />
                  <h2 className="my-4">Overview :</h2>
                  <p>
                    Family law consists of a body of statutes and case
                    precedents that govern the legal responsibilities between
                    individuals who share a domestic connection. These cases
                    usually involve parties who are related by blood or
                    marriage, but family law can affect those in more distant or
                    casual relationships as well. Due to the emotionally-charged
                    nature of most family law cases, litigants are strongly
                    advised to retain legal counsel.
                  </p>
                  <p>
                    The vast majority of family law proceedings come about as a
                    result of the termination of a marriage or romantic
                    relationship. Family law attorneys help their clients file
                    for separation or divorce, alimony, and child custody,
                    visitation, and support. Spouses married a short time may
                    seek an annulment, and special rights may exist between
                    same-sex couples. The division of property at the end of a
                    marriage is also a common issue in family law cases.
                  </p>
                  <h2>How Can We Help !</h2>
                  <p>
                    In Law Solution, we are aiming to provide high quality legal
                    consultancy, support and results for your legal issues.
                    Aiming to provide high quality legal consultancy, support
                    and results for your legal issues. Using their expertise and
                    experience, Law Solution firm documents and builds their
                    clients' cases to obtain the best results they could achieve
                    in their particular situation. Law Solution has been known
                    for doing what he says, aiming to bring favourable results
                    for its customers as soon as possible.
                  </p>
                  {role === "Client" && (
                    <button
                      onClick={handleCaseModal}
                      className="btn-brown-square"
                    >
                      Request Free Consultation
                      <i className="ms-3 fa fa-long-arrow-right"></i>
                    </button>
                  )}
                </div>
              </Col>
            </Row>
          </Container>
          <DescribeCaseModal
            opened={isCaseModalOpened}
            close={closeCaseModal}
          />
        </section>
      </Fade>
    </>
  );
};

export default PracticeArea;
