import React from "react";
import TopSection from "../components/TopSection";
import { Col, Container, Row } from "react-bootstrap";
import { Accordion } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import Fade from "react-reveal/Fade";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  fetchFAQsListForWeb,
} from "../redux/actions/webActions";

const FAQs = () => {
  const dispatch = useDispatch();
  const { fetchFAQsList, } = useSelector((state) => state.web);

  useEffect(() => {
    dispatch(fetchFAQsListForWeb());
  }, [dispatch]);

  return (
    <>
      <Fade>
        <TopSection
          sectionClass="faqs-top-section"
          topSpan="You Ask, We Answer!"
          heading="Frequently Asked Questions"
          activePage="FAQs"
        />

        <section>
          <Container>
            <Row className="faqs-content-area">
              <Col md={9} className="px-sm-4 px-3 mb-4">
                <Accordion
                  transitionDuration={400}
                  chevron={<IconPlus size="1.2rem" color="#d5aa6d" />}
                  styles={{
                    chevron: {
                      "&[data-rotate]": {
                        transform: "rotate(45deg)",
                      },
                    },
                  }}
                >
                  {fetchFAQsList?.length > 0 ? (
                    fetchFAQsList?.map((value, i) => {
                      if (value.is_published === 1) {
                        return (
                          <Accordion.Item
                            className="faqs-accordion"
                            value={value.question}
                            key={i}
                          >
                            <Accordion.Control
                              icon={
                                <i className="fa-solid fa-circle-question"></i>
                              }
                            >
                              {value.question}
                            </Accordion.Control>
                            <Accordion.Panel>
                              <p>{value.answer}</p>
                            </Accordion.Panel>
                          </Accordion.Item>
                        );
                      }
                      return null;
                    })
                  ) : (
                    <p className="text-center">No FAQs Found Yet</p>
                  )}
                </Accordion>
              </Col>
            </Row>
          </Container>
        </section>
      </Fade>
    </>
  );
};

export default FAQs;
