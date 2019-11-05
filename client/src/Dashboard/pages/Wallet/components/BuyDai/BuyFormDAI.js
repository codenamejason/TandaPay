import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import { withRouter } from "react-router-dom";
import { InputAdornment } from "@material-ui/core";

class BuyFormDAI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: this.props.user.ethereumAddress,
      amount: 0,
      id: this.props.user._id
    };

    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleAddressChange(event) {
    this.setState({ address: event.target.value });
  }

  handleAmountChange(event) {
    this.setState({ amount: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    if (
      this.state.amount == "" ||
      isNaN(this.state.amount) ||
      !this.state.amount > 0
    ) {
      alert("Please enter a valid amount");
    } else if (
      this.state.address == "" ||
      this.state.address.length < 42 ||
      this.state.address.length > 42
    ) {
      alert("Please enter a valid wallet address");
    } else {
      this.props.history.push(
        "/admin/wallet/finalize/" +
          this.state.address +
          "/" +
          this.state.amount +
          "/" +
          this.state.id
      );
    }
  }

  render() {
    return (
      <Fragment>
        <form className="form" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <TextField
              name="amount"
              fullWidth
              value={this.state.amount}
              required
              label="Amount To Send"
              type="text"
              id="amount-field"
              onChange={this.handleAmountChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">DAI</InputAdornment>
                )
              }}
            />
            <TextField
              autoFocus
              margin="dense"
              id="name"
              name="address"
              // value={address}
              label="Wallet Address"
              type="text"
              defaultValue={this.state.address}
              fullWidth
              onChange={this.handleAddressChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">0x</InputAdornment>
                )
              }}
            />
          </div>

          <div className="form-group">
            <input type="submit" className="btn btn-primary" value="Next" />
          </div>
        </form>
      </Fragment>
    );
  }
}

function mapStateToProps({ user }) {
  return { user };
}

export default withRouter(connect(mapStateToProps)(BuyFormDAI));
