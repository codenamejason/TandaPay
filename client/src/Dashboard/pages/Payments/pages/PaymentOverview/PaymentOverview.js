import React from "react";
import {
  PageHeader,
  TablePremium as PaymentTable
} from "../../../../components";
import { headRows } from "./premiumdata";
import UserStats from "./components/UserStats";
import * as actions from "../../../../../actions/group";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
class PaymentOverview extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);

    if (!props.premiums) {
      props.fetchPremiums();
    }

    this.state = {};
  }
  render() {
    const { user, premiums } = this.props;

    const title = user ? user.name : "";
    const { classes } = this.props;
    return (
      <React.Fragment>
        <PageHeader title={`Welcome, ${title}`} />
        <UserStats />
        {premiums == null ? null : (
          <PaymentTable
            data={premiums}
            headRows={headRows}
            title="Payment History"
            type="payments"
          />
        )}
      </React.Fragment>
    );
  }
}

const RegLink = React.forwardRef((props, ref) => (
  <Link innerRef={ref} {...props} />
));

function mapStateToProps({ premiums, user }) {
  return { premiums, user };
}
export default withRouter(connect(mapStateToProps, actions)(PaymentOverview));
