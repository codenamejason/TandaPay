import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import { setAlert } from "../../../../../actions/alert";
import { inviteMember } from "../../../../../actions/group";

import Alert from "../../../../../components/Alert";
import PropTypes from "prop-types";
//register
const InviteForm = ({ setAlert, groupID, inviteMember }) => {
  const [formData, setFormData] = useState({
    email: "",
    btnText: "Invite",
    disable: false
  });

  // isSubmittable() {
  //   return /^\S+@\S+\.\S+$/.test(this.state.email);
  // }
  const { email, btnText, disable } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    if (email == "" || groupID == undefined) {
      setAlert("Can not complete your request at the moment", "danger");
    } else {
      setFormData({
        ...formData,
        disable: true,
        btnText: "Inviting please wait..."
      });
      await inviteMember(email);
      setFormData({ ...formData, email: "" });

      //creatSubgroup({ name, group_id });
    }
  };

  return (
    <Fragment>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <Alert />
        <div className="form-group">
          <TextField
            autoFocus
            margin="dense"
            id="email"
            name="email"
            variant="outlined"
            label="Member Email"
            value={email}
            type="email"
            fullWidth
            onChange={e => onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="submit"
            id="inviteBtn"
            disabled={disable}
            className="btn btn-primary"
            value={btnText}
          />
        </div>
      </form>
    </Fragment>
  );
};

InviteForm.propTypes = {
  setAlert: PropTypes.func.isRequired,
  inviteMember: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  groupID: state.group._id
});
export default connect(
  mapStateToProps,
  { setAlert, inviteMember }
)(InviteForm);
