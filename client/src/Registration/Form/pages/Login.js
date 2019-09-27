import React from "react";
import { Link } from "react-router-dom";
import { Form } from "react-final-form";
//redux
import { connect } from "react-redux";
import * as actions from "../../../actions";
import { GoogleLogin, FacebookLogin } from "../components/Buttons";
import '../components/utils/Sep.css'
import {
  Button,
  Grid,
  withStyles,
  Avatar,
  Typography
} from "@material-ui/core";
import { LockOpenOutlined } from "@material-ui/icons";
import { EmailField, PasswordField } from "../components/Fields";
import Sep  from '../components/utils/Sep'
import styles from "../styles/form.style";

class Login extends React.Component {
  state = {
    isLoading: false,
    msg: null,
    isError: false,
  };
  onSubmit = values => {
    this.setState({isLoading: true});
    const { email, password } = values;
    this.props.logIn({ email, password });
  };
  componentDidUpdate(prevProps){
  
    const {error} = this.props;
    if(error !==  prevProps.error){
      // Check for registration error
     
      if(error.id == "AUTH_ERROR"){
       
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
          <LockOpenOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Log In
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
              <EmailField />
              <PasswordField />
              <Button
                variant="contained"
                color="secondary"
                className={classes.submit}
                type="submit"
                disabled={this.state.isLoading}
                onClick={handleSubmit}
              >
                LOG IN
              </Button>
              {this.renderExtra()}
            </form>
          )}
        </Form>
      </div>
    );
  }

  renderExtra = () => {
    return (
      <Grid container>
        <Grid item xs>
          <Link className="mylink" to="/admin" variant="body2">
            Forgot password?
          </Link>
        </Grid>
        <Grid item>
        Don't have an account?  
          <Link className="mylink" to="/admin" variant="body2">
            {" Sign Up"}
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
)(withStyles(styles, { withTheme: true })(Login));
