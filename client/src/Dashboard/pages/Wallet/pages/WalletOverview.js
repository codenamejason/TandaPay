import React from "react";
import { withStyles } from "@material-ui/core/";
import styles from "../wallet.style";
import { PageHeader, Table as WalletTable } from "../../../components/";
import { WalletCard } from "../components/";
import { headRows } from "../data";
import * as actions from "../../../../actions/user";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
class WalletOverview extends React.Component {
  constructor(props) {
    super(props);

    console.log(props);

    if (!props.transfers) {
      props.fetchTransfer();
    }

    this.state = {};
  }
  render() {
    const headerText = "Wallet Balance";
    const { classes } = this.props;
    return (
      <React.Fragment>
        <PageHeader title={headerText} />
        <div className={classes.container}>
          <WalletCard />
          {this.props.transfers ? (
            <WalletTable
              data={this.props.transfers}
              headRows={headRows}
              title="Transfer History"
              type="wallet"
            />
          ) : null}
        </div>
      </React.Fragment>
    );
  }
}

const RegLink = React.forwardRef((props, ref) => (
  <Link innerRef={ref} {...props} />
));

function mapStateToProps({ transfers }) {
  return { transfers };
}
export default withRouter(
  connect(
    mapStateToProps,
    actions
  )(withStyles(styles, { withTheme: true })(WalletOverview))
);
