import React, { Fragment, Component, useState } from "react";
import Button from "@material-ui/core/Button";

import Dialog from "@material-ui/core/Dialog";

import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Form from "./Form";
import JoinForm from "./JoinForm";
import { connect } from "react-redux";
class Create extends Component {
  state = {
    open: false,
    name: "",
    joinForm: false,
    createForm: false,
    desc: "",
    title: ""
  };
  handleJoinFormClick = () => {
    this.setState({
      open: !this.state.open,
      createForm: false,
      joinForm: true,
      desc: "Join a Subgroup to become a full member",
      title: "Join"
    });
  };

  handleCreateFormClick = () => {
    this.setState({
      open: !this.state.open,
      createForm: true,
      joinForm: false,
      desc: "Create a Subgroup to become the group leader.",
      title: "Create"
    });
  };

  handleClose = () => {
    this.setState({
      open: !this.state.open,
      name: ""
    });
  };

  render() {
    const { open, name } = this.state;
    // const [formData, setFormData] = useState({
    //   name: ""
    // });

    // const { name } = formData;

    return (
      <Fragment>
        <Button
          variant="outlined"
          color="red"
          onClick={this.handleCreateFormClick}
        >
          Create Subgroup
        </Button>{" "}
        <Button
          variant="outlined"
          color="red"
          onClick={this.handleJoinFormClick}
        >
          Join Subgroup
        </Button>
        <Dialog
          open={open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">{this.state.title}</DialogTitle>
          <DialogContent>
            <DialogContentText>{this.state.desc}</DialogContentText>

            {this.state.joinForm ? <JoinForm /> : null}
            {this.state.createForm ? <Form /> : null}
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

export default connect()(Create);
