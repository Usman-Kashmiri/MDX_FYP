import React, { useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import ClientCase from "../../components/ClientCase";
import Fade from "react-reveal/Fade";
import { useDispatch, useSelector } from "react-redux";
import { getClientDashboardCases } from "../../redux/actions/clientActions";
import { useLocation } from "react-router-dom";
import { Box, Loader, Pagination, Select } from "@mantine/core";

const ClientDashboard = () => {
  const location = useLocation();
  const caseListRef = useRef()
  const id = location?.hash;
  const dispatch = useDispatch();
  const { dashboard, loading } = useSelector((state) => state.client);
  const [selectedCaseType, setSelectedCaseType] = useState("all");
  const [isLoading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 5,
    total_records: 0,
    total_pages: 0,
  });


  const fetchCases = async () => {
    setLoading(true);
    try {
      const res = await dispatch(
        getClientDashboardCases(selectedCaseType, pagination)
      );
      setPagination({
        ...pagination,
        total_records: res?.total_records || 0,
        total_pages: res?.total_pages || 1,
      });
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
      if (targetElement) {
        caseListRef.current.scrollTo({ top: targetElement.offsetTop, behavior: 'smooth' });
      }
    }  

  }, [dashboard]);

  return (
    <Fade>
      <div className="mt-4 px-2">
        <div>
          <Col xs={12} className="pb-3 px-md-4 px-sm-3 p-2 px-2">
            <Row className="mt-2">
              <div className="clients-container overflow-none min-vh-0 ">
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
                <Row className="clients py-md-4 py-2 px-md-4 px-2 gap-3" ref={caseListRef}>
                  {!loading && dashboard.length > 0 ? (
                    dashboard?.map((value, index) => {
                      return (
                        <div id={value?.case?.id} className="px-0" key={index}>
                          <ClientCase data={value} caseId={id} />
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
              </div>
            </Row>
            <div className="d-flex justify-content-end px-4 py-3">
              <Pagination
                value={pagination.page}
                onChange={(page) => setPagination({ ...pagination, page })}
                total={pagination?.total_pages}
                position={"right"}
                radius="md"
              />
            </div>
          </Col>
        </div>
      </div>
    </Fade>
  );
};

export default ClientDashboard;
