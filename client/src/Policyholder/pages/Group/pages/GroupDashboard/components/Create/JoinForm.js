import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { setAlert } from "../../../../../../../actions/alert";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import PropTypes from "prop-types";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Alert from "../../../../../../../components/Alert";
import { JoinSubgroup } from "../../../../../../../actions/group";

const JoinForm = ({ setAlert, groupID, JoinSubgroup, subgroups }) => {
  const [formData, setFormData] = useState({
    value: "",
    group_id: groupID
  });

  const radioGroupRef = React.useRef(null);
  const { value, group_id } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    if (value == "") {
      setAlert("Please choose a subgroup from the list below", "danger");
    } else {
      JoinSubgroup({ value, group_id });
    }
  };

  return (
    <Fragment>
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
          <input type="submit" className="btn btn-danger" value="Join Now" />
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
