import logo from "../../assets/images/Logo.svg";
import hammer from "../../assets/images/hammer.png";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  copyrightNavigation,
  privacy_policy,
  terms_of_service,
} from "../../data/data";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import SignUpModal from "../SignUpModal";
import { useDispatch } from "react-redux";
import { useForm, yupResolver } from "@mantine/form";
import { subscribeSchema } from "../../validations/ValidationSchema";
import { subscribe } from "../../redux/actions/webActions";
import { errorMessage } from "../../globalFunctions";

const Footer = () => {
  const dispatch = useDispatch();
  const [opened, { open, close }] = useDisclosure(false);

  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState("");

  const handleTermsOfServiceModal = (modalType) => {
    if (modalType === "tos") {
      setModalTitle("Terms of Services");
      setModalContent(terms_of_service);
    } else {
      setModalTitle("Privacy Policy");
      setModalContent(privacy_policy);
    }
    open();
  };
  const form = useForm({
    initialValues: {
      email: "",
    },
    validateInputOnBlur: true,
    validateInputOnChange: ["email"],
    validate: yupResolver(subscribeSchema),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.values?.email) {
      form.validate();
      if (Object.keys(form.errors).length === 0) {
        const res = await dispatch(subscribe(form.values));
        if (res.res === "success") {
          form.reset();
        }
      } else {
        errorMessage("Please Write correct email");
      }
    }
  };

  return (
    <>
      <div className="footermainestdiv max-vw-100 overflow-x-hidden position-relative">
        <div className="footermaininnerdiv container">
          <div className="footerfirstdiv">
            <Row className="gap-lg-0 gap-5 justify-content-around flex-row ">
              <Col className="topboxone ps-4" md={5}>
                <span className="text-dark-grey font-lora fs-6 fst-italic">
                  Describe your problem and get advice
                </span>
                <a href="tel:090078601" className="text-decoration-none">
                  <p className="font-lora fw-bold text-white fs-5 text-break">
                    0900 78601
                  </p>
                </a>
              </Col>
              <Col className="topboxone ps-4" md={5}>
                <span className="text-dark-grey font-lora fs-6 fst-italic">
                  Send Us Message !
                </span>
                <a
                  href="mailto:info@mdxlawsuit.com"
                  className="text-decoration-none"
                >
                  <p className="font-lora fw-bold text-white fs-5 text-break">
                    info@mdxlawsuit.com
                  </p>
                </a>
              </Col>
            </Row>
          </div>
          <div className="footerseconddiv">
            <Row className="gap-xl-0 gap-2 pb-4 justify-content-around flex-row ">
              <Col
                xl={5}
                md={7}
                className="d-flex align-items-xl-start align-items-center"
              >
                <Col xl={4} md={3} xs={3} className="me-3">
                  <img src={logo} className="footerlogo w-100" />
                </Col>
                <p className="footerlastcentertext">
                  The MDX Lawsuit is a perfectly suited legal advisers and
                  offices, lawyers, attorneys, counsels, advocates and other
                  legal and law related services. The MDX Lawsuit started as a
                  sole practitioner providing services to the area community.
                </p>
              </Col>
              <Col xl={3} md={4}>
                <p className="footerheadinglast">Newsletter</p>
                <p className="openingdays">
                  Don't miss to subscribe to our news feeds, kindly fill the
                  form below
                </p>
                <div className="footerlastdivinputandbtn">
                  <form
                    onSubmit={(e) => {
                      handleSubmit(e);
                    }}
                  >
                    <input
                      className="footerlastdivinput text-white"
                      placeholder="Subscribe In Our News Letter"
                      id="email"
                      name="email"
                      onBlur={() => {
                        form.validateField("email"); // Validate the field onBlur
                      }}
                      error={form.errors.email}
                      // {...form.getInputProps("email")}
                      value={form.values.email}
                      onChange={(e) => {
                        form.setFieldValue("email", e.target.value);
                      }}
                    />
                    <button className="footerlastdivbtn" type="submit">
                      Subscribe
                    </button>
                  </form>
                </div>
              </Col>
            </Row>
            <Row className="hammerimgdiv justify-content-end w-100 pe-md-5 pe-0">
              <div className="col-lg-1 col-md-2 col-sm-3 col-6 p-0">
                <img className="hammerimg w-100" src={hammer} />
              </div>
            </Row>
          </div>
        </div>
      </div>
      <div className="copyright py-4">
        <Container>
          <Row className="justify-content-between align-items-center gap-3">
            <Col xl={5} md={5} xs={12}>
              <span className="text-grey">
                The MDX Lawsuit &copy; All Rights Reserved.
              </span>
            </Col>
            <Col
              className="d-flex gap-1 justify-content-between flex-wrap"
              xl={4}
              md={5}
              xs={12}
            >
              {copyrightNavigation.map((nav, i) => {
                return (
                  <Link
                    to={nav?.path}
                    onClick={
                      nav?.function === "tos"
                        ? () => handleTermsOfServiceModal("tos")
                        : nav?.function === "pp"
                        ? () => handleTermsOfServiceModal("pp")
                        : null
                    }
                    key={i}
                    className="text-decoration-none text-grey text-hover-white"
                  >
                    {nav.name}
                  </Link>
                );
              })}
            </Col>

            <SignUpModal
              isOpen={opened}
              isClosed={close}
              modalTittle={modalTitle}
              content={modalContent}
            />
          </Row>
        </Container>
      </div>
    </>
  );
};
export default Footer;
