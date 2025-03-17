import React, { useEffect, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import EditButton from "./layout/EditButton";
import { DatePickerInput } from "@mantine/dates";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { UseGetProvider, UseGetRole } from "../hooks/auth";
import { Button, Chip, MultiSelect, Select, TextInput } from "@mantine/core";
import {
  AddressInfoSchema,
  PersonalInfoSchema,
  PersonalInfoSchemaForClient,
} from "../validations/ValidationSchema";
import UpdateProfilePicture from "./dashboard/UpdateProfilePicture";
import { useForm, yupResolver } from "@mantine/form";
import {
  fetchCountries,
  fetchPractice,
  fetchStates,
} from "../redux/actions/formActions";
import {
  fetchPersonalInfo,
  updateAddressInfo,
  updatePersonalInfo,
} from "../redux/actions/userActions";
import ChangePasswordModal from "./dashboard/ChangePasswordModal";
import {
  getCountriesOfJurisdictions,
  getJurisdictionByCountry,
} from "../redux/actions/webActions";
import { errorMessage } from "../globalFunctions";

const ProfileTabContent = () => {
  const role = UseGetRole();
  const provider = UseGetProvider();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state?.auth?.user);

  useEffect(() => {
    dispatch(fetchPersonalInfo());
  }, [dispatch]);

  const [editState, setEditState] = useState(0);

  const handleEditState = (value) => {
    setEditState(value);
  };

  const handleCancel = () => {
    setEditState(0);
  };

  return (
    <Container fluid>
      <Row className="gap-5 justify-content-center">
        {provider === "nbundl" && (
          <div className="d-flex justify-content-end">
            <ChangePasswordModal />
          </div>
        )}
        <UpdateProfilePicture
          handleCancel={handleCancel}
          handleEditState={handleEditState}
          editState={editState}
          userRole={role}
        />
        <PersonalInfo
          handleCancel={handleCancel}
          handleEditState={handleEditState}
          editState={editState}
          userData={userData}
          userRole={role}
        />
        {role === "Client" && (
          <AddressInfo
            handleCancel={handleCancel}
            handleEditState={handleEditState}
            editState={editState}
            userData={userData}
            userRole={role}
          />
        )}
      </Row>
      <div className="d-flex justify-content-end">
        <Link className="ms-3 mt-4 delete-account-link d-md-none d-block">
          Delete Account
        </Link>
      </div>
    </Container>
  );
};

const PersonalInfo = ({
  handleEditState,
  editState,
  handleCancel,
  userRole,
  userData,
}) => {
  const dispatch = useDispatch();
  const [jurisdictions_list, setJurisdiction_list] = useState([]);
  const { states } = useSelector((state) => state.formFields);
  const role = JSON.parse(localStorage.getItem("user"))?.role;
  const { practice } = useSelector((state) => state.formFields);
  const { jurisdictions, countries } = useSelector((state) => state?.web);
  const { loading } = useSelector((state) => state.user);

  const form = useForm({
    initialValues:
      userRole === "Lawyer"
        ? {
            first_name: userData?.first_name,
            last_name: userData?.last_name,
            email: userData?.email,
            phone_number: userData?.phone_number || "",
            area_expertise_id: userData?.areaofexpertises || [],
            jurisdiction_id: userData?.jurisdictions || [],
            bar_membership_number: userData?.bar_membership_number || "",
            dob: userData.dob ? dayjs(userData?.dob) : null,
            country_id: "",
            state_id: "",
            zip_code: userData?.zip_code || "",
            city: userData?.city || "",
            address: userData?.address || "",
          }
        : {
            first_name: userData?.first_name,
            last_name: userData?.last_name,
            email: userData?.email,
            phone_number: userData?.phone_number || "",
            dob: userData.dob ? dayjs(userData?.dob) : null,
          },
    validateInputOnBlur: true,
    validateInputOnChange:
      userRole === "Lawyer"
        ? [
            "first_name",
            "last_name",
            "email",
            "phone_number",
            "area_expertise_id",
            "jurisdiction_id",
            "bar_membership_number",
            "dob",
            "country_id",
            "state_id",
            "zip_code",
            "city",
            "address",
          ]
        : ["first_name", "last_name", "email", "phone_number", "dob"],
    validate: yupResolver(
      userRole === "Lawyer" ? PersonalInfoSchema : PersonalInfoSchemaForClient
    ),
  });

  useEffect(() => {
    dispatch(fetchPractice());
    dispatch(getCountriesOfJurisdictions());
  }, [dispatch]);

  useEffect(() => {
    if (userData && countries?.length > 0) {
      form.setFieldValue(
        "country_id",
        countries?.find(
          (item) => Number(item?.id) === Number(userData?.country?.id)
        )?.id
      );
    } else {
      form.setFieldValue("country_id", "");
    }
  }, [userData, countries]);

  useEffect(() => {
    if (form?.values?.country_id) {
      dispatch(fetchStates(form?.values?.country_id));
      dispatch(getJurisdictionByCountry(form?.values?.country_id));
    }
  }, [dispatch, form?.values?.country_id]);

  useEffect(() => {
    if (role === "Lawyer" || role === "Client") {
      if (states.length > 0) {
        const state_id = states?.find(
          (item) => item?.id === userData?.state?.id
        )?.id;

        form.setFieldValue("state_id", state_id);
      } else {
        form.setFieldValue("state_id", "");
      }
    }
  }, [role, userData?.state, states]);

  const handleDependentDropdown = (value) => {
    form.setFieldValue("country_id", value);
    form.setFieldValue("state_id", "");
    form.setFieldValue("jurisdiction_id", []);
    dispatch(fetchStates(value));
    dispatch(getJurisdictionByCountry(value));
  };

  useEffect(() => {
    if (jurisdictions.length > 0) {
      setJurisdiction_list(
        jurisdictions?.map((jury, i) => {
          return {
            value: jury?.id,
            label: jury?.name,
          };
        })
      );
    }
  }, [jurisdictions]);

  useEffect(() => {
    if (userRole === "Lawyer") {
      if (userData?.jurisdictions?.length > 0) {
        form.setFieldValue(
          "jurisdiction_id",
          userData?.jurisdictions?.map((item) => item?.id)
        );
      } else {
        form.setFieldValue("jurisdiction_id", []);
      }
      if (userData?.area_expertise?.length > 0) {
        form.setFieldValue(
          "area_expertise_id",
          userData?.area_expertise?.map((item) => item?.id)
        );
      } else {
        form.setFieldValue("area_expertise_id", []);
      }
    }
  }, [userData, userRole]);

  const handleFormSubmit = async () => {
    if (Object.keys(form.errors).length === 0) {
      await dispatch(
        updatePersonalInfo(userRole, {
          ...form.values,
          dob: dayjs(new Date(form?.values?.dob)).format("YYYY-MM-DD"),
        })
      );
      handleEditState(0);
    }
  };

  return (
    <Col
      xs={12}
      className="personal-info d-flex flex-column align-items-start white-rounded-container position-relative"
    >
      <h3>Personal Information</h3>

      <div className="position-absolute me-md-4 me-2 mt-md-3 mt-4 pt-md-0 pt-2 end-0 w-auto">
        <EditButton onClick={() => handleEditState(2)} />
      </div>

      <Form
        onSubmit={(e) => {
          e.preventDefault();
          handleFormSubmit();
        }}
        autoComplete="off"
        className="row account-setting-form mt-5"
      >
        <Col sm={6} xs={12} className="d-flex flex-column">
          {editState !== 2 && <span className="span-label">First Name</span>}
          {editState === 2 ? (
            <TextInput
              label="First Name"
              id="first_name"
              name="first_name"
              placeholder="First name"
              {...form.getInputProps("first_name")}
            />
          ) : (
            <span>{userData?.first_name}</span>
          )}
        </Col>

        <Col sm={6} xs={12} className="d-flex flex-column">
          {editState !== 2 && <span className="span-label">Last Name</span>}
          {editState === 2 ? (
            <TextInput
              label="Last Name"
              id="last_name"
              name="last_name"
              placeholder="Last name"
              {...form.getInputProps("last_name")}
            />
          ) : (
            <span>{userData?.last_name}</span>
          )}
        </Col>

        <Col sm={6} xs={12} className="d-flex flex-column">
          {editState !== 2 && <span className="span-label">Email address</span>}
          {editState === 2 ? (
            <TextInput
              label="Email"
              id="email"
              name="email"
              disabled
              placeholder="Email address"
              {...form.getInputProps("email")}
            />
          ) : (
            <span>{userData?.email}</span>
          )}
        </Col>

        <Col sm={6} xs={12} className="d-flex flex-column">
          {editState !== 2 && <span className="span-label">Phone</span>}
          {editState === 2 ? (
            <TextInput
              label="Phone"
              id="phone_number"
              name="phone_number"
              placeholder="Phone number"
              {...form.getInputProps("phone_number")}
            />
          ) : (
            <span>{userData?.phone_number || "N/A"}</span>
          )}
        </Col>

        {userRole === "Lawyer" && (
          <>
            <Col sm={6} xs={12} className="d-flex flex-column">
              {editState !== 2 && (
                <span className="span-label">Area(s) of practice</span>
              )}
              {editState === 2 ? (
                <MultiSelect
                  searchable
                  label="Areas of practice"
                  id="area_expertise_id"
                  name="area_expertise_id"
                  data={
                    practice.length > 0
                      ? practice?.map((item) => {
                          return {
                            value: item?.id,
                            label: item?.name,
                          };
                        })
                      : []
                  }
                  placeholder="Please specify your areas of practice."
                  {...form.getInputProps("area_expertise_id")}
                />
              ) : (
                <div className="d-flex gap-2 flex-wrap mt-2">
                  <Chip.Group>
                    {userData?.area_expertise?.length > 0
                      ? userData?.area_expertise?.map((practice, i) => {
                          return (
                            <Chip value={practice.id} checked key={i}>
                              {practice.name}
                            </Chip>
                          );
                        })
                      : "N/A"}
                  </Chip.Group>
                </div>
              )}
            </Col>

            {userRole === "Lawyer" && (
              <Col sm={6} xs={12} className="d-flex flex-column">
                {editState !== 2 && <span className="span-label">Country</span>}
                {editState === 2 ? (
                  <Select
                    searchable
                    label="Country"
                    id="country_id"
                    name="country_id"
                    placeholder="Select Country"
                    data={
                      countries.length > 0
                        ? countries.map((country) => {
                            return {
                              label: country?.name,
                              value: country?.id,
                            };
                          })
                        : []
                    }
                    clearable
                    {...form.getInputProps("country_id")}
                    onChange={(value) => handleDependentDropdown(value)}
                  />
                ) : (
                  <span>{userData?.country?.name || "N/A"}</span>
                )}
              </Col>
            )}

            {userRole === "Lawyer" && (
              <Col sm={6} xs={12} className="d-flex flex-column">
                {editState !== 2 && <span className="span-label">state</span>}
                {editState === 2 ? (
                  <Select
                    searchable
                    label="State"
                    id="state_id"
                    name="state_id"
                    placeholder="Select State"
                    nothingFound="States Not Found"
                    data={
                      states.length > 0
                        ? states?.map((item) => {
                            return {
                              value: item?.id,
                              label: item?.name,
                            };
                          })
                        : []
                    }
                    clearable
                    {...form.getInputProps("state_id")}
                  />
                ) : (
                  <span>{userData?.state?.name || "N/A"}</span>
                )}
              </Col>
            )}

            {userRole === "Lawyer" && (
              <Col sm={6} xs={12} className="d-flex flex-column">
                {editState !== 2 && (
                  <span className="span-label">Jurisdictions</span>
                )}
                {editState === 2 ? (
                  <MultiSelect
                    searchable
                    label="Jurisdictions"
                    id="jurisdiction_id"
                    name="jurisdiction_id"
                    data={jurisdictions_list}
                    placeholder="Select jurisdictions"
                    {...form.getInputProps("jurisdiction_id")}
                  />
                ) : (
                  <div className="d-flex gap-2 flex-wrap mt-2">
                    <Chip.Group>
                      {userData?.jurisdictions?.length > 0
                        ? userData?.jurisdictions?.map((jurisdiction, i) => {
                            return (
                              <Chip value={jurisdiction?.id} checked key={i}>
                                {jurisdiction?.name}
                              </Chip>
                            );
                          })
                        : "N/A"}
                    </Chip.Group>
                  </div>
                )}
              </Col>
            )}
          </>
        )}

        <Col sm={6} xs={12} className="d-flex flex-column">
          {editState !== 2 && <span className="span-label">Date of Birth</span>}
          {editState === 2 ? (
            <DatePickerInput
              label="Date of Birth"
              name="dob"
              icon={
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.5524 1.67374H11.9874V0.891243C11.9874 0.683713 11.905 0.484682 11.7582 0.337936C11.6115 0.19119 11.4124 0.108749 11.2049 0.108749C10.9974 0.108749 10.7983 0.19119 10.6516 0.337936C10.5049 0.484682 10.4224 0.683713 10.4224 0.891243V1.67374H5.72745V0.891243C5.72745 0.683713 5.64501 0.484682 5.49827 0.337936C5.35152 0.19119 5.15249 0.108749 4.94496 0.108749C4.73743 0.108749 4.5384 0.19119 4.39165 0.337936C4.24491 0.484682 4.16247 0.683713 4.16247 0.891243V1.67374H2.59748C1.97489 1.67374 1.3778 1.92106 0.937561 2.3613C0.497323 2.80154 0.25 3.39863 0.25 4.02122V13.4111C0.25 14.0337 0.497323 14.6308 0.937561 15.0711C1.3778 15.5113 1.97489 15.7586 2.59748 15.7586H13.5524C14.175 15.7586 14.7721 15.5113 15.2123 15.0711C15.6525 14.6308 15.8999 14.0337 15.8999 13.4111V4.02122C15.8999 3.39863 15.6525 2.80154 15.2123 2.3613C14.7721 1.92106 14.175 1.67374 13.5524 1.67374ZM14.3349 13.4111C14.3349 13.6187 14.2524 13.8177 14.1057 13.9644C13.9589 14.1112 13.7599 14.1936 13.5524 14.1936H2.59748C2.38995 14.1936 2.19092 14.1112 2.04417 13.9644C1.89743 13.8177 1.81499 13.6187 1.81499 13.4111V7.93368H14.3349V13.4111ZM14.3349 6.3687H1.81499V4.02122C1.81499 3.81369 1.89743 3.61466 2.04417 3.46791C2.19092 3.32116 2.38995 3.23872 2.59748 3.23872H4.16247V4.02122C4.16247 4.22875 4.24491 4.42778 4.39165 4.57452C4.5384 4.72127 4.73743 4.80371 4.94496 4.80371C5.15249 4.80371 5.35152 4.72127 5.49827 4.57452C5.64501 4.42778 5.72745 4.22875 5.72745 4.02122V3.23872H10.4224V4.02122C10.4224 4.22875 10.5049 4.42778 10.6516 4.57452C10.7983 4.72127 10.9974 4.80371 11.2049 4.80371C11.4124 4.80371 11.6115 4.72127 11.7582 4.57452C11.905 4.42778 11.9874 4.22875 11.9874 4.02122V3.23872H13.5524C13.7599 3.23872 13.9589 3.32116 14.1057 3.46791C14.2524 3.61466 14.3349 3.81369 14.3349 4.02122V6.3687Z"
                    fill="#36CB83"
                  />
                </svg>
              }
              className="mx-0"
              placeholder="Please select date of birth"
              mx="auto"
              maw={400}
              value={
                form.values.dob && form.values.dob !== ""
                  ? dayjs(form.values.dob)
                  : null
              }
              onChange={(e) => {
                form.setFieldValue("dob", dayjs(e).format("YYYY-MM-DD"));
              }}
              {...form.getInputProps("dob")}
            />
          ) : (
            <span>{userData?.dob || "N/A"}</span>
          )}
        </Col>

        {userRole === "Lawyer" && (
          <Col sm={6} xs={12} className="d-flex flex-column">
            {editState !== 2 && (
              <span className="span-label">
                Bar Association Membership Number
              </span>
            )}

            {editState === 2 ? (
              <TextInput
                label="Bar Association Membership Number"
                id="bar_association_membership_number"
                name="bar_association_membership_number"
                placeholder="Bar Association Membership Number"
                {...form.getInputProps("bar_membership_number")}
              />
            ) : (
              <span>{userData?.bar_membership_number || "N/A"}</span>
            )}
          </Col>
        )}

        {userRole === "Lawyer" && (
          <Col sm={6} xs={12} className="d-flex flex-column">
            {editState !== 2 && (
              <span className="span-label">
                {userRole === "Lawyer" ? "Office Address" : "Address"}
              </span>
            )}

            {editState === 2 ? (
              <TextInput
                label="Address"
                id="address"
                name="address"
                placeholder={
                  userRole === "Lawyer" ? "Office Address" : "Address"
                }
                {...form.getInputProps("address")}
              />
            ) : (
              <span>{userData?.address || "N/A"}</span>
            )}
          </Col>
        )}

        {userRole === "Lawyer" && (
          <Col sm={6} xs={12} className="d-flex flex-column">
            {editState !== 2 && <span className="span-label">City</span>}
            {editState === 2 ? (
              <TextInput
                label="City"
                id="city"
                name="city"
                placeholder="City"
                {...form.getInputProps("city")}
              />
            ) : (
              <span>{userData?.city || "N/A"}</span>
            )}
          </Col>
        )}

        {userRole === "Lawyer" && (
          <Col sm={6} xs={12} className="d-flex flex-column">
            {editState !== 2 && <span className="span-label">Zip Code</span>}
            {editState === 2 ? (
              <TextInput
                label="Zip Code"
                id="zip_code"
                name="zip_code"
                placeholder="Zip Code"
                {...form.getInputProps("zip_code")}
              />
            ) : (
              <span>{userData?.zip_code || "N/A"}</span>
            )}
          </Col>
        )}

        {editState === 2 && (
          <div className="d-flex justify-content-end gap-3">
            <button
              type="button"
              className="btn btn-outline-danger rounded-pill px-4 mt-2"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <Button
              loading={loading}
              loaderProps={{ color: "#198754" }}
              type="submit"
              className="btn btn-outline-success rounded-pill px-4 mt-2"
            >
              Submit
            </Button>
          </div>
        )}
      </Form>
    </Col>
  );
};

const AddressInfo = ({
  handleEditState,
  editState,
  handleCancel,
  userRole,
  userData,
}) => {
  const dispatch = useDispatch();
  const { states, countries } = useSelector((state) => state.formFields);
  const { loading } = useSelector((state) => state.user);
  const role = JSON.parse(localStorage.getItem("user"))?.role;

  useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);

  const form = useForm({
    initialValues: {
      country_id: "",
      state_id: "",
      zip_code: userData?.zip_code || "",
      city: userData?.city || "",
      address: userData?.address || "",
    },
    validateInputOnBlur: true,
    validateInputOnChange: [
      "country_id",
      "state_id",
      "zip_code",
      "city",
      "address",
    ],
    validate: yupResolver(AddressInfoSchema),
  });

  useEffect(() => {
    if (userData) {
      form.setFieldValue(
        "country_id",
        countries?.find((item) => item?.id === userData?.country?.id)?.id
      );
    } else {
      form.setFieldValue("country_id", "");
    }
  }, [userData, countries]);

  useEffect(() => {
    if (form?.values?.country_id) {
      dispatch(fetchStates(form?.values?.country_id));
    }
  }, [dispatch, form.values.country_id]);

  useEffect(() => {
    if (role !== "SuperAdmin") {
      if (states.length > 0) {
        const state_id = states?.find(
          (item) => item?.id === userData?.state?.id
        )?.id;

        form.setFieldValue("state_id", state_id);
      } else {
        form.setFieldValue("state_id", "");
      }
    }
  }, [role, userData?.state, states]);

  const handleDependentDropdown = (value) => {
    form.setFieldValue("country_id", value);
    form.setFieldValue("state_id", "");

    dispatch(fetchStates(value));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    form.validate();
    if (Object.keys(form.errors).length === 0) {
      const res = await dispatch(updateAddressInfo(userRole, form.values));
      if (res === "success") {
        handleEditState(0);
      }
    } else {
      errorMessage("Please Correct fields first");
    }
  };

  return (
    <Col
      xs={12}
      className="address-info d-flex flex-column align-items-start white-rounded-container position-relative"
    >
      <h3>Address</h3>
      <div className="position-absolute me-md-4 me-2 mt-md-3 mt-4 end-0 w-auto">
        <EditButton onClick={() => handleEditState(3)} />
      </div>
      <Form
        onSubmit={handleFormSubmit}
        autoComplete="off"
        className="row account-setting-form mt-5"
      >
        {userRole === "Client" && (
          <Col sm={6} xs={12} className="d-flex flex-column">
            {editState !== 3 && (
              <span className="span-label">
                {userRole === "Lawyer" ? "Office Address" : "Address"}
              </span>
            )}
            {editState === 3 ? (
              <TextInput
                label="Address"
                id="address"
                name="address"
                placeholder={
                  userRole === "Lawyer" ? "Office Address" : "Address"
                }
                {...form.getInputProps("address")}
              />
            ) : (
              <span>{userData?.address || "N/A"}</span>
            )}
          </Col>
        )}
        {userRole === "Client" && (
          <Col sm={6} xs={12} className="d-flex flex-column">
            {editState !== 3 && <span className="span-label">Country</span>}
            {editState === 3 ? (
              <Select
                searchable
                label="Country"
                id="country_id"
                name="country_id"
                placeholder="Select Country"
                data={
                  countries.length > 0
                    ? countries.map((country) => {
                        return {
                          label: country?.name,
                          value: country?.id,
                        };
                      })
                    : []
                }
                clearable
                {...form.getInputProps("country_id")}
                onChange={(value) => handleDependentDropdown(value)}
              />
            ) : (
              <span>{userData?.country?.name || "N/A"}</span>
            )}
          </Col>
        )}
        {userRole === "Client" && (
          <Col sm={6} xs={12} className="d-flex flex-column">
            {editState !== 3 && <span className="span-label">City</span>}
            {editState === 3 ? (
              <TextInput
                label="City"
                id="city"
                name="city"
                placeholder="City"
                {...form.getInputProps("city")}
              />
            ) : (
              <span>{userData?.city || "N/A"}</span>
            )}
          </Col>
        )}
        {userRole === "Client" && (
          <Col sm={6} xs={12} className="d-flex flex-column">
            {editState !== 3 && <span className="span-label">state</span>}
            {editState === 3 ? (
              <Select
                searchable
                label="State"
                id="state_id"
                name="state_id"
                placeholder="Select State"
                nothingFound="States Not Found"
                data={
                  states.length > 0
                    ? states?.map((item) => ({
                        value: item?.id,
                        label: item?.name,
                      }))
                    : []
                }
                clearable
                {...form.getInputProps("state_id")}
              />
            ) : (
              <span>{userData?.state?.name || "N/A"}</span>
            )}
          </Col>
        )}
        {userRole === "Client" && (
          <Col sm={6} xs={12} className="d-flex flex-column">
            {editState !== 3 && <span className="span-label">Zip Code</span>}
            {editState === 3 ? (
              <TextInput
                label="Zip Code"
                id="zip_code"
                name="zip_code"
                placeholder="Zip Code"
                {...form.getInputProps("zip_code")}
              />
            ) : (
              <span>{userData?.zip_code || "N/A"}</span>
            )}
          </Col>
        )}
        {editState === 3 && (
          <div className="d-flex justify-content-end gap-3">
            <button
              type="button"
              className="btn btn-outline-danger rounded-pill px-4 mt-2"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <Button
              loading={loading}
              loaderProps={{ color: "#198754" }}
              type="submit"
              className="btn btn-outline-success rounded-pill px-4 mt-2"
            >
              Submit
            </Button>
          </div>
        )}
      </Form>
    </Col>
  );
};

export default ProfileTabContent;
