import { Text } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { fetchNewsLetter } from "../../redux/actions/adminActions";
import { useDispatch, useSelector } from "react-redux";
import { DataTable } from "mantine-datatable";
import dayjs from "dayjs";

const NewsLetter = () => {
  const PAGE_SIZE = 10;
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const { newsletters, loading } = useSelector((state) => state?.admin);
  const [dataForTable, setDataForTable] = useState([]);
  const [records, setRecords] = useState(dataForTable?.slice(0, PAGE_SIZE));

  useEffect(() => {
    setDataForTable(newsletters);
    setTotalRecords(newsletters?.length);
  }, [newsletters]);

  useEffect(() => {
    const from = page - 1;
    const to = from + PAGE_SIZE;
    setRecords(dataForTable?.slice(from, to));
  }, [page, dataForTable]);

  useEffect(() => {
    dispatch(fetchNewsLetter());
  }, [dispatch]);

  const newsletterColumn = [
    {
      accessor: "SNO",
      title: <Text>#</Text>,
      width: "auto",
      render: (record, i) => <Text>{i + 1}</Text>,
    },
    {
      accessor: "email",
      title: <Text>Email</Text>,
      width: "auto",
    },
    {
      accessor: "created_at",
      title: <Text>Subscribe Time</Text>,
      width: "auto",
      render: (record) => (
        <>
          <Text>
            {dayjs(record?.created_at).format("HH:mm:ss  YYYY-MM-DD")}
          </Text>
        </>
      ),
    },
  ];

  return (
    <div className="pt-4 pb-3 px-2 px-sm-4">
      <div className="d-flex justify-content-between align-items-center w-100 mb-3">
        <h2 className="mb-0 text-of-transaction">NewsLetter</h2>
      </div>
      <DataTable
        className="data-table-with-actions mt-6"
        withBorder
        records={records || []}
        withColumnBorders
        striped
        highlightOnHover
        verticalSpacing={10}
        columns={newsletterColumn}
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

export default NewsLetter;
