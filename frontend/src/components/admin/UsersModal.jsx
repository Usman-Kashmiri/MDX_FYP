import {
  Button,
  Divider,
  Flex,
  Modal,
  MultiSelect,
  PasswordInput,
  ScrollArea,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AddClientSchema,
  AddLawyerSchema,
  AddUserSchema,
  EditUserSchema,
  UpdateClientSchema,
  UpdateLawyerSchema,
} from "../../validations/ValidationSchema";
import {
  fetchCountries,
  fetchPractice,
  fetchStates,
} from "../../redux/actions/formActions";
import { DatePickerInput } from "@mantine/dates";
import dayjs from "dayjs";
import { getJurisdictionByCountry } from "../../redux/actions/webActions";

const UsersModal = ({
  opened,
  close,
  data,
  modalType,
  addDispatch,
  updateDispatch,
  tab,
}) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { loading } = state?.admin;
  const { practice, countries, states } = state?.formFields;
  const { jurisdictions } = state?.web;
  const role = JSON.parse(localStorage.getItem("user"))?.role;

  const [countries_list, setCountries_list] = useState([]);
  const [practice_list, setpractice_list] = useState([]);
  const [jurisdictions_list, setjurisdictions_list] = useState([]);
  const [isLawyer, setIsLawyer] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [validations, setValidations] = useState(AddUserSchema);
  const [initialValues, setInitialValues] = useState({});
  const [validateInputOnChange, setValidateInputOnChange] = useState([]);

  useEffect(() => {
    setIsLawyer(tab === "lawyers");
    setIsClient(tab === "clients");

    setInitialValues(
      tab === "lawyers"
        ? {
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            password_confirmation: "",
            status: "",
            phone_number: "",
            dob: null,
            area_expertise_id: "",
            jurisdiction_id: [],
            // short_bio: "",
            bar_membership_number: "",
            address: "",
            country_id: "",
            city: "",
            zip_code: "",
            state_id: "",
          }
        : tab === "clients"
        ? {
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            password_confirmation: "",
            status: "",
            phone_number: "",
            address: "",
            country_id: "",
            city: "",
            zip_code: "",
            state_id: "",
          }
        : {
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            password_confirmation: "",
            status: "",
          }
    );

    setValidateInputOnChange(
      tab === "lawyers"
        ? [
            "first_name",
            "last_name",
            "email",
            "password",
            "password_confirmation",
            "status",
            "phone_number",
            "area_expertise_id",
            "jurisdiction_id",
            // "short_bio",
            "dob",
            "bar_membership_number",
            "address",
            "country_id",
            "city",
            "state_id",
            "zip_code",
          ]
        : tab === "clients"
        ? [
            "first_name",
            "last_name",
            "email",
            "password",
            "password_confirmation",
            "status",
            "phone_number",
            "address",
            "country_id",
            "city",
            "state_id",
            "zip_code",
          ]
        : [
            "first_name",
            "last_name",
            "email",
            "password",
            "password_confirmation",
            "status",
          ]
    );

    if (modalType === "create") {
      if (tab === "moderators") {
        setValidations(AddUserSchema);
      } else if (tab === "lawyers") {
        setValidations(AddLawyerSchema);
      } else if (tab === "clients") {
        setValidations(AddClientSchema);
      }
    } else if (modalType === "edit") {
      if (tab === "moderators") {
        setValidations(EditUserSchema);
      } else if (tab === "lawyers") {
        setValidations(UpdateLawyerSchema);
      } else if (tab === "clients") {
        setValidations(UpdateClientSchema);
      }
    }
  }, [tab, modalType]);

  useEffect(() => {
    if (tab === "clients" || tab === "lawyers") {
      dispatch(fetchPractice());
      dispatch(fetchCountries());
    }
  }, [tab]);

  useEffect(() => {
    setpractice_list(
      practice?.map((item) => {
        return {
          value: item?.id,
          label: item?.name,
        };
      })
    );
  }, [practice]);

  useEffect(() => {
    setjurisdictions_list(
      jurisdictions?.map((jury) => {
        return {
          value: jury.id,
          label: jury.name,
        };
      })
    );
  }, [jurisdictions]);

  useEffect(() => {
    if (countries?.length > 0) {
      setCountries_list(
        countries?.map((item) => {
          return {
            value: item?.id,
            label: item?.name,
          };
        })
      );
    }
  }, [countries]);

  const form = useForm({
    initialValues: initialValues,
    validateInputOnBlur: true,
    validateInputOnChange: validateInputOnChange,
    validate: yupResolver(validations),
  });

  useEffect(() => {
    if (data) {
      form.setFieldValue("first_name", data?.first_name);
      form.setFieldValue("last_name", data?.last_name);
      form.setFieldValue("email", data?.email);
      form.setFieldValue("password", "");
      form.setFieldValue("password_confirmation", "");
      form.setFieldValue("status", data?.status);
      (isLawyer || isClient || role === "SuperAdmin") &&
        form.setFieldValue("phone_number", data?.phone_number);
      data?.dob && (isLawyer || role === "SuperAdmin")
        ? form.setFieldValue("dob", dayjs(data?.dob))
        : form.setFieldValue("dob", null);
      (isLawyer || isClient || role === "SuperAdmin") &&
        form.setFieldValue("zip_code", data?.zip_code);
      (isLawyer || isClient || role === "SuperAdmin") &&
        form.setFieldValue("state_id", data?.state?.id);
      (isLawyer || isClient || role === "SuperAdmin") &&
        form.setFieldValue("city", data?.city);
      (isLawyer || isClient || role === "SuperAdmin") &&
        form.setFieldValue("country_id", data?.country?.id);
      tab !== "moderators" && dispatch(fetchStates(data?.country?.id));
      dispatch(getJurisdictionByCountry(data?.country?.id));
      (isLawyer || isClient || role === "SuperAdmin") &&
        form.setFieldValue("address", data?.address);
      (isLawyer || role === "SuperAdmin") &&
        form.setFieldValue(
          "bar_membership_number",
          data?.bar_membership_number
        );
      (isLawyer || role === "SuperAdmin") &&
        form?.setFieldValue(
          "jurisdiction_id",
          data?.jurisdictions?.length > 0
            ? data?.jurisdictions?.map((item) => item?.id)
            : []
        );
      const area_of_practice_id = data?.area_expertise?.map((practice) => {
        return practice.id;
      });
      (isLawyer || role === "SuperAdmin") &&
        form.setFieldValue("area_expertise_id", area_of_practice_id);
    } else {
      form.reset();
    }
  }, [data]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    form.validate();
   
    if (!form?.validate()?.hasErrors) {

      if (modalType === "create") {
        const formattedDate = dayjs(form.values.dob).format("YYYY-MM-DD");
        const data = {
          ...form.values,
          dob: formattedDate,
        };
        const res = await dispatch(addDispatch(data));
        if (res === "success") {
          handleClose();
        }
      } else if (modalType === "edit") {
       
        const formattedDate = dayjs(form.values.dob).format("YYYY-MM-DD");
        const dataForUpdate = {
          ...form.values,
          dob: formattedDate,
        };
        const res = await dispatch(updateDispatch(data.id, dataForUpdate));
        if (res === "success") {
          close();
        }
      }
    }
  };

  useEffect(() => {
    if (form?.values?.country_id !== data?.country?.id) {
      form?.setFieldValue("state_id", "");
    }
  }, [form?.values?.country_id]);

  const handleClose = () => {
    form.reset();
    close();
  };

  return (
    <Modal
      opened={opened}
      onClose={modalType === "create" ? handleClose : close}
      title={
        <Text span transform="capitalize">{`${
          modalType === "create" ? "Add" : "Update"
        } ${tab?.replace("s", "")}`}</Text>
      }
      centered
      scrollAreaComponent={ScrollArea.Autosize}
      size={(isLawyer || isClient) && "xl"}
      className=".data-table-with-actions"
    >
      <form
        onSubmit={handleFormSubmit}
        id="moderator-form"
        autoComplete="off"
        className={`${isLawyer || isClient ? "row" : ""}`}
      >
        <div
          className={`mb-3 ${isLawyer || isClient ? "col-md-6 col-12" : ""}`}
        >
          <TextInput
            label="First Name"
            type="text"
            id="first_name"
            name="first_name"
            placeholder="Enter First Name"
            withAsterisk
            {...form.getInputProps("first_name")}
          />
        </div>

        <div
          className={`mb-3 ${isLawyer || isClient ? "col-md-6 col-12" : ""}`}
        >
          <TextInput
            label="Last Name"
            type="text"
            id="last_name"
            name="last_name"
            placeholder="Enter Last Name"
            withAsterisk
            {...form.getInputProps("last_name")}
          />
        </div>

        {(isLawyer || isClient) && (
          <div
            className={`mb-3 ${isLawyer || isClient ? "col-md-6 col-12" : ""}`}
          >
            <TextInput
              label="Phone Number"
              type="number"
              id="phone_number"
              name="phone_number"
              placeholder="Enter Phone Number"
              withAsterisk
              {...form.getInputProps("phone_number")}
            />
          </div>
        )}
        {isLawyer && (
          <div
            className={`mb-3 ${isLawyer || isClient ? "col-md-6 col-12" : ""}`}
          >
            <DatePickerInput
              label="Date of Birth"
              name="dob"
              icon={
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="#da954c"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M13.5524 1.67374H11.9874V0.891243C11.9874 0.683713 11.905 0.484682 11.7582 0.337936C11.6115 0.19119 11.4124 0.108749 11.2049 0.108749C10.9974 0.108749 10.7983 0.19119 10.6516 0.337936C10.5049 0.484682 10.4224 0.683713 10.4224 0.891243V1.67374H5.72745V0.891243C5.72745 0.683713 5.64501 0.484682 5.49827 0.337936C5.35152 0.19119 5.15249 0.108749 4.94496 0.108749C4.73743 0.108749 4.5384 0.19119 4.39165 0.337936C4.24491 0.484682 4.16247 0.683713 4.16247 0.891243V1.67374H2.59748C1.97489 1.67374 1.3778 1.92106 0.937561 2.3613C0.497323 2.80154 0.25 3.39863 0.25 4.02122V13.4111C0.25 14.0337 0.497323 14.6308 0.937561 15.0711C1.3778 15.5113 1.97489 15.7586 2.59748 15.7586H13.5524C14.175 15.7586 14.7721 15.5113 15.2123 15.0711C15.6525 14.6308 15.8999 14.0337 15.8999 13.4111V4.02122C15.8999 3.39863 15.6525 2.80154 15.2123 2.3613C14.7721 1.92106 14.175 1.67374 13.5524 1.67374ZM14.3349 13.4111C14.3349 13.6187 14.2524 13.8177 14.1057 13.9644C13.9589 14.1112 13.7599 14.1936 13.5524 14.1936H2.59748C2.38995 14.1936 2.19092 14.1112 2.04417 13.9644C1.89743 13.8177 1.81499 13.6187 1.81499 13.4111V7.93368H14.3349V13.4111ZM14.3349 6.3687H1.81499V4.02122C1.81499 3.81369 1.89743 3.61466 2.04417 3.46791C2.19092 3.32116 2.38995 3.23872 2.59748 3.23872H4.16247V4.02122C4.16247 4.22875 4.24491 4.42778 4.39165 4.57452C4.5384 4.72127 4.73743 4.80371 4.94496 4.80371C5.15249 4.80371 5.35152 4.72127 5.49827 4.57452C5.64501 4.42778 5.72745 4.22875 5.72745 4.02122V3.23872H10.4224V4.02122C10.4224 4.22875 10.5049 4.42778 10.6516 4.57452C10.7983 4.72127 10.9974 4.80371 11.2049 4.80371C11.4124 4.80371 11.6115 4.72127 11.7582 4.57452C11.905 4.42778 11.9874 4.22875 11.9874 4.02122V3.23872H13.5524C13.7599 3.23872 13.9589 3.32116 14.1057 3.46791C14.2524 3.61466 14.3349 3.81369 14.3349 4.02122V6.3687Z" />
                </svg>
              }
              className="mx-0"
              placeholder="Please select date of birth"
              valueFormat="YYYY-MM-DD"
              value={dayjs(form?.values?.dob)}
              onChange={() => {
                form.setFieldValue(
                  "dob",
                  dayjs(form?.values?.dob)?.format("YYYY-MM-DD")
                );
              }}
              mx="auto"
              maw={400}
              withAsterisk
              {...form.getInputProps("dob")}
            />
          </div>
        )}
        {isLawyer && (
          <div className={`mb-3 ${isLawyer ? "col-md-6 col-12" : ""}`}>
            <MultiSelect
              searchable
              label={`Area(s) of practice`}
              id="area_expertise_id"
              name="area_expertise_id"
              data={practice_list}
              withAsterisk
              placeholder="Please specify your areas of practice."
              {...form.getInputProps("area_expertise_id")}
            />
          </div>
        )}
        {isLawyer && (
          <div
            className={`mb-3 ${isLawyer || isClient ? "col-md-6 col-12" : ""}`}
          >
            <Select
              searchable
              label="Country"
              id="country_id"
              name="country_id"
              placeholder="Select Country"
              withAsterisk
              data={countries_list}
              {...form.getInputProps("country_id")}
              onChange={(value) => {
                form.setFieldValue("country_id", value);
                value !== "" && dispatch(fetchStates(value));
                value !== "" && dispatch(getJurisdictionByCountry(value));
              }}
            />
          </div>
        )}

        {isLawyer && (
          <div
            className={`mb-3 ${isLawyer || isClient ? "col-md-6 col-12" : ""}`}
          >
            <Select
              searchable
              label="State"
              id="state_id"
              name="state_id"
              placeholder="Select State"
              nothingFound="States Not Found"
              withAsterisk
              data={states?.map((item) => {
                return {
                  value: item.id,
                  label: item.name,
                };
              })}
              {...form.getInputProps("state_id")}
            />
          </div>
        )}
        {isLawyer && (
          <div className={`mb-3 ${isLawyer ? "col-md-6 col-12" : ""}`}>
            <MultiSelect
              searchable
              label="Jurisdictions"
              id="jurisdiction_id"
              nothingFound="Jurisdiction Not Found In This Country"
              name="jurisdiction_id"
              data={jurisdictions_list}
              placeholder="Select jurisdictions"
              {...form.getInputProps("jurisdiction_id")}
            />
          </div>
        )}
        {isLawyer && (
          <div
            className={`mb-3 ${isLawyer || isClient ? "col-md-6 col-12" : ""}`}
          >
            <TextInput
              label="City"
              id="city"
              name="city"
              placeholder="City"
              withAsterisk
              {...form.getInputProps("city")}
            />
          </div>
        )}
        {isLawyer && (
          <div
            className={`mb-3 ${isLawyer || isClient ? "col-md-6 col-12" : ""}`}
          >
            <TextInput
              type="text"
              label="Zip Code"
              id="zip_code"
              name="zip_code"
              placeholder="Zip Code"
              withAsterisk
              {...form.getInputProps("zip_code")}
            />
          </div>
        )}
        {isLawyer && (
          <div className={`mb-3 ${isLawyer || isClient ? "col-12" : ""}`}>
            <TextInput
              label="Address"
              id="address"
              name="address"
              withAsterisks
              withAsterisk
              placeholder={isLawyer ? "Office Address" : "Address"}
              {...form.getInputProps("address")}
            />
          </div>
        )}
        {isLawyer && (
          <div className={`mb-3 ${isLawyer ? "col-md-6 col-12" : ""}`}>
            <TextInput
              label="Bar Association Membership Number"
              id="bar_association_membership_number"
              name="bar_association_membership_number"
              placeholder="Bar Association Membership Number"
              withAsterisk
              {...form.getInputProps("bar_membership_number")}
            />
          </div>
        )}

        <div
          className={`mb-3 ${isLawyer || isClient ? "col-md-6 col-12" : ""}`}
        >
          <TextInput
            disabled={modalType === "edit"}
            label="Email"
            type="text"
            id="email"
            name="email"
            placeholder="Enter email"
            withAsterisk
            {...form.getInputProps("email")}
          />
        </div>
        <div
          className={`mb-3 ${isLawyer || isClient ? "col-md-6 col-12" : ""}`}
        >
          <Select
            label="Status"
            id="status"
            name="status"
            placeholder="Select Status"
            withAsterisk
            data={[
              {
                key: 1,
                value: "1",
                label:
                  form.values.status === 0 && modalType === "edit"
                    ? "Unblock"
                    : "Active",
              },
              {
                key: 2,
                value: "0",
                label: "Block",
              },
            ]}
            {...form.getInputProps("status")}
          />
        </div>

        {modalType === "create" && (
          <>
            <div
              className={`mb-3 ${
                isLawyer || isClient ? "col-md-6 col-12" : ""
              }`}
            >
              <PasswordInput
                label="Password"
                id="password"
                name="password"
                placeholder="Enter password"
                withAsterisk
                {...form.getInputProps("password")}
              />
            </div>

            <div
              className={`mb-3 ${
                isLawyer || isClient ? "col-md-6 col-12" : ""
              }`}
            >
              <PasswordInput
                label="Confirm Password"
                id="password_confirmation"
                name="password_confirmation"
                placeholder="Confirm password"
                withAsterisk
                {...form.getInputProps("password_confirmation")}
              />
            </div>
          </>
        )}
        {isClient && (
          <Divider
            my="xs"
            label={
              <Text style={{ fontSize: "20px", fontWeight: "bold" }}>
                Address
              </Text>
            }
            labelPosition="left"
          />
        )}

        {isClient && (
          <div
            className={`mb-3 ${isLawyer || isClient ? "col-md-6 col-12" : ""}`}
          >
            <Select
              searchable
              label="Country"
              id="country_id"
              name="country_id"
              placeholder="Select Country"
              withAsterisk
              data={countries_list}
              {...form.getInputProps("country_id")}
              onChange={(value) => {
                form.setFieldValue("country_id", value);
                dispatch(fetchStates(value));
              }}
            />
          </div>
        )}
        {isClient && (
          <div
            className={`mb-3 ${isLawyer || isClient ? "col-md-6 col-12" : ""}`}
          >
            <Select
              searchable
              label="State"
              id="state_id"
              name="state_id"
              placeholder="Select State"
              nothingFound="States Not Found"
              withAsterisk
              data={states?.map((item) => {
                return {
                  value: item.id,
                  label: item.name,
                };
              })}
              {...form.getInputProps("state_id")}
            />
          </div>
        )}
        {isClient && (
          <div
            className={`mb-3 ${isLawyer || isClient ? "col-md-6 col-12" : ""}`}
          >
            <TextInput
              label="City"
              id="city"
              name="city"
              placeholder="City"
              withAsterisk
              {...form.getInputProps("city")}
            />
          </div>
        )}
        {isClient && (
          <div
            className={`mb-3 ${isLawyer || isClient ? "col-md-6 col-12" : ""}`}
          >
            <TextInput
              type="number"
              label="Zip Code"
              id="zip_code"
              name="zip_code"
              placeholder="Zip Code"
              withAsterisk
              {...form.getInputProps("zip_code")}
            />
          </div>
        )}
        {isClient && (
          <div className={`mb-3 ${isLawyer || isClient ? "col-12" : ""}`}>
            <TextInput
              label="Address"
              id="address"
              name="address"
              withAsterisks
              withAsterisk
              placeholder={isLawyer ? "Office Address" : "Address"}
              {...form.getInputProps("address")}
            />
          </div>
        )}

        <Flex
          sx={{
            marginTop: "20px",
            width: "100%",
            justifyContent: "flex-end",
            gap: "16px",
          }}
        >
          <Button
            onClick={modalType === "create" ? handleClose : close}
            variant="outline"
            color="gray"
          >
            Cancel
          </Button>
          <Button
            type="Submit"
            sx={{
              backgroundColor: "#db9651",
              "&:hover": { backgroundColor: "#d28b13" },
            }}
            variant="filled"
            loading={loading}
          >
            {modalType === "create" ? "Add" : "Update"}
          </Button>
        </Flex>
      </form>
    </Modal>
  );
};

export default UsersModal;
