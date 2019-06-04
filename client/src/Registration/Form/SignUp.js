import React from "react";
import { Link } from "react-router-dom";
import { isEmail, isEmpty, isLength } from "validator";
//redux
import { connect } from "react-redux";
import * as actions from "../../actions";
import {
	Button,
	Grid,
	TextField,
	withStyles,
	RadioGroup,
	Radio,
	FormControlLabel,
	FormControl,
	FormLabel
} from "@material-ui/core";
import styles from "./styles/form.style";
import { EmailField, PasswordField } from "./components/Fields/";

const RegLink = React.forwardRef((props, ref) => (
	<Link innerRef={ref} {...props} />
));

class SignUp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: "",
			password: "",
			name: "",
			role: "",
			accessCode: "",
			emailError: "",
			passwordError: ""
		};
	}

	handleSubmit = (event) => {
		event.preventDefault();
		const { name, email, password, role } = this.state;
		this.props.signUp({ name, email, password, role });
	};

	render() {
		const { classes } = this.props;
		const { email, emailError, password, passwordError } = this.state;
		return (
			<form className={classes.form} noValidate>
				{this.renderNameField()}
				<EmailField
					handleEmailChange={this.handleEmailChange}
					emailError={emailError}
					email={email}
				/>
				<PasswordField
					handlePasswordChange={this.handlePasswordChange}
					passwordError={passwordError}
					password={password}
				/>
				{this.renderRoleForm()}
				<Button
					variant="contained"
					color="primary"
					className={classes.submit}
					component={RegLink}
					to="/admin"
					type="submit"
					onClick={this.handleSubmit}
				>
					SIGN UP
				</Button>
				{this.renderExtra()}
			</form>
		);
	}
	handleRoleChange = (event) => {
		let role = event.target.value;

		this.setState({
			role: role
		});
	};

	handleCodeChange = (event) => {
		let code = event.target.value;

		this.setState({
			code: code
		});
	};
	handleEmailChange = (event) => {
		//add validation to check for error
		let email = event.target.value;
		this.setState({
			email: email
		});

		if (!isEmail(email) && !isEmpty(email)) {
			this.setState({
				emailError: "Invalid Email"
			});
		} else {
			this.setState({
				emailError: ""
			});
		}
	};
	handleNameChange = (event) => {
		//add validation to check for error
		let name = event.target.value;
		this.setState({
			name: name
		});
	};

	handlePasswordChange = (event) => {
		let password = event.target.value;
		this.setState({
			password: password
		});

		let invalidPassword =
			!isLength(password, {
				min: 8
			}) && !isEmpty(password);
		if (invalidPassword) {
			this.setState({
				passwordError: "Invalid Password"
			});
		} else {
			this.setState({
				passwordError: ""
			});
		}
	};

	renderRoleForm = () => {
		const { role, accessCode } = this.state;
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
	renderNameField = () => {
		return (
			<TextField
				variant="outlined"
				margin="normal"
				required
				fullWidth
				id="name"
				label="Name"
				name="name"
				autoComplete="name"
				autoFocus
				onChange={this.handleNameChange}
				value={this.state.name}
			/>
		);
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

export default connect(
	null,
	actions
)(withStyles(styles, { withTheme: true })(SignUp));
