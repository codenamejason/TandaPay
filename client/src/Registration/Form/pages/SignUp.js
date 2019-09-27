import React from "react";
import { Link } from "react-router-dom";
import { Form } from "react-final-form";
//redux
import { connect } from "react-redux";
import * as actions from "../../../actions";
import { GoogleLogin, FacebookLogin } from "../components/Buttons";


import {
  Button,
  Grid,
  TextField,
  withStyles,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  FormLabel,
  Avatar,
  Typography,
  Divider
} from "@material-ui/core";

import Sep  from '../components/utils/Sep'
import { LockOutlined } from "@material-ui/icons";
import styles from "../styles/form.style";
import { EmailField, PasswordField, NameField } from "../components/Fields";
import { stat } from "fs";

class SignUp extends React.Component {
  state = {
    isLoading: false,
    msg: null,
    isError: false,
  };
  onSubmit = values => {
   
    this.setState({isLoading: true});
  const { name, email, password } = values;
    this.props.signUp({ name, email, password });
  };

  
  componentDidUpdate(prevProps){
  
    const {error} = this.props;
    if(error !==  prevProps.error){
      // Check for registration error
     
      if(error.id == "USER_EXIST_ERROR"){
       
        this.setState({msg: error.msg, isLoading: false, isError: true});
      }else{
        this.setState({msg: null, isLoading: false});
      }
     
    }
  }
  render() {
    const { classes } = this.props;
    return (
    
      <div className={classes.form}>
    
        {/* <Avatar className={classes.avatar}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography> */}
        <Grid container className={classes.social}>
          <GoogleLogin />
          <FacebookLogin />
        </Grid>
       
        <Sep />
        {this.state.isError ? (<p className={classes.error}>{this.state.msg}</p>) : null}
        <Form onSubmit={this.onSubmit}>
      
          {({ handleSubmit }) => (
            <form className={classes.formFix}>
                
              <NameField />
              <EmailField />
              <PasswordField />
             
              <Button
                variant="contained"
                className={classes.submit}
                type="submit"
                disabled={this.state.isLoading}
                onClick={handleSubmit}
              >
                SIGN UP
              </Button>
             
           
              {/* {this.renderExtra()} */}
            </form>
          )}
        </Form>
    
      </div>
    );
  }

  renderRoleForm = () => {
    const { role } = this.state;
    const { classes } = this.props;
    return (
      <Grid container>
        <FormControl component="fieldset" className={classes.FormControl}>
          <FormLabel component="legend">
            Will you be a secretary or policyholder?
          </FormLabel>
          <RadioGroup
            aria-label="User Role"
            name="user-role"
            className={classes.group}
            value={role}
            onChange={this.handleRoleChange}
          >
            <FormControlLabel
              value="secretary"
              control={<Radio />}
              label="Secretary"
            />

            <FormControlLabel
              value="policyholder"
              control={<Radio />}
              label="Policyholder"
            />
            {this.renderAccessField()}
          </RadioGroup>
        </FormControl>
      </Grid>
    );
  };

  renderAccessField = () => {
    const { accessCode, role } = this.state;

    if (role !== "policyholder") {
      return;
    } else {
      return (
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="access-code"
          label="Access Code"
          name="access code"
          autoComplete="access code"
          onChange={this.handleCodeChange}
          value={accessCode}
        >
          Access Code
        </TextField>
      );
    }
  };

  renderExtra = () => {
    return (
      <Grid container>
        <Grid item xs>
          <Link to="/admin" variant="body2">
            Forgot password?
          </Link>
        </Grid>
      </Grid>
    );
  };
}
const mapStateToProps = state => ({
  isAuthenticated: state.isAuthenticated,
  error: state.error,
  
});
export default connect(
  mapStateToProps,
  actions
)(withStyles(styles, { withTheme: true })(SignUp));
