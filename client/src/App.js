import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
//Redux
import { connect } from "react-redux";
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
import Setup from "./Setup/";
class App extends React.Component {
	componentDidMount() {
		this.props.fetchUser();
	}
	render() {
		return (
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
					<Route exact path="/admin" component={withAuthorization(Dashboard)} />
				</Switch>
			</BrowserRouter>
		);
	}
}

export default connect(
	null,
	actions
)(App);
