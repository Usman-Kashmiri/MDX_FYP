import React, { useEffect, useState } from "react";
import { Col, Container } from "react-bootstrap";
import { Box, Image, Pagination, Select } from "@mantine/core";
import LawyerCard from "../components/LawyerCard";
import SideNav from "../components/SideNav";
import hammer from "../assets/images/legal-professionals/hammer.webp";
import hammerBottom from "../assets/images/legal-professionals/hammer-bottom.webp";
import { useDispatch, useSelector } from "react-redux";
import Fade from "react-reveal/Fade";
import { ChatIcon } from "./DashboardLayout";
import Header from "../components/layout/Header";
import { useLocation } from "react-router-dom";
import { useAsideContext } from "../contexts/AsideContext";
import { fetchCases } from "../redux/actions/caseActions";

const FindLawyer = () => {
  const dispatch = useDispatch();
  const { foundLawyers } = useSelector((state) => state.web);
  const { isAuthenticated } = useSelector((store) => store.auth);
  const [totalPage, setTotalPage] = useState(0);
  const { state: locationProp } = useLocation();

  const [filteredLawyers, setFilteredLawyers] = useState([]);
  const [selectedCaseType, setSelectedCaseType] = useState("");

  useEffect(() => {
    setFilteredLawyers(foundLawyers);
  }, [foundLawyers]);

  useEffect(() => {
    isAuthenticated && dispatch(fetchCases("all"));
  }, [isAuthenticated]);

  const { isAsideOpened, closeAside } = useAsideContext();

  const { practice } = useSelector((state) => state?.formFields);

  return (
    <Fade>
      <div className="find-lawyer-container max-vw-100 min-vh-100">
        <div
          className={`aside-container max-vh-100 ${
            isAsideOpened ? "active" : ""
          }`}
        >
          <SideNav
            caseType={selectedCaseType || locationProp?.area_of_practice?.id}
            setSelectedCaseType={setSelectedCaseType}
          />
        </div>

        {isAsideOpened && (
          <div className="aside-overlay" onClick={closeAside}></div>
        )}

        <div
          className="find-lawyer-main"
          style={{ backgroundColor: "var(--stone-color)" }}
        >
          <div
            style={{ zIndex: 10 }}
            className="position-sticky top-0 start-0 w-100"
          >
            <Header />
          </div>

          <Container
            fluid
            className="p-md-5 p-sm-4 p-3 legal-professionals-box"
          >
            {filteredLawyers?.length > 0 ? (
              <>
                <h3 className="text-darker-grey font-montserrat fw-semibold fs-5">
                  {filteredLawyers?.length} lawyers are available based on your
                  search
                </h3>

                <div className="find-lawyer-grid py-5 align-items-stretch">
                  {filteredLawyers?.map((lawyer, i) => {
                    return <LawyerCard lawyerDetails={lawyer} key={i} />;
                  })}
                </div>

                {totalPage?.length > 0 ? (
                  <Pagination
                    total={setTotalPage(totalPage + 1)}
                    position={"right"}
                    radius="md"
                  />
                ) : null}
              </>
            ) : (
              <div className="d-flex flex-column justify-content-center align-items-center">
                <Col lg={5} xs={12} className="d-flex justify-content-center">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-end",
                      position: "relative",
                      width: "100%",
                      maxWidth: "360px",
                      aspectRatio: "1/1",
                      "@media screen and (max-width:576px)": {
                        maxWidth: "280px",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        maxWidth: "360px",
                        aspectRatio: "2/1.45",
                        cursor: "pointer",
                        "&:hover": {
                          ".hammer-image": {
                            transform: "rotate(17deg)",
                            transformOrigin: "92% 74%",
                          },
                        },
                        "@media screen and (max-width:576px)": {
                          maxWidth: "280px",
                        },
                      }}
                    >
                      <Image
                        src={hammer}
                        alt="judge-hammer"
                        className="hammer-image"
                        sx={{
                          position: "absolute",
                          transform: "rotate(0)",
                          transition: "ease-in 0.25s",
                        }}
                      />
                      <Image
                        src={hammerBottom}
                        alt="judge-hammer-bottom-piece"
                        className="hammer-bottom-image"
                        sx={{
                          position: "absolute",
                        }}
                      />
                    </Box>
                  </Box>
                </Col>
                <Col lg={4} md={5} sm={7} xs={11}>
                  <Select
                    searchable
                    size="sm"
                    name="caseType"
                    value={
                      selectedCaseType || locationProp?.area_of_practice?.id
                    }
                    defaultValue={
                      selectedCaseType || locationProp?.area_of_practice?.id
                    }
                    onChange={(value) => setSelectedCaseType(value)}
                    className="select-dropdown font-montserrat"
                    placeholder="Please select a case type"
                    data={practice?.map((item) => {
                      if (item?.status === 1) {
                        return {
                          value: item?.id,
                          label: item?.name,
                        };
                      } else {
                        return null;
                      }
                    })}
                  />
                </Col>
              </div>
            )}
          </Container>
        </div>
      </div>

      <ChatIcon />
    </Fade>
  );
};

export default FindLawyer;
