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
// //consts
// const headerText = "Wallet Balance";
// /**
//  *
//  * @param {Object} props
//  * @todo add data generation for the scripts
//  */
// const WalletOverview = props => {
//   const { classes } = props;

//   const data = getTransferHistory();
//   return (
//     <React.Fragment>
//       <PageHeader title={headerText} />
//       <div className={classes.container}>
//         <WalletCard />
//         <WalletTable
//           data={data}
//           headRows={headRows}
//           title="Transfer History"
//           type="wallet"
//         />
//       </div>
//     </React.Fragment>
//   );
// };

// /**
//  *
//  */
// const getTransferHistory = () => {
//   //axios call
//   const transfers = transferData.transfers;
//   console.log(transfers);

//   return transfers;
// };
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
