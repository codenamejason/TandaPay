import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import { withRouter } from "react-router-dom";
import { InputAdornment } from "@material-ui/core";

class BuyFormDAI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: this.props.group.secretary.email
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleCancel(event) {
    this.props.history.push("/holder/payments");
  }
  handleSubmit(event) {
    event.preventDefault();
    this.props.history.push("/holder/wallet/sell/" + this.state.email);
  }

  render() {
    return (
      <Fragment>
        <form className="form" onSubmit={this.handleSubmit}>
          <div className="form-group" style={{ marginBottom: "20px" }}>
            Are you sure you want to sell DAI to secretary ?
          </div>

          <div className="form-group">
            <input type="submit" className="btn btn-primary" value="Procced" />
            <button
              type="button"
              onClick={this.handleCancel}
              className="btn btn-danger"
            >
              Cancel
            </button>
          </div>
        </form>
      </Fragment>
    );
  }
}

function mapStateToProps({ group }) {
  return { group };
}

export default withRouter(connect(mapStateToProps)(BuyFormDAI));
