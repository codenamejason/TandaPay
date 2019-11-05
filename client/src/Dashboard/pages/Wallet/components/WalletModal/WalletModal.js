import React from "react";
import { Modal, Typography, withStyles, Grid, Button } from "@material-ui/core";
import styles from "./modal.style";
import { Form } from "react-final-form";
import AmountField from "./components/AmountField";
import AddressField from "./components/AddressField";
/**
 *
 * @param {Object} props
 * @todo Add accessiblity(arial labels, etc)
 * @todo Refactor the Modal's containers to improve performance
 */
const WalletModal = props => {
  const { type, open, handleClose, classes, address } = props;

  return (
    <Modal open={open} onClose={handleClose}>
      <div className={classes.paper}>
        <Typography variant="h6">
          How much DAI do you want to {type}?
        </Typography>
        <Form onSubmit={onSubmit}>
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Grid container>
                <Grid item xs={12} className={classes.container}>
                  <AmountField />
                </Grid>
                <Grid item xs={12} className={classes.container}>
                  <AddressField address={address} />
                </Grid>
                <Grid item xs={12} className={classes.buttonContainer}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleSubmit}
                  >
                    Confirm
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        </Form>
      </div>
    </Modal>
  );
};

const onSubmit = (props, values) => {
  //this.props.history.push("/admin/claims");
};

export default withStyles(styles, { withTheme: true })(WalletModal);
