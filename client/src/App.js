import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
//Redux
import { connect } from "react-redux";
import { ThemeProvider } from "@material-ui/styles";
import * as actions from "./actions/index";
//HOCs
import {
	withAuthorization,
	withoutAuthorization,
	withIncompleteAuthorization
} from "./HOCs/authorized";
//

import Registration from "./Registration/Registration";
import Dashboard from "./Dashboard/Dashboard";
import Setup from "./Setup/Setup";

import theme from "./theme";
class App extends React.Component {
	componentDidMount() {
		this.props.fetchUser();
	}
	render() {
		return (
			<ThemeProvider theme={theme}>
				<BrowserRouter>
					<Switch>
						<Route
							exact
							path="/"
							component={withoutAuthorization(Registration)}
						/>
						<Route
							exact
							path="/setup"
							component={withIncompleteAuthorization(Setup)}
						/>
						<Route path="/admin" component={withAuthorization(Dashboard)} />
					</Switch>
				</BrowserRouter>
			</ThemeProvider>
		);
	}
}

export default connect(
	null,
	actions
)(App);
