import React, { useEffect, useRef } from "react";
import EditButton from "../../components/layout/EditButton";
import { useState } from "react";
import { useForm, yupResolver } from "@mantine/form";
import {
  webDetailsForAdmin,
  webSetting,
} from "../../redux/actions/adminActions";
import { WebSettingSchema } from "../../validations/ValidationSchema";
import { useDispatch, useSelector } from "react-redux";
import { TextInput } from "@mantine/core";
import { Col, Row, Spinner } from "react-bootstrap";
import image from "../../assets/images/help-area-bg.png";

const WebSetting = () => {
  const dispatch = useDispatch();

  const { webDetails, loading, loaderOfButton } = useSelector(
    (state) => state?.admin
  );

  const [webDetail, setWebDetail] = useState({});
  const [edit, setEdit] = useState(0);
  const [selectedFavicon, setSelectedFavicon] = useState(null);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const fileFieldOfFavicon = useRef(null);
  const fileFieldOfLogo = useRef(null);

  useEffect(() => {
    dispatch(webDetailsForAdmin());
  }, [dispatch]);

  const initialValues = {
    site_name: webDetail?.site_name || "",
    site_email: webDetail?.site_email || "",
    site_logo: webDetail?.site_logo || "",
    site_favicon: webDetail?.site_favicon || "",
    site_contact: webDetail?.site_contact || "",
    admin_commission_percent: webDetail?.admin_commission_percent || "",
    gpt_key: webDetail?.gpt_key || "",
    stripe_public_key: webDetail?.stripe_public_key || "",
    stripe_secret_key: webDetail?.stripe_secret_key || "",
    encryption_key: webDetail?.encryption_key || "",
  };

  const validateInputOnChangeFields = [
    "site_name",
    "site_email",
    "site_logo",
    "site_email",
    "site_favicon",
    "site_contact",
    "admin_commission_percent",
    "gpt_key",
    "stripe_public_key",
    "stripe_secret_key",
    "encryption_key",
  ];

  const form = useForm({
    initialValues: initialValues,
    validateInputOnBlur: true,
    validateInputOnChange: validateInputOnChangeFields,
    validate: yupResolver(WebSettingSchema),
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    form.validate();

    if (Object.keys(form.errors).length === 0) {
      const res = await dispatch(webSetting(form.values));
      if (res?.res === "success") {
        setEdit(0);
        dispatch(webDetailsForAdmin());
      }
    }
  };

  useEffect(() => {
    if (webDetails) {
      setWebDetail(webDetails);
      form.setFieldValue("encryption_key", webDetails?.encryption_key);
      form.setFieldValue("stripe_secret_key", webDetails?.stripe_secret_key);
      form.setFieldValue("stripe_public_key", webDetails?.stripe_public_key);
      form.setFieldValue("gpt_key", webDetails?.gpt_key);
      form.setFieldValue(
        "admin_commission_percent",
        webDetails?.admin_commission_percent
      );
      form.setFieldValue("site_contact", webDetails?.site_contact);
      form.setFieldValue("site_favicon", webDetails?.site_favicon);
      form.setFieldValue("site_logo", webDetails?.site_logo);
      form.setFieldValue("site_email", webDetails?.site_email);
      form.setFieldValue("site_name", webDetails?.site_name);
    }
  }, [webDetails]);

  const handleImagePreviewerForLogo = (e) => {
    var reader = new FileReader();
    reader.onload = function () {
      setSelectedLogo(reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);

    setSelectedLogo(e.target.files[0]);
    form.setFieldValue("site_logo", e.target.files[0]);
  };

  const handleImagePreviewerForFavicon = (e) => {
    var reader = new FileReader();
    reader.onload = function () {
      setSelectedFavicon(reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);

    setSelectedFavicon(e.target.files[0]);
    form.setFieldValue("site_favicon", e.target.files[0]);
  };

  return (
    <div className="pb-md-5 pb-0 mb-md-5 px-md-5 px-3 min-vh-50 ">
      <div className="d-flex flex-row justify-content-between align-items-center">
        <h2 className="mt-0  mb-0">Website Settings</h2>
        {edit === 0 && (
          <EditButton
            onClick={() => {
              setEdit(1);
            }}
          />
        )}
      </div>

      {!loading ? (
        <form onSubmit={handleFormSubmit} className="mt-5 manage-profile-form">
          <Row>
            <Col sm={6} xs={12} className="d-flex flex-column mt-3 pe-md-3">
              <label className="w-fit-content">
                <span
                  className={`span-label-of-web-setting ${
                    edit === 1 && "image-label-of-website-setting"
                  }`}
                >
                  Site Logo
                </span>
                <div
                  className={`rounded-circle profile-image ${
                    edit === 1 ? "camera-icon-before cursor-pointer" : ""
                  }`}
                  style={{
                    marginTop: "8px",
                  }}
                >
                  <img
                    src={
                      selectedLogo !== null
                        ? selectedLogo
                        : webDetail?.site_logo
                        ? webDetail?.site_logo
                        : image
                    }
                    alt="user"
                    className="rounded-circle"
                  />

                  {edit === 1 && (
                    <>
                      <input
                        ref={fileFieldOfLogo}
                        type="file"
                        onChange={handleImagePreviewerForLogo}
                        id="site_logo"
                        name="site_logo"
                        className="d-none"
                      />
                    </>
                  )}
                </div>
              </label>
            </Col>
            <Col sm={6} xs={12} className="d-flex flex-column mt-3 ps-md-3">
              <label className="w-fit-content">
                <span
                  className={`span-label-of-web-setting ${
                    edit === 1 && "image-label-of-website-setting"
                  }`}
                >
                  Site favicon
                </span>
                <div
                  className={`rounded-circle profile-image  ${
                    edit === 1 ? "camera-icon-before cursor-pointer" : ""
                  }`}
                  style={{
                    marginTop: "8px",
                  }}
                >
                  <img
                    src={
                      selectedFavicon !== null
                        ? selectedFavicon
                        : webDetail?.site_favicon
                        ? webDetail?.site_favicon
                        : image
                      // "selectedImage !== null ? selectedImage : userData.image"
                    }
                    alt="user"
                    className="rounded-circle"
                  />

                  {edit === 1 && (
                    <>
                      <input
                        ref={fileFieldOfFavicon}
                        type="file"
                        onChange={handleImagePreviewerForFavicon}
                        id="site_favicon"
                        name="site_favicon"
                        className="d-none"
                      />
                    </>
                  )}
                </div>
              </label>
            </Col>
            <Col sm={6} xs={12} className="d-flex flex-column mt-3 pe-md-3">
              {edit !== 1 && (
                <span className="span-label-of-web-setting">Site Name</span>
              )}
              {edit === 1 ? (
                <TextInput
                  label="Site Name"
                  id="site_name"
                  name="site_name"
                  placeholder="Enter site name"
                  {...form.getInputProps("site_name")}
                />
              ) : (
                <span>{webDetail?.site_name || "N/A"}</span>
              )}
            </Col>
            <Col sm={6} xs={12} className="d-flex flex-column mt-3 ps-md-3">
              {edit !== 1 && (
                <span className="span-label-of-web-setting">Site Email</span>
              )}
              {edit === 1 ? (
                <TextInput
                  label="Site Email"
                  id="site_email"
                  name="site_email"
                  placeholder="Enter site email"
                  {...form.getInputProps("site_email")}
                />
              ) : (
                <span>{webDetail?.site_email || "N/A"}</span>
              )}
            </Col>
            <Col sm={6} xs={12} className="d-flex flex-column mt-3 pe-md-3">
              {edit !== 1 && (
                <span className="span-label-of-web-setting">Site Contact</span>
              )}
              {edit === 1 ? (
                <TextInput
                  label="Site Contact"
                  id="site_contact"
                  name="site_contact"
                  type="number"
                  placeholder="Enter site contact"
                  {...form.getInputProps("site_contact")}
                />
              ) : (
                <span>{webDetail?.site_contact || "N/A"}</span>
              )}
            </Col>
            <Col sm={6} xs={12} className="d-flex flex-column mt-3 ps-md-3">
              {edit !== 1 && (
                <span className="span-label-of-web-setting">
                  Admin Commission
                </span>
              )}
              {edit === 1 ? (
                <TextInput
                  label="Admin Commission"
                  id="admin_commission_percent"
                  name="admin_commission_percent"
                  placeholder="Enter admin commission"
                  {...form.getInputProps("admin_commission_percent")}
                />
              ) : (
                <span className="text-break">
                  {webDetail?.admin_commission_percent || "N/A"}%
                </span>
              )}
            </Col>
            <Col sm={6} xs={12} className="d-flex flex-column mt-3 pe-md-3">
              {edit !== 1 && (
                <span className="span-label-of-web-setting">GPT Key</span>
              )}
              {edit === 1 ? (
                <TextInput
                  label="GPT Key"
                  className="text-break"
                  id="gpt_key"
                  name="gpt_key"
                  placeholder="Enter gpt key"
                  {...form.getInputProps("gpt_key")}
                />
              ) : (
                <span className="text-break">
                  {webDetail?.gpt_key || "N/A"}
                </span>
              )}
            </Col>
            <Col sm={6} xs={12} className="d-flex flex-column mt-3 ps-md-3">
              {edit !== 1 && (
                <span className="span-label-of-web-setting">
                  Stripe Public Key
                </span>
              )}
              {edit === 1 ? (
                <TextInput
                  className="text-break"
                  label="Stripe Public Key"
                  id="stripe_public_key"
                  name="stripe_public_key"
                  placeholder="Enter stripe pk"
                  {...form.getInputProps("stripe_public_key")}
                />
              ) : (
                <span className="text-break">
                  {webDetail?.stripe_public_key || "N/A"}
                </span>
              )}
            </Col>
            <Col sm={6} xs={12} className="d-flex flex-column mt-3 pe-md-3">
              {edit !== 1 && (
                <span className="span-label-of-web-setting">
                  Stripe Secret Key
                </span>
              )}
              {edit === 1 ? (
                <TextInput
                  label="Stripe Secret Key"
                  id="stripe_secret_key"
                  name="stripe_secret_key"
                  className="text-break"
                  placeholder="Enter stripe sk"
                  {...form.getInputProps("stripe_secret_key")}
                />
              ) : (
                <span className="text-break">
                  {webDetail?.stripe_secret_key || "N/A"}
                </span>
              )}
            </Col>
            <Col sm={6} xs={12} className="d-flex flex-column mt-3 ps-md-3">
              {edit !== 1 && (
                <span className="span-label-of-web-setting">
                  Encryption Key
                </span>
              )}
              {edit === 1 ? (
                <TextInput
                  label="Encryption Key"
                  id="encryption_key"
                  className="text-break"
                  name="encryption_key"
                  placeholder="Enter encryption key"
                  {...form.getInputProps("encryption_key")}
                />
              ) : (
                <span className="text-break">
                  {webDetail?.encryption_key || "N/A"}
                </span>
              )}
            </Col>
          </Row>

          {edit === 1 && (
            <div className="d-flex justify-content-end  mt-4 gap-3">
              <button
                className="grey-btn-of-cancels cancel-btn-of-site-setting  text-capitalize btn-of-datatable"
                onClick={() => {
                  setEdit(0);
                }}
              >
                Cancel
              </button>
              <button
                disabled={loaderOfButton}
                type="submit"
                className="primary-btn  text-capitalize btn-of-datatable"
              >
                {loaderOfButton && <Spinner animation="border" />}
                Update
              </button>
            </div>
          )}
        </form>
      ) : (
        <div
          className="d-flex justify-content-center align-items-center flex-column"
          style={{ minHeight: "60vh" }}
        >
          <Spinner animation="border" />
        </div>
      )}
    </div>
  );
};

export default WebSetting;
