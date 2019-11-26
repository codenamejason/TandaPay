import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";

import GroupStats from "../../../../../../../components/GroupStats/GroupStats";
import {
  getActivePeriod,
  getPaidParticipantAmount,
  getGroupDefectionCount
} from "../../../../../../../web3";
class LoadStats extends React.Component {
  constructor(props) {
    console.log(props, "MMMMMMMMMM");

    super(props);
    this.state = { paymentCount: 0, defCount: 0, subIdex: 0 };
  }

  async componentDidMount() {
    try {
      const { groupName, members, subgroups } = this.props.group;
      const [period, error] = await getActivePeriod(
        this.props.ethereum.web3,
        this.props.group.contract
      );

      if (!error) {
        try {
          const [rs_status, error] = await getPaidParticipantAmount(
            this.props.ethereum.web3,
            this.props.group.contract,
            period,
            this.state.subIdex + 1
          );
          console.log(rs_status, error);

          if (rs_status) {
            this.setState({
              paymentCount: rs_status._groupParticipantAmount
            });
          }
        } catch (e) {}

        try {
          const [def, error] = await getGroupDefectionCount(
            this.props.ethereum.web3,
            this.props.group.contract,
            period
          );

          if (def) {
            this.setState({
              defCount: def
            });
          }
        } catch (e) {}
      }
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    const { groupName } = this.props.group;

    const { classes } = this.props;
    let { filter } = this.state;
    let filterExp = RegExp(filter, "i");
    return (
      <div id="members">
        <GroupStats
          defected={this.state.defCount}
          name={groupName}
          paid={this.state.paymentCount}
        />
      </div>
    );
  }
}

function mapStateToProps({ group, ethereum }) {
  return { group, ethereum };
}

export default withRouter(
  connect(mapStateToProps)(withStyles({ withTheme: true })(LoadStats))
);
