import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { setAlert } from "../../../../../../../actions/alert";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import PropTypes from "prop-types";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Alert from "../../../../../../../components/Alert";
import { JoinSubgroup } from "../../../../../../../actions/group";
import { Redirect } from "react-router-dom";
const JoinForm = ({ setAlert, groupID, JoinSubgroup, subgroups }) => {
  const [formData, setFormData] = useState({
    value: "",
    group_id: groupID,
    done: false,
    btnText: "Join Now ",
    isSubmiting: false
  });

  const radioGroupRef = React.useRef(null);
  const { value, group_id, done, btnText, isSubmiting } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    if (value == "") {
      setAlert("Please choose a subgroup from the list below", "danger");
    } else {
      setFormData({
        ...formData,
        btnText: "Joining please waiting...",
        isSubmiting: true
      });
      let response = JoinSubgroup({ value, group_id });
      response.then(s => {
        setFormData({
          ...formData,
          done: true
        });
      });
    }
    //window.location("/holder/groups");
  };

  return (
    <Fragment>
      {done ? <Redirect to="/holder/groups" /> : null}
      <form className="form" onSubmit={e => onSubmit(e)}>
        <Alert />
        <div className="form-group">
          <RadioGroup
            ref={radioGroupRef}
            aria-label="value"
            name="value"
            value={value}
            onChange={e => onChange(e)}
          >
            {subgroups.map((option, i) => (
              <FormControlLabel
                value={option._id + "-" + i}
                key={option.name}
                control={<Radio />}
                label={option.name}
              />
            ))}
          </RadioGroup>
        </div>
        <div className="form-group">
          <input
            type="submit"
            className="btn btn-danger"
            value={btnText}
            disabled={isSubmiting}
          />
        </div>
      </form>
    </Fragment>
  );
};

JoinForm.propTypes = {
  setAlert: PropTypes.func.isRequired,
  creatSubgroup: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  groupID: state.group._id,
  subgroups: state.group.subgroups
});
export default connect(
  mapStateToProps,
  { setAlert, JoinSubgroup }
)(JoinForm);
