import React, { useEffect, useState } from "react";
import { Col, Container } from "react-bootstrap";
import logo from "../assets/images/Logo.svg";
import { Select } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "../redux/actions/authActions";
import { webConstants } from "../redux/constants/webContants";
import { fetchPractice } from "../redux/actions/formActions";
import {
  findLawyers,
  getCountriesOfJurisdictions,
  getJurisdictionByCountry,
} from "../redux/actions/webActions";
import {
  CloseDrawerIcon,
  DrawerHamBurger,
  OpenDrawerIcon,
} from "../assets/icons/DrawerHamBurgers";
import { useAsideContext } from "../contexts/AsideContext";
import { AiOutlineClear } from "react-icons/ai";
import { useFormik } from "formik";

const SideNav = ({ caseType, setSelectedCaseType }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { socket } = useSelector((store) => store.web);
  const [jurisdictionsState, setJurisdictionState] = useState([]);
  const [getCountriesOfJurisdiction, setCountriesOfJurisdiction] = useState([]);
  const { practice } = useSelector((state) => state.formFields);
  const { jurisdictions, countries } = useSelector((state) => state?.web);
  const { isAsideOpened, toggleAside } = useAsideContext();
  const { state: locationProp } = useLocation();

  const { values, touched, setFieldValue, setFieldTouched, resetForm } =
    useFormik({
      initialValues: {
        caseType: locationProp?.area_of_practice?.id || "",
        country: "",
        jurisdiction: "",
      },
    });

  const token = localStorage.getItem("token");

  const handleSelectDropdwon = (name, value = null) => {
    if (value !== null) {
      if (name === "caseType") {
        setSelectedCaseType(value);
      }
      setFieldValue(name, value);
    }
  };

  useEffect(() => {
    dispatch(getCountriesOfJurisdictions());
  }, []);

  useEffect(() => {
    setCountriesOfJurisdiction(countries);
  }, [countries]);

  useEffect(() => {
    setJurisdictionState(jurisdictions);
  }, [jurisdictions]);

  const handleClearFilters = () => {
    handleSelectDropdwon("caseType", "");
    handleSelectDropdwon("jurisdiction", "");
    resetForm();

    // ? clear all filtered lawyers
    dispatch({
      type: webConstants.FIND_LAWYER_SUCCESS,
      payload: [],
    });
  };

  useEffect(() => {
    dispatch(fetchPractice());
  }, []);

  const handleLogout = async () => {
    socket.emit("logout");
    navigate("/");
    await dispatch(logout());
  };

  const handleCountry = async (value) => {
    setFieldValue("country", value);

    if (value) {
      await dispatch(getJurisdictionByCountry(value));
    }
  };

  useEffect(() => {
    const practiceArea = practice.find(
      (item) =>
        item?.name?.toLowerCase() ===
        locationProp?.area_of_practice?.name?.toLowerCase()
    );

    caseType === "" && setSelectedCaseType(practiceArea?.id);
    if (values.jurisdiction && caseType) {
      dispatch(
        findLawyers(
          `?jurisdiction_id=${values.jurisdiction}&area_expertise_id=${caseType}`
        )
      );
    } else if (caseType) {
      dispatch(findLawyers(`?area_expertise_id=${caseType}`));
    } else if (values.jurisdiction) {
      dispatch(findLawyers(`?jurisdiction_id=${values.jurisdiction}`));
    } else if (caseType === "") {
      // ? clear all filtered lawyers
      dispatch({
        type: webConstants.FIND_LAWYER_SUCCESS,
        payload: [],
      });
    }
  }, [values.jurisdiction, caseType, dispatch]);

  return (
    <Container fluid className="bg-white py-4 px-0 h-100 position-relative">
      <span className="aside-toggler d-xl-none position-absolute top-0 mt-3 ms-2">
        <DrawerHamBurger
          Icon={isAsideOpened ? CloseDrawerIcon : OpenDrawerIcon}
          color="#D5AA6D"
          size={30}
          onClick={toggleAside}
          className="cursor-pointer"
        />
      </span>
      <div className="d-flex flex-column gap-2 align-items-center justify-content-between">
        <div className="d-flex flex-column align-items-center gap-5 w-100">
          <div>
            <img src={logo} width={125} alt="lawyer - logo" />
          </div>
          <Col xs={12} className="px-0">
            <span className="text-darker-grey font-montseSexual Offencesrrat fw-semibold d-flex align-items-center gap-2 px-5 fs-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                width={24}
                strokeWidth={1.5}
                stroke="#687281"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                />
              </svg>
              Filter
            </span>
            <div className="divider bg-grey mt-1 mb-5"></div>
            <div className="d-flex flex-column gap-4 px-xxl-4 px-3">
              <div>
                <Select
                  label="Practice Area"
                  searchable
                  size="sm"
                  name="caseType"
                  value={caseType || ""}
                  defaultValue={caseType || ""}
                  onChange={(value) => handleSelectDropdwon("caseType", value)}
                  className="select-dropdown font-montserrat"
                  placeholder="Select a practice area"
                  nothingFound={"Nothing found"}
                  data={
                    practice.length > 0
                      ? practice?.map((item) => {
                          if (item?.status === 1) {
                            return {
                              value: item?.id,
                              label: item?.name,
                            };
                          } else {
                            return null;
                          }
                        })
                      : []
                  }
                />
              </div>
              <div>
                <Select
                  label="Country"
                  searchable
                  size="sm"
                  name="country"
                  defaultValue={values.country}
                  value={values.country}
                  onChange={(value) => handleCountry(value)}
                  className="select-dropdown font-montserrat"
                  placeholder="Select a country"
                  nothingFound={"Nothing found"}
                  data={
                    getCountriesOfJurisdiction.length > 0
                      ? getCountriesOfJurisdiction?.map((item) => {
                          if (item?.status === 1) {
                            return {
                              value: item?.id,
                              label: item?.name,
                            };
                          } else {
                            return null;
                          }
                        })
                      : []
                  }
                />
              </div>
              <div>
                <Select
                  label="Jurisdiction"
                  searchable
                  size="sm"
                  name="jurisdiction"
                  value={values.jurisdiction}
                  defaultValue={values.jurisdiction}
                  onChange={(value) =>
                    handleSelectDropdwon("jurisdiction", value)
                  }
                  onClick={() => setFieldTouched("jurisdiction")}
                  className="select-dropdown font-montserrat"
                  error={
                    touched.jurisdiction && values.country === ""
                      ? "Please select a country first!"
                      : null
                  }
                  placeholder="Select a jurisdiction"
                  nothingFound={"Nothing found"}
                  data={
                    jurisdictionsState.length > 0
                      ? jurisdictionsState?.map((item) => {
                          if (item?.status === 1) {
                            return {
                              value: item?.id,
                              label: item?.name,
                            };
                          } else {
                            return null;
                          }
                        })
                      : []
                  }
                />

                {values.jurisdiction || caseType || values.country ? (
                  <p
                    className="text-end cursor-pointer clear-filter mt-2"
                    onClick={() => handleClearFilters()}
                  >
                    Clear filters <AiOutlineClear />
                  </p>
                ) : null}
              </div>
            </div>
          </Col>
        </div>
        {token && (
          <button className="primary-btn rounded-1" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </Container>
  );
};

export default SideNav;
