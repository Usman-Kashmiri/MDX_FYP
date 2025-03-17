import React, { useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Select, Pagination, Box, Loader } from "@mantine/core";
import ClientCase from "../../components/ClientCase";
import { useDispatch, useSelector } from "react-redux";
import Fade from "react-reveal/Fade";
import { getLawyerCase } from "../../redux/actions/lawyerAction";
import { useLocation } from "react-router-dom";

const LawyerDashboard = () => {

  const location = useLocation();
  const id = location?.hash;
  const caseListRef = useRef(0)
  const dispatch = useDispatch();
  const { lawyerCases } = useSelector((state) => state.lawyer);
  const [selectedCaseType, setSelectedCaseType] = useState("all");
  const [isLoading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 5,
    total_records: 0,
  });

  const fetchCases = async () => {
    setLoading(true);
    try {
      const res = await dispatch(getLawyerCase(selectedCaseType, pagination));
      setPagination({ ...pagination, total_records: res?.total_records || 0 });
      setLoading(false);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [selectedCaseType, pagination.page]);

  useEffect(() => {

    if (location.hash !== "") {
      let id = location.hash.slice(1);
      const targetElement = document.getElementById(id);
      const casesListsElement = document.getElementById('casesLists');
      if (targetElement) {
        let y = targetElement.offsetTop; 
        setTimeout(() => {
          casesListsElement.scrollTo({ top: y, behavior: 'smooth' });
        }, 1000);
      }
    }

  }, [lawyerCases]);
  return (
    <div>
      <Col xs={12} className=" pb-3 px-md-4 px-2 mb-5">
        <Fade>
          <div>
            <Col xs={12} className="pt-4 pb-3 px-sm-4 px-2">
              <div>
                {/* <div className="statics">
                <div className="---centeresadsa----">
                  <Paper
                    bg="#5A68DF"
                    className="purple-stat"
                    radius="md"
                    p="xs"
                  >
                    <Group>
                      <div>
                        <Text
                          color="white"
                          size="xl"
                          transform="capitalize"
                          weight={700}
                        >
                          Response
                        </Text>
                        <Text color="white" weight={500} size="xs">
                          Rate
                        </Text>
                      </div>
                      <RingProgress
                        size={smallScreen ? 60 : 80}
                        roundCaps
                        thickness={smallScreen ? 7 : 8}
                        sections={[
                          {
                            value: 91,
                            color: "white",
                          },
                        ]}
                        label="91%"
                      />
                    </Group>
                  </Paper>
                </div>
                <div className="---centeresadsa----">
                  <Paper
                    bg="#C4B07A"
                    className="yellow-stat"
                    radius="md"
                    p="xs"
                  >
                    <Group>
                      <div>
                        <Text
                          color="white"
                          size="xl"
                          transform="capitalize"
                          weight={700}
                        >
                          Insights
                        </Text>
                        <Text color="white" weight={500} size="xs">
                          without delay
                        </Text>
                      </div>
                      <RingProgress
                        size={smallScreen ? 60 : 80}
                        roundCaps
                        thickness={smallScreen ? 7 : 8}
                        sections={[
                          {
                            value: 75,
                            color: "white",
                          },
                        ]}
                        label="85%"
                      />
                    </Group>
                  </Paper>
                </div>
                <div className="---centeresadsa----">
                  <Paper bg="#BE6E5F" className="brown-stat" radius="md" p="xs">
                    <Group>
                      <div>
                        <Text
                          color="white"
                          size="xl"
                          transform="capitalize"
                          weight={700}
                        >
                          Successful
                        </Text>
                        <Text color="white" weight={500} size="xs">
                          contract
                        </Text>
                      </div>
                      <RingProgress
                        size={smallScreen ? 60 : 80}
                        roundCaps
                        thickness={smallScreen ? 7 : 8}
                        sections={[
                          {
                            value: 75,
                            color: "white",
                          },
                        ]}
                        label="85%"
                      />
                    </Group>
                  </Paper>
                </div>
              </div> */}
              </div>
              <Row className="mt-4">
                <div className="clients-container">
                  <Row className="py-3 px-md-4 px-2 clients-container-header">
                    <Col xs={6} className="d-flex align-items-center">
                      <span className="font-poppins">Cases</span>
                    </Col>

                    <Col xs={6} className="d-flex justify-content-end">
                      <Select
                        className="case-type-dropdown"
                        placeholder="Select case type"
                        value={selectedCaseType}
                        onChange={setSelectedCaseType}
                        rightSection={<i className="fa fa-chevron-down"></i>}
                        data={[
                          { value: "all", label: "All Cases" },
                          {
                            value: "approved",
                            label: "Approved Cases",
                          },
                          {
                            value: "pending",
                            label: "Pending Cases",
                          },
                          {
                            value: "rejected",
                            label: "Rejected Cases",
                          },
                          {
                            value: "completed",
                            label: "Completed Cases",
                          },
                        ]}
                      />
                    </Col>
                  </Row>
                  <Row className="clients py-4 px-md-4 px-1 gap-3" id="casesLists" ref={caseListRef}>
                    {!isLoading && lawyerCases.length > 0 ? (
                      lawyerCases?.map((value, index) => {
                        return (
                          <div id={value?.case?.id} className="px-0" key={index}>
                            <ClientCase
                              fetchCases={fetchCases}
                              caseId={id}
                              key={index}
                              data={value}
                            />
                          </div>
                        );
                      })
                    ) : isLoading ? (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Loader size={"lg"} color="#db9753" />
                      </Box>
                    ) : (
                      <div className="d-flex justify-content-center align-content-center mt-5">
                        <p>404 - Cases not Found</p>
                      </div>
                    )}
                  </Row>
                  <div className="d-flex justify-content-end px-4 py-3">
                    <Pagination
                      value={pagination?.page}
                      onChange={(page) =>
                        setPagination({ ...pagination, page })
                      }
                      total={Math.round(
                        pagination?.total_records / pagination?.per_page
                      )}
                      position={"right"}
                      radius="md"
                    />
                  </div>
                </div>
              </Row>
            </Col>
          </div>
        </Fade>
      </Col>
    </div>
  );
};

export default LawyerDashboard;
