import React, { Fragment, Component, useState } from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";

import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Form from "./Form";
import JoinForm from "./JoinForm";
import LeaveSubgroup from "../LeaveSubgroup/LeaveSubgroup";
import LockSubgroup from "../LockSubgroup/LockSubgroup";
import { connect } from "react-redux";
import Alert from "../../../../../../../components/Alert";
class Create extends Component {
  constructor(props) {
    super(props);
    let userHasSubgroup = false;
    let groupHasSubgroups = false;
    let isHeASubgroupLeader = false;
    let subIndex;
    let subMemberIndex;
    let locked = false;
    let subgroupName;
    let minimumthreshold = false;
    let info = "It looks like you haven't joined a subgroup yet";
    if (props.group.subgroups.length > 0) {
      groupHasSubgroups = true;

      for (var i = 0; i < props.group.subgroups.length; i++) {
        if (props.group.subgroups[i].leader == props.user._id) {
          isHeASubgroupLeader = true;
          subIndex = i;
          userHasSubgroup = true;
          subgroupName = props.group.subgroups[i].name;
          info = " ";
          if (props.group.subgroups[i].isLock) {
            locked = true;
          }
          if (props.group.subgroups[i].members.length > 3) {
            minimumthreshold = true;
          }
          break;
        } else {
          for (var y = 0; y < props.group.subgroups[i].members.length; y++) {
            if (props.group.subgroups[i].members[y].id == props.user._id) {
              userHasSubgroup = true;
              subIndex = i;
              subMemberIndex = y;
              subgroupName = props.group.subgroups[i].name;
              info = "";
              break;
            }
          }
        }
      }
    }

    this.state = {
      open: false,
      name: subgroupName,
      groupHasSubgroups,
      userHasSubgroup,
      isHeASubgroupLeader,
      minimumthreshold,
      subIndex,
      locked,

      subMemberIndex,
      joinForm: false,
      info,
      createForm: false,
      desc: "",
      title: ""
    };
  }

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
        <Alert />
        <Typography variant="h6">{this.state.info}</Typography>
        {this.state.userHasSubgroup == false ? (
          <Button
            variant="outlined"
            color="red"
            onClick={this.handleCreateFormClick}
          >
            Create Subgroup
          </Button>
        ) : null}

        {this.state.groupHasSubgroups && this.state.userHasSubgroup == false ? (
          <Button
            variant="outlined"
            color="red"
            onClick={this.handleJoinFormClick}
          >
            Join Subgroup
          </Button>
        ) : null}

        {this.state.isHeASubgroupLeader == false &&
        this.state.userHasSubgroup == true ? (
          <LeaveSubgroup
            subIndex={this.state.subIndex}
            subMemberIndex={this.state.subMemberIndex}
            subgroupName={this.state.name}
          />
        ) : null}

        {this.state.isHeASubgroupLeader == true &&
        this.state.minimumthreshold == true ? (
          <LockSubgroup
            subIndex={this.state.subIndex}
            isLocked={this.state.locked}
            minimumthreshold={this.state.minimumthreshold}
            subgroupName={this.state.name}
          />
        ) : null}

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
function mapStateToProps({ user, group }) {
  return { user, group };
}
export default connect(mapStateToProps)(Create);
