import React from "react";
import DataTableWithActions from "../../components/admin/DataTableWithActions";
import {
  addModerator,
  deleteModerator,
  fetchModeratorList,
  updateModerator,
} from "../../redux/actions/adminActions";
import { useSelector } from "react-redux";
import { Container } from "react-bootstrap";
import Fade from "react-reveal/Fade";

const ManageModerators = () => {
  const { moderators } = useSelector((state) => state.admin);

  return (
    <Fade>
      <Container fluid className="pb-md-5 pb-0 mb-md-5 px-md-4 px-3">
        <DataTableWithActions
          data={moderators}
          fetchDispatch={fetchModeratorList}
          addDispatch={addModerator}
          updateDispatch={updateModerator}
          deleteDispatch={deleteModerator}
          buttonText="Add Moderator"
        />
      </Container>
    </Fade>
  );
};

export default ManageModerators;
