import React from "react";
import Wyre from "react-wyre";
import { Button } from "@material-ui/core";
/**
 * @type {React.Component}
 * @property -
 */
class WyreModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }
  render() {
    const accountID = process.env.REACT_APP_WYRE_ID;
    const key = process.env.REACT_APP_WYRE_KEY;

    const { address, amount, id } = this.props;

    const { open } = this.state;
    return (
      <Wyre
        config={{
          env: "test",
          accountId: accountID,
          auth: {
            type: "secretKey",
            // type: "metamask"
            secretKey: key
          },
          operation: {
            type: "debitcard",
            destCurrency: "DAI",
            destAmount: amount,
            dest: address
          },
          style: {
            primaryColor: "#1db589"
          }
        }}
        open={open}
        onReady={() => console.log("ready")}
        onComplete={event => console.log("complete", event)}
      >
        <Button
          variant="contained"
          color="secondary"
          onClick={() => this.setState({ open: true })}
        >
          Buy {amount} DAI
        </Button>
      </Wyre>
    );
  }
}

export default WyreModal;
