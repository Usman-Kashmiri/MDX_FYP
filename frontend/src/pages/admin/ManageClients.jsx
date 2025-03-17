import React from "react";
import {
  addClient,
  deleteClient,
  fetchClientList,
  updateClient,
} from "../../redux/actions/adminActions";
import { useSelector } from "react-redux";
import DataTableWithActions from "../../components/admin/DataTableWithActions";
import { Container } from "react-bootstrap";

import Fade from "react-reveal/Fade";
const ManageClients = () => {
  const { clients } = useSelector((state) => state.admin);

  return (
    <Fade>
      <Container fluid className="pb-md-5 pb-0 mb-md-5 px-md-4 px-3">
        <DataTableWithActions
          data={clients}
          fetchDispatch={fetchClientList}
          addDispatch={addClient}
          updateDispatch={updateClient}
          deleteDispatch={deleteClient}
          buttonText="Add Client"
        />
      </Container>
    </Fade>
  );
};

export default ManageClients;
