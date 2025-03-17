import { Select, Text } from "@mantine/core";
import { DataTable } from "mantine-datatable";
import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { transactionList } from "../redux/actions/lawyerAction";
import { IconSearch } from "@tabler/icons-react";
import { DatePickerInput } from "@mantine/dates";
import dayjs from "dayjs";

const Transactions = () => {
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedType, setSelectedType] = useState("");
  const { transactionsList, loading } = useSelector((state) => state?.lawyer);
  const [dataForTable, setDataForTable] = useState([]);
  const [records, setRecords] = useState(dataForTable?.slice(0, PAGE_SIZE));

  const dispatch = useDispatch();

  useEffect(() => {
    setDataForTable(
      transactionsList?.filter(({ type }) => {
        if (selectedType?.length) {
          if (selectedType === type) {
            return type;
          }
        } else {
          return type;
        }

        return undefined;
      })
    );
  }, [transactionsList, selectedType]);

  useEffect(() => {
    setDataForTable(transactionsList);
    setTotalRecords(transactionsList?.length);
  }, [transactionsList]);

  useEffect(() => {
    const from = page - 1;
    const to = from + PAGE_SIZE;
    setRecords(dataForTable?.slice(from, to));
  }, [page, dataForTable]);

  const transactionsColumn = [
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
      accessor: "reason",
      width: "auto",
      title: <Text>Case Reason</Text>,
      render: (record) => (
        <Text
          style={{
            textTransform: "capitalize",
          }}
        >
          {record?.reason}
        </Text>
      ),
    },
    {
      accessor: "type",
      title: <Text>Transaction Type</Text>,
      width: "auto",
      render: (record) => (
        <Text
          style={{
            textTransform: "capitalize",
            color: record?.type === "debited" ? "green" : "red",
          }}
        >
          {record?.type}
        </Text>
      ),
      filter: (
        <Select
          label="Departments "
          description="Show all debited Transactions"
          data={[
            { label: "Credited", value: "credited" },
            { label: "Debited", value: "debited" },
          ]}
          value={selectedType}
          placeholder="Search type"
          onChange={setSelectedType}
          icon={<IconSearch size={16} />}
          clearable
          searchable
        />
      ),
      filtering: selectedType?.length > 0,
    },
  ];
  const handleCalender = async (e) => {
    if (e[0] && e[1]) {
      const res = await dispatch(
        transactionList({
          startDate: dayjs(e[0]).format("YYYY-MM-DD"),
          endDate: dayjs(e[1]).format("YYYY-MM-DD"),
        })
      );
      if (res.res === "error") {
        setDataForTable([]);
      }
    } else if (!e[0] && !e[1]) {
      await dispatch(transactionList());
    } else {
      return false;
    }
  };

  return (
    <div className="pt-4 pb-3 px-2 px-sm-4">
      <div className="d-flex justify-content-between align-items-center w-100 mb-3">
        <h2 className="mb-0 text-of-transaction">Transactions </h2>
        <DatePickerInput
          type="range"
          label="Pick dates range"
          placeholder="Pick dates range"
          onChange={(e) => {
            handleCalender(e);
          }}
          className="date-picker-of-transaction"
          clearable
        />
      </div>

      <DataTable
        className="data-table-with-actions"
        withBorder
        records={records || []}
        withColumnBorders
        striped
        highlightOnHover
        verticalSpacing={10}
        columns={transactionsColumn}
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

export default Transactions;
