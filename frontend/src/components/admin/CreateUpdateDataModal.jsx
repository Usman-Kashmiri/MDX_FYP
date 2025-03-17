import { Button, Flex, Modal, Select, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCountriesOfJurisdictions } from "../../redux/actions/webActions";
import { useState } from "react";

const CreateUpdateDataModal = ({
  opened,
  close,
  data,
  modalType,
  addDispatch,
  updateDispatch,
  tab,
}) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.admin);
  const { countries } = useSelector((state) => state?.web);
  const [activeCountries, setActiveCountries] = useState([]);

  useEffect(() => {
    dispatch(getCountriesOfJurisdictions());
  }, []);

  useEffect(() => {
    if (countries?.length > 0) {
      setActiveCountries(
        countries?.map((data) => {
          return {
            label: data?.name,
            value: data?.id,
          };
        })
      );
    }
  }, [countries]);

  const initialValues = {
    name: "",
    status: "",
  };

  const initialValuesForJurisdictions = {
    name: "",
    status: "",
    country_id: "",
  };

  const validate = {
    name: (value) => (value.length < 2 ? "Name is too short" : null),
    status: (value) => (value === "" ? "Status is required" : null),
  };

  const validateForJurisdictions = {
    name: (value) => (value.length < 2 ? "Name is too short" : null),
    country_id: (value) => (!value ? "Country is required!" : null),
    status: (value) => (value === "" ? "Status is required" : null),
  };

  const form = useForm({
    initialValues:
      tab === "jurisdictions" ? initialValuesForJurisdictions : initialValues,
    validate: tab === "jurisdictions" ? validateForJurisdictions : validate,
    validateInputOnBlur: true,
  });

  useEffect(() => {
    if (data) {
      form.setFieldValue("name", data.name);
      form.setFieldValue("status", data.status);
      if (tab === "jurisdictions") {
        form.setFieldValue("country_id", data?.country?.id);
      }
    } else {
      form.setFieldValue("name", "");
      form.setFieldValue("status", "");
      if (tab === "jurisdictions") {
        form.setFieldValue("country_id", "");
      }
    }
  }, [data]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    form.validate();
    if (!form.validate().hasErrors) {
      if (Object.keys(form.errors).length === 0) {
        if (modalType === "create") {
          const res = await dispatch(addDispatch(form.values));
          if (res === "success") {
            handleClose();
          }
        } else if (modalType === "edit") {
          const res = await dispatch(updateDispatch(data.id, form.values));
          if (res === "success") {
            handleClose();
          }
        }
      }
    }
  };

  const handleClose = () => {
    form.reset();
    close();
  };

  return (
    <Modal
      opened={opened}
      onClose={modalType === "create" ? handleClose : close}
      title={modalType === "create" ? "Add Data" : "Update Data"}
      centered
    >
      <form onSubmit={handleFormSubmit} id="add-data-form" autoComplete="off">
        <div className="mb-3">
          <TextInput
            label="Name"
            type="text"
            id="name"
            name="name"
            placeholder="Enter Name"
            withAsterisk
            {...form.getInputProps("name")}
          />
        </div>
        {tab === "jurisdictions" && (
          <div className="mb-3">
            <Select
              label="Country"
              type="text"
              id="country_id"
              name="country_id"
              data={activeCountries}
              placeholder="Enter Counry"
              withAsterisk
              maxDropdownHeight={120}
              {...form.getInputProps("country_id")}
            />
          </div>
        )}

        <div className="mb-3">
          <Select
            label="Status"
            id="status"
            name="status"
            placeholder="Select Status"
            withAsterisk
            data={[
              {
                key: 1,
                value: 1,
                label: "Active",
              },
              {
                key: 2,
                value: 0,
                label: "Inactive",
              },
            ]}
            {...form.getInputProps("status")}
          />
        </div>
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
            loading={loading}
            sx={{
              backgroundColor: "#db9651",
              "&:hover": { backgroundColor: "#d28b13" },
            }}
            variant="filled"
          >
            {modalType === "create" ? "Add" : "Update"}
          </Button>
        </Flex>
      </form>
    </Modal>
  );
};

export default CreateUpdateDataModal;
