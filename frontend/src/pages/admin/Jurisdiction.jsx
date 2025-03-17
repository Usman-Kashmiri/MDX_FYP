import React from "react";
import { Container } from "react-bootstrap";
import DataTableWithActions from "../../components/admin/DataTableWithActions";
import {
  addJurisdiction,
  deleteJurisdiction,
  fetchJurisdictionList,
  updateJurisdiction,
} from "../../redux/actions/adminActions";
import { useDispatch, useSelector } from "react-redux";

import Fade from "react-reveal/Fade";
import { useEffect } from "react";
const Jurisdiction = () => {
  const { jurisdictions } = useSelector((state) => state?.admin);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchJurisdictionList());
  }, []);
  return (
    <Fade>
      <Container fluid className="pb-md-5 pb-0 mb-md-5 px-md-4 px-3">
        <DataTableWithActions
          data={jurisdictions || []}
          fetchDispatch={fetchJurisdictionList}
          addDispatch={addJurisdiction}
          updateDispatch={updateJurisdiction}
          deleteDispatch={deleteJurisdiction}
          buttonText="Add Jurisdiction"
        />
      </Container>
    </Fade>
  );
};

export default Jurisdiction;
