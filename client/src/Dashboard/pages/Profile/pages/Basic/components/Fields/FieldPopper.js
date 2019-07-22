import React from "react";
import { Popper, Typography, Paper, Fade } from "@material-ui/core";

const FieldPopper = props => {
  const { id, open, anchorEl } = props;
  return (
    <Popper
      id={id}
      open={open}
      anchorEl={anchorEl}
      transition
      disablePortal={true}
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper>
            <Typography variant="body1">This is a popper</Typography>
          </Paper>
        </Fade>
      )}
    </Popper>
  );
};

export default FieldPopper;
