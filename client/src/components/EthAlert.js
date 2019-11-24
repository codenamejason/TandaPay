import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const EthAlert = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map(alert => (
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
      {alert.msg}

      <p style={{ color: "#28a745", background: "#d9f3c3", padding: "10px" }}>
        <a
          href={"https://rinkeby.etherscan.io/tx/" + alert.alertHash}
          target="_blank"
        >
          Transaction ID: {alert.alertHash}
        </a>
      </p>
      <p>Click on the Transaction ID to see your transaction progress</p>
    </div>
  ));

EthAlert.propTypes = {
  alerts: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  alerts: state.ethAlertReducer
});

export default connect(mapStateToProps)(EthAlert);
