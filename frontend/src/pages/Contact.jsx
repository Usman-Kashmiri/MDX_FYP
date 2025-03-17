import React, { useEffect } from "react";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import TopSection from "../components/TopSection";
import Fade from "react-reveal/Fade";
import { useDispatch } from "react-redux";
import { useForm, yupResolver } from "@mantine/form";
import { ContactUsSchema } from "../validations/ValidationSchema";
import { successMessage } from "../globalFunctions";
import { postMessageOfContactUs } from "../redux/actions/webActions";
import { Button, TextInput, Textarea } from "@mantine/core";
import { useSelector } from "react-redux";

const Contact = () => {
  const dispatch = useDispatch();
  const { socket, loading } = useSelector((state) => state?.web);

  const initialValues = {
    username: "",
    email: "",
    subject: "",
    message: "",
  };

  const validateInputOnChange = ["username", "email", "subject", "message"];

  const form = useForm({
    initialValues: initialValues,
    validateInputOnChange: validateInputOnChange,
    validateInputOnBlur: true,
    validate: yupResolver(ContactUsSchema),
  });

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    form.validate();
    if (!form.validate().hasErrors) {
      if (Object.keys(form.errors).length === 0) {
        const res = await dispatch(postMessageOfContactUs(form.values));
        if (res.res === "success") {
          socket.emit("newContactUsNotification", res?.data);
          successMessage(res?.message);
          form.reset();
        }
      }
    }
  };

  return (
    <>
      <Fade>
        <TopSection
          sectionClass="contact-top-section"
          topSpan="We Want to Hear From You"
          heading="Contact Us"
          activePage="Contact"
        />

        <section className="contact-us">
          <Container>
            <Row>
              <Col md={6} xs={12}>
                <div className="Title-area">
                  <h3 className="font-lora">Get In Toutch</h3>
                  <h2 className="font-raleway text-uppercase">Contact Us</h2>
                  <p className="font-open-sans">
                    Feel free to get in touch with any enquiries and one of our
                    friendly members of staff will get back to you as soon as
                    possible, we are here to help!
                  </p>
                </div>
              </Col>
            </Row>
            <Row className="flex-md-row flex-column-reverse">
              <Col lg={8} md={6}>
                <div className="contact-us-form">
                  <form className="row" onSubmit={handleSubmit}>
                    <Col md={6} className="ps-md-0 mt-3">
                      <TextInput
                        label="Username"
                        type="text"
                        id="username"
                        name="username"
                        className="form-inputs-of-contactus"
                        placeholder="Enter Username"
                        {...form.getInputProps("username")}
                      />
                    </Col>
                    <Col md={6} className="pe-md-0 mt-3">
                      <TextInput
                        label="Email"
                        type="email"
                        id="email"
                        name="email"
                        className="form-inputs-of-contactus"
                        placeholder="Enter Email"
                        {...form.getInputProps("email")}
                      />
                    </Col>
                    <Col xs={12} className="p-md-0 mt-3">
                      <TextInput
                        label="Subject"
                        type="text"
                        id="subject"
                        name="subject"
                        className="form-inputs-of-contactus"
                        placeholder="Enter Subject"
                        {...form.getInputProps("subject")}
                      />
                    </Col>
                    <Col xs={12} className="p-md-0 mt-3">
                      <Textarea
                        label="Message"
                        rows="8"
                        id="message"
                        name="message"
                        className="form-inputs-of-contactus"
                        placeholder="Enter Message"
                        {...form.getInputProps("message")}
                      />
                    </Col>
                    <Col xs={12} className="p-md-0 mt-4">
                      <Button
                        type="submit"
                        loading={loading}
                        uppercase
                        className="btn-brown-square"
                      >
                        SEND MESSAGE
                      </Button>
                    </Col>
                  </form>
                </div>
              </Col>
              <Col lg={4} md={6} className="pe-0">
                <Row className="ps-3">
                  <Col lg={6}>
                    <div className="address-details">
                      <span>Phone :</span>
                      <span>
                        <i className="fa fa-phone"></i> +90078601
                      </span>
                      <span>
                        <i className="fa fa-fax"></i> +90078602
                      </span>
                    </div>
                  </Col>
                  <Col lg={6}>
                    <div className="address-details">
                      <span>Email :</span>
                      <span>
                        <i className="fa fa-envelope"></i>info@mdxlawsuit.com
                      </span>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </section>
      </Fade>
    </>
  );
};

export default Contact;
