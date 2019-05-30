import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { connect } from "react-redux";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  withStyles
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

import * as actions from "../actions";
import SideBar from "./SideBar";
import styles from "./sidebar.style";
class MiniDrawer extends React.Component {
  state = {
    open: false
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleLogOut = () => {
    this.props.logOut();
  };
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: this.state.open
          })}
        >
          <Toolbar disableGutters={!this.state.open}>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
              className={clsx(classes.menuButton, {
                [classes.hide]: this.state.open
              })}
            >
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" color="inherit" noWrap>
              Tanda Pay Dashboard
            </Typography>
            <Button color="inherit" onClick={this.handleLogOut}>
              Log Out
            </Button>
          </Toolbar>
        </AppBar>
        <SideBar
          onDrawerClose={this.handleDrawerClose}
          open={this.state.open}
        />
      </div>
    );
  }
}

MiniDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default connect(
  null,
  actions
)(withStyles(styles, { withTheme: true })(MiniDrawer));
