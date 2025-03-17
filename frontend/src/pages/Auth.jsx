import { Col, Row } from "react-bootstrap";
import whitelogo from "../assets/images/white-logo.png";
import logo from "../assets/images/logo.png";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Fade from "react-reveal/Fade";
import Header from "../components/layout/Header";
import AsideProvider from "../contexts/AsideContext";
import { UseGetRole } from "../hooks/auth";

const Auth = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = UseGetRole();

  useEffect(() => {
    const afterTokenExpires = new Date(
      localStorage.getItem("afterTokenExpires")
    );

    if (token && afterTokenExpires >= Date.now()) {
      navigate(`/${role}/dashboard`);
    }
  }, [navigate, token]);

  return (
    <Fade>
      <div className="max-vw-100">
        <AsideProvider>
          <Header />
        </AsideProvider>
        <Row className="min-vh-100 w-100 mx-0">
          <Col
            md={6}
            xl={8}
            lg={7}
            className="signincolumns backimgcoldiv px-0 position-sticky top-0 max-vh-100"
          >
            <div className="maindiv"></div>
          </Col>
          <Col
            xs={12}
            md={6}
            xl={4}
            lg={5}
            className="signincolumns d-flex justify-content-center px-0"
          >
            <div className="formdivouter py-5 d-flex flex-column align-items-center h-100 px-xl-5 px-md-4 px-sm-5 px-4 w-100">
              <div>
                <img
                  src={logo}
                  alt="the mdx lawsuit - logo"
                  width="165px"
                  style={{
                    marginTop: "40px",
                  }}
                />
              </div>
              <Outlet />
            </div>
          </Col>
        </Row>
      </div>
    </Fade>
  );
};

export default Auth;
