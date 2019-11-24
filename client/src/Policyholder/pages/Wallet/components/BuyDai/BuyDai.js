import React, { Fragment, Component, useState } from "react";
import Button from "@material-ui/core/Button";

import Dialog from "@material-ui/core/Dialog";

import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import BuyFormDAI from "./BuyFormDAI";

import { connect } from "react-redux";
class BuyDai extends Component {
  state = {
    open: false,

    title: ""
  };
  handleBuyFormClick = () => {
    this.setState({
      open: !this.state.open,

      title: "Sell DAI"
    });
  };

  handleClose = () => {
    this.setState({
      open: !this.state.open
    });
  };

  render() {
    const { open } = this.state;

    return (
      <Fragment>
        <Button
          variant="outlined"
          color="primary"
          onClick={this.handleBuyFormClick}
          className=" btn btn-primary"
        >
          Sell DAI
        </Button>{" "}
        <Dialog
          open={open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">{this.state.title}</DialogTitle>
          <DialogContent>
            <BuyFormDAI />
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

export default connect()(BuyDai);
