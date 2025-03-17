import React from "react";
import { Container } from "react-bootstrap";
import {
  allCountriesForAdmin,
  updateCountryStatusForAdmin,
} from "../../redux/actions/adminActions";
import { useDispatch, useSelector } from "react-redux";
import Fade from "react-reveal/Fade";
import { DataTable } from "mantine-datatable";
import { useState } from "react";
import { useEffect } from "react";
import { Checkbox, Text } from "@mantine/core";

const Countries = () => {
  const PAGE_SIZE = 10;
  const dispatch = useDispatch();
  const { allCountries } = useSelector((state) => state?.admin);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setLoading] = useState(false);
  const [records, setRecords] = useState(data?.slice(0, PAGE_SIZE));

  const handleChangeOfCheckBox = async (event, record) => {
    setLoading(true);
    try {
      await dispatch(
        updateCountryStatusForAdmin(record.id, {
          status: !record.status,
        })
      );

      await dispatch(allCountriesForAdmin());
      setLoading(false);
    } catch (error) {
      console.error("Error handling checkbox change:", error);
      setLoading(false);
    }
  };

  const countries_columns = [
    {
      accessor: "id",
      title: <Text>Selection</Text>,
      width: "auto",
      render: (record, i) => (
        <Checkbox
          checked={record?.status === 1}
          sx={{
            input: {
              cursor: "pointer",
            },
          }}
          onChange={(event) => {
            handleChangeOfCheckBox(event, record);
          }}
        />
      ),
    },
    {
      accessor: "id",
      title: <Text>#</Text>,
      width: "auto",
      render: (_, i) => <Text>{(page - 1) * PAGE_SIZE + i + 1}</Text>,
    },
    {
      accessor: "name",
      width: "auto",
      render: (record) => <Text>{record?.name}</Text>,
    },
    {
      accessor: "iso3",
      title: <Text>Code</Text>,
      width: "auto",
      render: (record) => <Text>{record?.iso3}</Text>,
    },
    {
      accessor: "status",
      width: "auto",
      render: (record) => (
        <Text>{record?.status === 1 ? "Active" : "Inactive"}</Text>
      ),
    },
  ];

  const fetchCountries = async () => {
    setLoading(true);
    try {
      await dispatch(allCountriesForAdmin());
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    setData(allCountries);
  }, [allCountries]);

  useEffect(() => {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE;
    setRecords(data?.slice(from, to));
  }, [page, data]);

  return (
    <Fade>
      <Container fluid className="pb-md-5 pb-0 mb-md-5 px-md-4 px-3">
        <h3 className="mb-4">Countries</h3>
        <DataTable
          className="data-table-with-actions"
          withBorder
          records={records}
          withColumnBorders
          striped
          highlightOnHover
          verticalSpacing={10}
          columns={countries_columns}
          totalRecords={data?.length}
          recordsPerPage={PAGE_SIZE}
          page={page}
          onPageChange={(p) => setPage(p)}
          fetching={isLoading}
          minHeight={400}
          loaderVariant="dots"
          noRecordsText="No records found"
          paginationText={({ from, to, totalRecords }) =>
            `Records ${from} - ${to} of ${totalRecords}`
          }
          paginationSize="md"
        />
      </Container>
    </Fade>
  );
};

export default Countries;
