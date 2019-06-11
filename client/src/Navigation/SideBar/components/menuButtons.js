import React from "react";
import {
	List,
	ListItem,
	withStyles,
	ListItemIcon,
	ListItemText
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { nav, extra } from "./buttonConfig";
import styles from "../sidebar.style";
const menuButtons = (props) => {
	const { classes, type } = props;
	const menuItems = type === "nav" ? nav.menuItems : extra.menuItems;
	const itemProps = type === "nav" ? nav.itemProps : extra.itemProps;

	return (
		<List>
			{menuItems.map((text, index) => (
				<Link to={`/admin/${itemProps[text].url}`} className={classes.link}>
					<ListItem button key={text}>
						<ListItemIcon>{itemProps[text].icon}</ListItemIcon>
						<ListItemText primary={text} />
					</ListItem>
				</Link>
			))}
		</List>
	);
};
export default withStyles(styles, { withTheme: true })(menuButtons);
