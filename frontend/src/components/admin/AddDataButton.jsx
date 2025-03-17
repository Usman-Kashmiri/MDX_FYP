import { Button } from "@mantine/core";
import React from "react";

const AddDataButton = ({ buttonText, onClick }) => {
  return (
    <Button
      sx={{
        backgroundColor: "#db9651",
        "&:hover": { backgroundColor: "#d28b13" },
      }}
      onClick={() => onClick("create", { id: null, name: "", status: "" })}
      variant="filled"
      mb="md"
      className="btn-of-datatable"
    >
      {buttonText}
    </Button>
  );
};

export default AddDataButton;
