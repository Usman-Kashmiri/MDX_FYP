import { Button, createStyles } from "@mantine/core";
import React from "react";
import { useNavigate } from "react-router-dom";

const useStyles = createStyles((theme) => ({
  control: {
    [theme.fn.smallerThan("sm")]: {
      width: "100%",
    },
    color: "#dd995f",
    borderColor: "#dd995f",
  },
}));

const BackButton = () => {
  const navigate = useNavigate();

  const { classes } = useStyles();

  return (
    <Button
      variant="outline"
      size="md"
      mt="xl"
      className={classes.control}
      onClick={() => navigate(-1)}
    >
      Go back
    </Button>
  );
};

export default BackButton;
