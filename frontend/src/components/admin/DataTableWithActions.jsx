import { DataTable } from "mantine-datatable";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreateUpdateDataModal from "./CreateUpdateDataModal";
import AddDataButton from "./AddDataButton";
import {
  ActionIcon,
  Box,
  Button,
  Popover,
  Text,
  TextInput,
} from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import { IconTrash } from "@tabler/icons-react";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { Link, useLocation, useNavigate } from "react-router-dom";
import UsersModal from "./UsersModal";
import { IconSearch } from "@tabler/icons-react";

const DataTableWithActions = ({
  data,
  fetchDispatch,
  addDispatch,
  updateDispatch,
  deleteDispatch,
  buttonText,
  tab = null,
  fromDash,
}) => {
  const [opened, { close, open }] = useDisclosure(false);

  const [pagination, setPagination] = useState({
    page: 1,
    total_pages: 1,
    per_page: 8,
    total_records: 0,
  });

  const { loading } = useSelector((state) => state?.admin);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [modalType, setModalType] = useState("create");

  const [initialValues, setInitialValues] = useState(null);
  const [country, setCountry] = useState("");

  const handleModal = (type, data) => {
    type === "edit" ? setInitialValues(data) : setInitialValues(null);
    setModalType(type);
    open();
  };

  const handleFetchData = async () => {
    try {
      const res = await dispatch(fetchDispatch(pagination));
      setPagination({
        ...pagination,
        per_page: res.total_pages ? pagination.per_page : res.length,
        total_pages: res?.total_pages || 1,
        total_records: res.total_records ? res?.total_records : res.length || 0,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleFetchData();
  }, [pagination.page, dispatch, fetchDispatch]);

  const handleDelete = async (id) => {
    await dispatch(deleteDispatch(id)).then((res) => {
      if (data?.length !== 1 && pagination.total_records === 1) {
        setPagination({ ...pagination, page: pagination.page - 1 });
      }
    });
  };

  const jurisdiction_columns = [
    {
      accessor: "SNO",
      title: <Text>#</Text>,
      width: "auto",
      render: (_, i) => (
        <Text>{(pagination?.page - 1) * pagination?.per_page + i + 1}</Text>
      ),
    },
    { accessor: "name", width: "auto" },
    {
      accessor: "country",
      width: "auto",
      render: (record) => <Text>{record?.country?.name}</Text>,
      // filter: () => (
      //   <TextInput
      //     label="Countries"
      //     description="Show countries whose names include the specified text"
      //     placeholder="Search countries..."
      //     icon={<IconSearch size={16} />}
      //     value={country}
      //     onChange={(e) => setCountry(e?.target?.value)}
      //   />
      // ),
      // filtering: country !== "",
    },
    {
      accessor: "status",
      width: "auto",
      render: (record) => (
        <Text>{record?.status === 1 ? "Active" : "Inactive"}</Text>
      ),
    },
    {
      accessor: "actions",
      width: "auto",
      textAlignment: "right",
      title: <Text>Actions</Text>,
      render: (record) => (
        <ActionButtons
          record={record}
          handleModal={handleModal}
          handleDelete={handleDelete}
        />
      ),
    },
  ];

  const defualt_columns = [
    {
      accessor: "SNO",
      title: <Text>#</Text>,
      width: "auto",
      render: (_, i) => (
        <Text>{(pagination?.page - 1) * pagination?.per_page + i + 1}</Text>
      ),
    },
    { accessor: "name", width: "auto" },
    {
      accessor: "status",
      width: "auto",
      render: (record) => (
        <Text>{record?.status === 1 ? "Active" : "Inactive"}</Text>
      ),
    },
    {
      accessor: "actions",
      width: "auto",
      textAlignment: "right",
      title: <Text>Actions</Text>,
      render: (record) =>
        location?.pathname === "/admin/practice" ? (
          <ActionButtonsForExpertise
            record={record}
            handleModal={handleModal}
            handleDelete={handleDelete}
          />
        ) : (
          <ActionButtons
            record={record}
            handleModal={handleModal}
            handleDelete={handleDelete}
          />
        ),
    },
  ];

  const users_columns = [
    {
      accessor: "SNO",
      title: <Text>#</Text>,
      width: "auto",
      render: (_, i) => (
        <Text>{(pagination?.page - 1) * pagination?.per_page + i + 1}</Text>
      ),
    },
    {
      accessor: "full_name",
      width: "auto",
      title: "Full Name",
      render: (record) => (
        <Text>
          {record?.first_name} {record?.last_name}
        </Text>
      ),
    },
    {
      accessor: "email",
      width: "auto",
    },
    {
      accessor: "status",
      width: "auto",
      render: (record) => (
        <Text>{record?.status === "1" ? "Active" : "Blocked"}</Text>
      ),
    },
    {
      accessor: "actions",
      width: "auto",
      textAlignment: "right",
      title: <Text>Actions</Text>,
      render: (record) => (
        <ActionButtons
          record={record}
          handleModal={handleModal}
          handleDelete={handleDelete}
        />
      ),
    },
  ];

  const lawyers_columns = [
    {
      accessor: "SNO",
      title: <Text>#</Text>,
      width: "auto",
      render: (_, i) => (
        <Text>{(pagination?.page - 1) * pagination?.per_page + i + 1}</Text>
      ),
    },
    {
      accessor: "full_name",
      width: "auto",
      title: "Full Name",
      render: (record) => (
        <Link
          to={`/admin/user/statistics/${record?.id}`}
          className="text-dark text-decoration-none text-capitalize"
        >
          <Text
            style={{
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {record?.first_name || "NIL"} {record?.last_name || "NIL"}
          </Text>
        </Link>
      ),
    },
    {
      accessor: "email",
      width: "auto",
      render: (record) => <Text>{record?.email || "NIL"}</Text>,
    },
    {
      accessor: "phone_number",
      width: "auto",
      render: (record) => <Text>{record?.phone_number || "NIL"}</Text>,
    },
    {
      accessor: "dob",
      width: "auto",
      title: "Date Of Birth",
      render: (record) => <Text>{record?.dob || "NIL"}</Text>,
    },
    {
      accessor: "area_expertise",
      width: "auto",
      title: "Area of Practice",
      render: (record) => (
        <Text lineClamp={2}>
          {record?.area_expertise?.length > 0
            ? record?.area_expertise?.map((e, i) => (
                <span key={i}>
                  {e.name}
                  {i < record?.area_expertise.length - 1 && ", "}
                </span>
              ))
            : "Nill"}
        </Text>
      ),
    },
    {
      accessor: "jurisdiction",
      width: "auto",
      title: "Jurisdiction",
      render: (record) => (
        <Text lineClamp={2}>
          {record?.jurisdictions?.length > 0
            ? record?.jurisdictions?.map((e, i) => (
                <span key={i}>
                  {e.name}
                  {i < record?.jurisdictions.length - 1 && ", "}
                </span>
              ))
            : "Nill"}
        </Text>
      ),
    },
    {
      accessor: "country",
      width: "auto",
      title: "Country",
      render: (record) => <Text>{record?.country?.name || "NIL"}</Text>,
    },
    {
      accessor: "state",
      width: "auto",
      title: "State",
      render: (record) => <Text>{record?.state?.name || "NIL"}</Text>,
    },
    {
      accessor: "bar_membership_number",
      width: "auto",
      title: "MemberShip",
      render: (record) => <Text>{record?.bar_membership_number || "NIL"}</Text>,
    },
    {
      accessor: "city",
      width: "auto",
      title: "City",
      render: (record) => <Text>{record?.city || "NIL"}</Text>,
    },
    {
      accessor: "zip_code",
      width: "auto",
      title: "Zip Code",
      render: (record) => <Text>{record?.zip_code || "NIL"}</Text>,
    },
    {
      accessor: "status",
      width: "auto",
      render: (record) => (
        <Text>{record?.status === "1" ? "Active" : "Blocked"}</Text>
      ),
    },
    {
      accessor: "actions",
      width: "auto",
      textAlignment: "right",
      title: <Text>Actions</Text>,
      render: (record) => (
        <ActionButtons
          record={record}
          handleModal={handleModal}
          handleDelete={handleDelete}
        />
      ),
    },
  ];

  const lawyers_columns_for_dash = [
    {
      accessor: "SNO",
      title: <Text>#</Text>,
      width: "auto",
      render: (_, i) => (
        <Text>{(pagination?.page - 1) * pagination?.per_page + i + 1}</Text>
      ),
    },
    {
      accessor: "full_name",
      width: "auto",
      title: "Full Name",
      render: (record) => (
        <Text
          style={{
            fontWeight: "bold",
            cursor: "pointer",
            textTransform: "capitalize",
          }}
          onClick={() => {
            navigate(`/admin/user/statistics/${record?.id}`);
          }}
        >
          {record?.first_name || "NIL"} {record?.last_name || "NIL"}
        </Text>
      ),
    },
    {
      accessor: "email",
      width: "auto",
      render: (record) => <Text>{record?.email || "NIL"}</Text>,
    },
    {
      accessor: "phone_number",
      width: "auto",
      render: (record) => <Text>{record?.phone_number || "NIL"}</Text>,
    },
    {
      accessor: "dob",
      width: "auto",
      title: "Date Of Birth",
      render: (record) => <Text>{record?.dob || "NIL"}</Text>,
    },
    {
      accessor: "area_expertise",
      width: "auto",
      title: "Area of Practice",
      render: (record) => (
        <Text lineClamp={2}>
          {record?.area_expertise?.length > 0
            ? record?.area_expertise?.map((e, i) => (
                <span key={i}>
                  {e.name}
                  {i < record?.area_expertise.length - 1 && ", "}
                </span>
              ))
            : "NIL"}
        </Text>
      ),
    },
    {
      accessor: "jurisdiction",
      width: "auto",
      title: "Jurisdiction",
      render: (record) => (
        <Text lineClamp={2}>
          {record?.jurisdictions?.length > 0
            ? record?.jurisdictions?.map((e, i) => (
                <span key={i}>
                  {e.name}
                  {i < record?.jurisdictions.length - 1 && ", "}
                </span>
              ))
            : "Nill"}
        </Text>
      ),
    },
    {
      accessor: "country",
      width: "auto",
      title: "Country",
      render: (record) => <Text>{record?.country?.name || "NIL"}</Text>,
    },
    {
      accessor: "state",
      width: "auto",
      title: "State",
      render: (record) => <Text>{record?.state?.name || "NIL"}</Text>,
    },
    {
      accessor: "bar_membership_number",
      width: "auto",
      title: "MemberShip",
      render: (record) => <Text>{record?.bar_membership_number || "NIL"}</Text>,
    },
    {
      accessor: "city",
      width: "auto",
      title: "City",
      render: (record) => <Text>{record?.city || "NIL"}</Text>,
    },
    {
      accessor: "zip_code",
      width: "auto",
      title: "Zip Code",
      render: (record) => <Text>{record?.zip_code || "NIL"}</Text>,
    },
    {
      accessor: "status",
      width: "auto",
      render: (record) => (
        <Text>{record?.status === "1" ? "Active" : "Blocked"}</Text>
      ),
    },
  ];

  const clients_columns = [
    {
      accessor: "SNO",
      title: <Text>#</Text>,
      width: "auto",
      render: (_, i) => (
        <Text>{(pagination?.page - 1) * pagination?.per_page + i + 1}</Text>
      ),
    },
    {
      accessor: "full_name",
      width: "auto",
      title: "Full Name",
      render: (record) => (
        <Text className="text-capitalize">
          {record?.first_name} {record?.last_name}
        </Text>
      ),
    },
    {
      accessor: "email",
      width: "auto",
    },
    {
      accessor: "phone_number",
      width: "auto",
      render: (record) => <Text>{record?.phone_number || "NIL"}</Text>,
    },
    {
      accessor: "country",
      width: "auto",
      title: "Country",
      render: (record) => <Text>{record?.country?.name || "NIL"}</Text>,
    },
    {
      accessor: "state",
      width: "auto",
      title: "State",
      render: (record) => <Text>{record?.state?.name || "NIL"}</Text>,
    },
    {
      accessor: "city",
      width: "auto",
      title: "City",
      render: (record) => <Text>{record?.city || "NIL"}</Text>,
    },
    {
      accessor: "zip_code",
      width: "auto",
      title: "Zip Code",
      render: (record) => <Text>{record?.zip_code || "NIL"}</Text>,
    },
    {
      accessor: "status",
      width: "auto",
      render: (record) => (
        <Text>{record?.status === "1" ? "Active" : "Blocked"}</Text>
      ),
    },
    {
      accessor: "actions",
      width: "auto",
      textAlignment: "right",
      title: <Text>Actions</Text>,
      render: (record) => (
        <ActionButtons
          record={record}
          handleModal={handleModal}
          handleDelete={handleDelete}
        />
      ),
    },
  ];

  const clients_columns_for_dash = [
    {
      accessor: "SNO",
      title: <Text>#</Text>,
      width: "auto",
      render: (_, i) => (
        <Text>{(pagination?.page - 1) * pagination?.per_page + i + 1}</Text>
      ),
    },
    {
      accessor: "full_name",
      width: "auto",
      title: "Full Name",
      render: (record) => (
        <Text style={{ textTransform: "capitalize" }}>
          {record?.first_name} {record?.last_name}
        </Text>
      ),
    },
    {
      accessor: "email",
      width: "auto",
    },
    {
      accessor: "phone_number",
      width: "auto",
      render: (record) => <Text>{record?.phone_number || "NIL"}</Text>,
    },
    {
      accessor: "country_id",
      width: "auto",
      title: "Country",
      render: (record) => <Text>{record?.country?.name || "NIL"}</Text>,
    },
    {
      accessor: "state_id",
      width: "auto",
      title: "State",
      render: (record) => <Text>{record?.state?.name || "NIL"}</Text>,
    },
    {
      accessor: "city",
      width: "auto",
      title: "City",
      render: (record) => <Text>{record?.city || "NIL"}</Text>,
    },
    {
      accessor: "zip_code",
      width: "auto",
      title: "Zip Code",
      render: (record) => <Text>{record?.zip_code || "NIL"}</Text>,
    },
    {
      accessor: "status",
      width: "auto",
      render: (record) => (
        <Text>{record?.status === "1" ? "Active" : "Blocked"}</Text>
      ),
    },
  ];

  return (
    <>
      {!fromDash && location?.pathname !== "/admin/countries" ? (
        <div className="my-4">
          <AddDataButton buttonText={buttonText} onClick={handleModal} />
        </div>
      ) : (
        <h3 className="mb-4">
          {tab === "lawyers"
            ? "Newest Lawyers"
            : location?.pathname === "/admin/countries"
            ? "Countries"
            : "Newest Clients"}
        </h3>
      )}

      <DataTable
        className="data-table-with-actions"
        withBorder
        records={data}
        withColumnBorders
        striped
        highlightOnHover
        verticalSpacing={10}
        columns={
          location.pathname === "/admin/moderators"
            ? users_columns
            : location.pathname === "/admin/lawyers"
            ? lawyers_columns
            : location.pathname === "/admin/clients"
            ? clients_columns
            : location.pathname === "/admin/jurisdictions"
            ? jurisdiction_columns
            : fromDash && tab === "clients"
            ? clients_columns_for_dash
            : fromDash && tab === "lawyers"
            ? lawyers_columns_for_dash
            : defualt_columns
        }
        totalRecords={pagination?.total_records}
        recordsPerPage={pagination?.per_page}
        page={pagination?.page}
        onPageChange={(page) => setPagination({ ...pagination, page })}
        fetching={loading}
        minHeight={400}
        loaderVariant="dots"
        noRecordsText="No records found"
        paginationText={({ from, to, totalRecords }) =>
          `Records ${from} - ${to} of ${totalRecords}`
        }
        paginationSize="md"
      />

      {location.pathname === "/admin/moderators" ||
      location.pathname === "/admin/lawyers" ||
      location.pathname === "/admin/clients" ? (
        <UsersModal
          opened={opened}
          close={close}
          data={initialValues}
          setData={setInitialValues}
          modalType={modalType}
          addDispatch={addDispatch}
          updateDispatch={updateDispatch}
          tab={
            location.pathname === "/admin/moderators"
              ? "moderators"
              : location.pathname === "/admin/lawyers"
              ? "lawyers"
              : location.pathname === "/admin/clients"
              ? "clients"
              : ""
          }
        />
      ) : (
        <CreateUpdateDataModal
          opened={opened}
          close={close}
          data={initialValues}
          setData={setInitialValues}
          modalType={modalType}
          addDispatch={addDispatch}
          updateDispatch={updateDispatch}
          tab={
            location.pathname === "/admin/moderators"
              ? "moderators"
              : location.pathname === "/admin/lawyers"
              ? "lawyers"
              : location.pathname === "/admin/clients"
              ? "clients"
              : location.pathname === "/admin/jurisdictions"
              ? "jurisdictions"
              : ""
          }
        />
      )}
    </>
  );
};

const ActionButtons = ({ record, handleModal, handleDelete = null }) => {
  const { loading } = useSelector((state) => state.admin);

  const [opened, { close, open }] = useDisclosure(false);

  return (
    <Box
      sx={{
        display: "flex",
        gap: "16px",
        justifyContent: "flex-end",
      }}
    >
      <ActionIcon onClick={() => handleModal("edit", record)} variant="outline">
        <IconEdit />
      </ActionIcon>
      {handleDelete && (
        <Popover
          width={220}
          position="bottom"
          withArrow
          shadow="md"
          opened={opened}
        >
          <Popover.Target>
            <ActionIcon onClick={open} variant="outline" color="red">
              <IconTrash />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown>
            <Text size="sm">Are you sure you want to delete this record?</Text>
            <Box
              mt={10}
              sx={{
                display: "flex",
                gap: "20px",
                justifyContent: "space-between",
              }}
            >
              <Button color="gray" onClick={close}>
                cancel
              </Button>
              <Button
                color="red"
                loading={loading}
                onClick={() => handleDelete(record?.id)}
              >
                Confirm
              </Button>
            </Box>
          </Popover.Dropdown>
        </Popover>
      )}
    </Box>
  );
};

const ActionButtonsForExpertise = ({
  record,
  handleModal,
  handleDelete = null,
}) => {
  const { loading } = useSelector((state) => state.admin);

  const [opened, { close, open }] = useDisclosure(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        gap: "16px",
        justifyContent: "flex-end",
      }}
    >
      <ActionIcon onClick={() => handleModal("edit", record)} variant="outline">
        <IconEdit />
      </ActionIcon>
      {handleDelete && (
        <Popover
          width={220}
          position="bottom"
          withArrow
          shadow="md"
          opened={opened}
        >
          <Popover.Target>
            <ActionIcon onClick={open} variant="outline" color="red">
              <IconTrash />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown>
            <Box
              sx={{
                display: "flex",
                gap: "20px",
                flexDirection: "column",
                // justifyContent: "flex-start",
                alignItems: "start",
              }}
            >
              <Text
                size="sm"
                color="red"
                sx={{
                  textAlign: "start",
                }}
              >
                Warning: Deleting may impact linked lawyers.
              </Text>
              <label>
                <input
                  type="checkbox"
                  checked={confirmDelete}
                  onChange={() => setConfirmDelete(!confirmDelete)}
                />{" "}
                Yes sure. Delete?
              </label>
            </Box>
            <Box
              mt={10}
              sx={{
                display: "flex",
                gap: "20px",
                justifyContent: "space-between",
              }}
            >
              <Button color="gray" onClick={close}>
                Cancel
              </Button>
              <Button
                color="red"
                loading={loading}
                onClick={() => {
                  if (confirmDelete) {
                    handleDelete(record?.id);
                  }
                  close();
                }}
                disabled={!confirmDelete}
              >
                Confirm
              </Button>
            </Box>
          </Popover.Dropdown>
        </Popover>
      )}
    </Box>
  );
};

export default DataTableWithActions;
