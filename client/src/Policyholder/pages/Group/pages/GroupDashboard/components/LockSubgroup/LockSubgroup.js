import React, { Fragment } from "react";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import Slide from "@material-ui/core/Slide";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import DialogActions from "@material-ui/core/DialogActions";
import * as actions from "../../../../../../../actions";
class LockSubgroup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      close: false,
      text: "Yes",
      isSubmiting: false
    };
  }
  handleOpen = () => {
    this.setState({
      open: !this.state.open
    });
  };

  handleClose = () => {
    this.setState({
      close: true
    });
  };

  lockSubgroupAction = () => {
    this.setState({
      isSubmiting: true,
      text: "Locking please wait..."
    });

    let response = this.props.lockSubgroup();

    response.then(s => {
      if (s) {
        this.setState({
          close: true
        });
      } else {
        this.setState({
          close: true
        });
      }
    });
  };

  render() {
    // const Transition = React.forwardRef(function Transition(props, ref) {
    //   return <Slide direction="up" ref={ref} {...props} />;
    // });

    const { open } = this.state;
    return (
      <Fragment>
        {this.state.close ? <Redirect to="/holder/groups" /> : null}
        <Typography>
          {" "}
          Your are currently in <b> {this.props.subgroupName} </b> subgroup, and
          you are the leader
        </Typography>
        <Button
          variant="outlined"
          color="red"
          onClick={this.handleOpen}
          disabled={this.props.isLocked}
        >
          Lock Subgroup
        </Button>
        <Dialog
          //TransitionComponent={Transition}
          open={open}
          onClose={this.handleOpen}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Lock Subgroup</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to lock <b> {this.props.subgroupName} </b>{" "}
              subgroup?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              No
            </Button>
            <Button
              color="primary"
              onClick={this.lockSubgroupAction}
              disabled={this.state.isSubmiting}
            >
              {this.state.text}
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

function mapStateToProps({ group }) {
  return { group };
}

export default connect(
  mapStateToProps,
  actions
)(LockSubgroup);
