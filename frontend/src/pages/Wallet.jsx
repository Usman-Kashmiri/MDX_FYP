import { Modal, Text, TextInput } from "@mantine/core";
import { DataTable } from "mantine-datatable";
import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateIban,
  withDrawRequest,
  withDrawRequestList,
} from "../redux/actions/lawyerAction";
import { useDisclosure } from "@mantine/hooks";
import { useForm, yupResolver } from "@mantine/form";
import * as yup from "yup";
import { successMessage } from "../globalFunctions";

const Wallet = () => {
  const [maxAmountofLawyer, setMaxAmountOfLawyer] = useState(0);
  const [opened, { open, close }] = useDisclosure(false);
  const [edit, setEdit] = useState(0);
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const { withdrawRquestList, loading } = useSelector((state) => state?.lawyer);
  const [dataForTable, setDataForTable] = useState([]);
  const [records, setRecords] = useState(dataForTable?.slice(0, PAGE_SIZE));

  const dispatch = useDispatch();

  useEffect(() => {
    const from = page - 1;
    const to = from + PAGE_SIZE;
    setRecords(dataForTable?.slice(from, to));
  }, [page, dataForTable]);

  useEffect(() => {
    dispatch(withDrawRequestList());
  }, [dispatch]);

  const walletsColumn = [
    {
      accessor: "SNO",
      title: <Text>#</Text>,
      width: "auto",
      render: (record, i) => <Text>{i + 1}</Text>,
    },
    {
      accessor: "amount",
      title: <Text>Amount</Text>,
      width: "auto",
    },
    {
      accessor: "iban",
      width: "auto",
      title: <Text>IBAN</Text>,
    },
    {
      accessor: "status",
      title: <Text>Status</Text>,
      width: "auto",
      render: (record) => (
        <Text
          style={{
            textTransform: "capitalize",
            color:
              record?.status === "pending"
                ? "orange"
                : record?.status === "rejected"
                ? "red"
                : "green",
          }}
        >
          {record?.status}
        </Text>
      ),
    },
  ];

  useEffect(() => {
    setDataForTable(withdrawRquestList?.data);
    setTotalRecords(withdrawRquestList?.data?.length);
    setMaxAmountOfLawyer(withdrawRquestList?.current_balance);
    form2?.setFieldValue("iban", withdrawRquestList?.iban);
  }, [withdrawRquestList]);

  const form = useForm({
    initialValues: { amount: 0 },
    validateInputOnBlur: true,
    validateInputOnChange: ["amount"],
    validate: yupResolver(
      yup.object().shape({
        amount: yup
          .number()
          .typeError("Amount must be a number")
          .min(100, "Amount must be at least 100")
          .max(
            maxAmountofLawyer,
            `${
              maxAmountofLawyer < 100
                ? `Your current balance ${maxAmountofLawyer} is insuffient to withdraw`
                : `Amount cannot exceed your account balance: ${maxAmountofLawyer}`
            }`
          )
          .required("Amount is required"),
      })
    ),
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    form.validate();
    if (Object.keys(form.errors).length === 0) {
      const res = await dispatch(withDrawRequest(form.values));
      if (res?.status === "success") {
        close();
        dispatch(withDrawRequestList());
        successMessage("Withdraw Request Successfully");
      }
    }
  };

  const form2 = useForm({
    initialValues: { iban: withdrawRquestList?.iban || "" },
    validateInputOnBlur: true,
    validateInputOnChange: ["iban"],
    validate: yupResolver(
      yup.object().shape({
        iban: yup
          .string()
          .matches(
            /^[a-zA-Z0-9]*$/,
            "IBAN should only contain alphanumeric characters"
          )
          .required("IBAN is required"),
      })
    ),
  });

  const handleForm2Submit = async (e) => {
    e.preventDefault();
    form2.validate();
    if (Object.keys(form2.errors).length === 0) {
      const res = await dispatch(updateIban(form2.values));
      if (res?.res === "success") {
        setEdit(0);
        dispatch({
          type: "UPDATE_IBAN",
          payload: res?.iban,
        });
      }
    }
  };

  return (
    <div className="pt-4 pb-5 mb-5 px-2 px-sm-4">
      <Modal
        opened={opened}
        onClose={close}
        radius={"lg"}
        centered
        style={{
          minHeight: "fit-content",
        }}
        size={"md"}
        withCloseButton={false}
      >
        <div className="px-1 gap-4 flex-column d-flex ">
          <div className="d-flex justify-content-between align-items-center">
            <h3
              style={{
                textAlign: "center",
                width: "100%",
                marginBottom: "1rem",
              }}
            >
              Withdraw Amount
            </h3>
            {/* {!withdrawRquestList?.iban && (
              <button
                className="grey-btn-of-cancels  text-capitalize"
                type="button"
                onClick={() => {
                  setEdit(1);
                }}
              >
                Add
              </button>
            )} */}
          </div>

          {!withdrawRquestList?.iban && edit !== 1 && (
            <button
              className="grey-btn-of-cancels  text-capitalize"
              type="button"
              onClick={() => {
                setEdit(1);
              }}
            >
              Add
            </button>
          )}
          <div>
            <form onSubmit={handleForm2Submit}>
              <div
                className={`d-flex flex-row justify-content-between align-items-start gap-2`}
              >
                {edit === 1 ? (
                  <TextInput
                    id="iban"
                    name="iban"
                    placeholder="Account Number"
                    className="w-100 textfield-of-transactions"
                    {...form2.getInputProps("iban")}
                  />
                ) : (
                  <span className="mt-0 mb-0 amount-label-in-transaction">
                    {withdrawRquestList?.iban}
                  </span>
                )}
                {edit !== 1 ? (
                  withdrawRquestList?.iban && (
                    <div className="align-content-end">
                      <button
                        className="grey-btn-of-cancels text-capitalize"
                        type="button"
                        onClick={() => {
                          setEdit(1);
                        }}
                      >
                        Edit
                        <svg
                          className="ms-2"
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.1189 12.9449H0.520963C0.256107 12.9449 0.0488281 13.1636 0.0488281 13.417C0.0488281 13.6703 0.267622 13.8891 0.520963 13.8891H13.1304C13.3953 13.8891 13.6025 13.6703 13.6025 13.417C13.6025 13.1636 13.3837 12.9449 13.1189 12.9449Z"
                            fill="#78808C"
                          />
                          <path
                            d="M0.0486248 8.76474L0.0371094 11.0103C0.0371094 11.1369 0.0831713 11.2636 0.175295 11.3557C0.267419 11.4478 0.382574 11.4939 0.509244 11.4939L2.74325 11.4824C2.86992 11.4824 2.98507 11.4363 3.07719 11.3442L10.7926 3.62884C10.9768 3.44459 10.9768 3.14519 10.7926 2.94943L8.58159 0.715426C8.39734 0.531178 8.09794 0.531178 7.90218 0.715426L6.3591 2.27001L0.186811 8.43079C0.106202 8.52292 0.0486248 8.63807 0.0486248 8.76474ZM8.24764 1.72879L9.80223 3.28338L8.92705 4.15855L7.37247 2.60396L8.24764 1.72879ZM1.00441 8.97202L6.69305 3.28338L8.24764 4.83796L2.559 10.5151L0.992893 10.5266L1.00441 8.97202Z"
                            fill="#78808C"
                          />
                        </svg>
                      </button>
                    </div>
                  )
                ) : (
                  <div className="edit-width-of-transactions d-flex flex-row justify-content-end align-items-start mx-0 gap-1 mb-0 pt-1">
                    <button
                      className="grey-btn-of-cancels small text-capitalize"
                      type="button"
                      onClick={() => {
                        setEdit(0);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="orange-btn-of-submit small text-capitalize"
                      type="submit"
                    >
                      Submit
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>

          {withdrawRquestList?.iban && (
            <form onSubmit={handleFormSubmit} className="mt-5">
              <div className="d-flex flex-column gap-0 mt-2">
                <span className="label-of-amount-in-transaction">
                  Amount{" "}
                  <span
                    style={{
                      color: "#756767",
                    }}
                  >
                    ({maxAmountofLawyer})
                  </span>
                </span>
                <TextInput
                  id="amount"
                  name="amount"
                  placeholder={`100 - ${maxAmountofLawyer}`}
                  type="number"
                  // min={100}
                  max={maxAmountofLawyer}
                  className="textfield-of-transactions"
                  {...form.getInputProps("amount")}
                />
              </div>
              <div className="d-flex justify-content-evenly w-75 mx-auto mt-4">
                <button
                  type="button"
                  className="grey-btn-of-cancels  text-capitalize"
                  onClick={() => {
                    close();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="orange-btn-of-submit  text-capitalize"
                  onClick={() => {
                    setEdit(0);
                  }}
                >
                  Submit
                </button>
              </div>
            </form>
          )}
        </div>
      </Modal>
      <h2 className="mb-0 text-of-transaction  mb-3">Wallet</h2>
      <div className="box-of-total-amount-of-transaction d-flex flex-row justify-content-between align-items-center mb-3">
        <div className=" d-flex flex-column justify-content-start mb-0">
          <span className="amount-text-of-transaction">
            {maxAmountofLawyer ? `$${maxAmountofLawyer}` : "  "}
          </span>
        </div>
        <button
          className="primary-btn  text-capitalize"
          onClick={() => {
            open();
          }}
        >
          Withdraw Amount
        </button>
      </div>
      <div className="d-flex justify-content-between align-items-center w-100 mb-3 mt-3">
        <h2 className="mb-0 text-of-transaction">Withdraw Requests</h2>
      </div>

      <DataTable
        className="data-table-with-actions mt-4"
        withBorder
        records={records || []}
        withColumnBorders
        striped
        highlightOnHover
        verticalSpacing={10}
        columns={walletsColumn}
        totalRecords={totalRecords}
        recordsPerPage={PAGE_SIZE}
        page={page}
        onPageChange={(p) => {
          setPage(p);
        }}
        fetching={loading}
        minHeight={400}
        loaderVariant="dots"
        noRecordsText="No records found"
        paginationText={({ from, to, totalRecords }) =>
          `Records ${from} - ${to} of ${totalRecords}`
        }
        paginationSize="md"
      />
    </div>
  );
};

export default Wallet;
