import React, { useState } from "react";
import { Container } from "react-bootstrap";
import DataTableWithActions from "../../components/admin/DataTableWithActions";
import { useSelector } from "react-redux";
import {
  addClient,
  addLawyer,
  addModerator,
  deleteClient,
  deleteLawyer,
  deleteModerator,
  fetchClientList,
  fetchLawyerList,
  fetchModeratorList,
  updateClient,
  updateLawyer,
  updateModerator,
} from "../../redux/actions/adminActions";
import { SegmentedControl } from "@mantine/core";
import { UseGetRole } from "../../hooks/auth";

import Fade from 'react-reveal/Fade'; 
const ManageUsers = () => {
  const role = UseGetRole();
  const { moderators, lawyers, clients } = useSelector((state) => state.admin);

  const [activeTab, setActiveTab] = useState(
    role === "SuperAdmin" ? "moderators" : "lawyers"
  );

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  const tabs = [
    { label: "Lawyers", value: "lawyers" },
    { label: "Clients", value: "clients" },
  ];

  role === "SuperAdmin" &&
    tabs.splice(0, 0, { label: "Moderators", value: "moderators" });

  return (
    <Fade > 
    <Container fluid className="pb-md-5 pb-0 mb-md-5 px-md-4 px-3">
      <div className="d-flex justify-content-center mb-4">
        <SegmentedControl
          value={activeTab}
          onChange={handleTabChange}
          data={tabs}
        />
      </div>

      {/* Moderators' Tab */}
      {activeTab === "moderators" && (
        <DataTableWithActions
          data={moderators}
          fetchDispatch={fetchModeratorList}
          addDispatch={addModerator}
          updateDispatch={updateModerator}
          deleteDispatch={deleteModerator}
          buttonText="Add Moderator"
        />
      )}

      {/* Lawyers' Tab */}
      {activeTab === "lawyers" && (
        <DataTableWithActions
          data={lawyers}
          fetchDispatch={fetchLawyerList}
          addDispatch={addLawyer}
          updateDispatch={updateLawyer}
          deleteDispatch={deleteLawyer}
          buttonText="Add Lawyer"
        />
      )}

      {/* Clients' Tab */}
      {activeTab === "clients" && (
        <DataTableWithActions
          data={clients}
          fetchDispatch={fetchClientList}
          addDispatch={addClient}
          updateDispatch={updateClient}
          deleteDispatch={deleteClient}
          buttonText="Add Client"
        />
      )}
    </Container>
    </Fade>
  );
};

export default ManageUsers;
