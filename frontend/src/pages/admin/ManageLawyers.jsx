import React from "react";
import { Container } from "react-bootstrap";
import DataTableWithActions from "../../components/admin/DataTableWithActions";
import {
  addLawyer,
  deleteLawyer,
  fetchLawyerList,
  updateLawyer,
} from "../../redux/actions/adminActions";
import { useSelector } from "react-redux";

import Fade from "react-reveal/Fade";
const ManageLawyers = () => {
  const { lawyers } = useSelector((state) => state.admin);

  return (
    <Fade>
      <Container fluid className="pb-md-5 pb-0 mb-md-5 px-md-4 px-3">
        <DataTableWithActions
          data={lawyers}
          fetchDispatch={fetchLawyerList}
          addDispatch={addLawyer}
          updateDispatch={updateLawyer}
          deleteDispatch={deleteLawyer}
          buttonText="Add Lawyer"
        />
      </Container>
    </Fade>
  );
};

export default ManageLawyers;
