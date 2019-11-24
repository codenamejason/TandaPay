import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import { setAlert } from "../../../../../../../actions/alert";
import { creatSubgroup } from "../../../../../../../actions/group";
import { Redirect } from "react-router-dom";
import Alert from "../../../../../../../components/Alert";
import PropTypes from "prop-types";
//register
const Form = ({ setAlert, groupID, creatSubgroup }) => {
  const [formData, setFormData] = useState({
    name: "",
    group_id: groupID,
    isSubmiting: false,
    btnText: "Create Now",
    done: false
  });

  const { name, group_id, btnText, isSubmiting, done } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    if (name == "") {
      setAlert("Subgroup name is required", "danger");
    } else {
      setFormData({
        ...formData,
        btnText: "Creating please waiting...",
        isSubmiting: true
      });
      let response = creatSubgroup({ name, group_id });
      response.then(s => {
        setFormData({
          ...formData,
          btnText: "Create Now",
          name: "",
          isSubmiting: false,
          done: true
        });
      });
    }
  };

  return (
    <Fragment>
      {done ? <Redirect to="/holder/groups" /> : null}
      <form className="form" onSubmit={e => onSubmit(e)}>
        <Alert />
        <div className="form-group">
          <TextField
            autoFocus
            margin="dense"
            id="name"
            name="name"
            value={name}
            label="Enter subgroup name"
            type="text"
            fullWidth
            onChange={e => onChange(e)}
          />
          <TextField
            name="group_id"
            value={group_id}
            type="hidden"
            onChange={e => onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="submit"
            className="btn btn-primary"
            value={btnText}
            disabled={isSubmiting}
          />
        </div>
      </form>
    </Fragment>
  );
};

Form.propTypes = {
  setAlert: PropTypes.func.isRequired,
  creatSubgroup: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  groupID: state.group._id
});
export default connect(
  mapStateToProps,
  { setAlert, creatSubgroup }
)(Form);
