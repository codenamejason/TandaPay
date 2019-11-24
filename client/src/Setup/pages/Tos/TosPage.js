import React from "react";
import { Grid, withStyles, Typography } from "@material-ui/core";
import styles from "../WalletPage/wallet.style";
import ButtonGroup from "../components/ButtonGroup";
import MetamaskIcon from "../../../assets/metamask.svg";
import FortmaticIcon from "../../../assets/fortmatic.svg";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
/**
 * @summary
 * @class
 * @typedef {React.Component} WalletPage
 * @property {Object} classes
 * @property {String} ethAddress
 * @property {String} walletProvider
 * @property {Boolean} fortmaticLoading
 * @property {Boolean} metamaskLoading
 */
class TosPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      aggreed: false
    };
  }

  handleCheckboxChange = event => {
    console.log(this.state.aggreed);

    this.setState({ aggreed: event.target.checked });
  };

  render() {
    const { classes } = this.props;
    const { aggreed } = this.state;
    const formCompleted = aggreed;
    const file =
      "https://storage.cloud.google.com/tandafile/" + this.props.charterID;
    return (
      <div>
        <Typography variant="h5" className={classes.title}>
          Read & accept the {this.props.groupName} group terms of service
        </Typography>
        <Grid container>
          <FormControlLabel
            control={
              <Checkbox
                checked={aggreed}
                onChange={this.handleCheckboxChange}
              />
            }
            label={
              <div>
                I agree to the {this.props.groupName} group
                <a href={file} target="_blank">
                  {" "}
                  Terms of service
                </a>
              </div>
            }
          />
        </Grid>
        <ButtonGroup
          handleNext={this.handleNext}
          handlePrevious={this.props.previousPage}
          page={2}
          disabled={!formCompleted}
        />
      </div>
    );
  }
  handleChange = name => event => {
    alert(name);
  };
  handleNext = () => {
    const { aggreed } = this.state;
    this.props.onPageSubmit(aggreed);
  };
}
export default withStyles(styles, { withTheme: true })(TosPage);
