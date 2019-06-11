import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {
	Drawer,
	List,
	Divider,
	IconButton,
	ListItem,
	withStyles,
	ListItemIcon,
	ListItemText
} from "@material-ui/core";
import {
	ChevronLeft as ChevronLeftIcon,
	MoveToInbox as InboxIcon,
	Mail as MailIcon
} from "@material-ui/icons";
import MenuButtons from "./components/menuButtons";
import styles from "./sidebar.style";
class SideBar extends React.Component {
	handleClose = () => {
		this.props.onDrawerClose();
	};

	renderSecondaryMenu = () => {
		const menuItems = ["Help", "Trash", "Spam"];
		return (
			<List>
				{menuItems.map((text, index) => (
					<ListItem button key={text}>
						<ListItemIcon>
							{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
						</ListItemIcon>
						<ListItemText primary={text} />
					</ListItem>
				))}
			</List>
		);
	};
	render() {
		const { classes, open } = this.props;
		return (
			<Drawer
				variant="permanent"
				className={clsx(classes.drawer, {
					[classes.drawerOpen]: open,
					[classes.drawerClose]: !open
				})}
				classes={{
					paper: clsx(
						{
							[classes.drawerOpen]: open,
							[classes.drawerClose]: !open
						},
						classes.drawerPaper
					)
				}}
				open={open}
			>
				<div className={classes.toolbar}>
					<IconButton onClick={this.handleClose}>
						<ChevronLeftIcon />
					</IconButton>
				</div>
				<Divider />
				<MenuButtons type="nav" />
				<Divider />
				<MenuButtons />
			</Drawer>
		);
	}
}

SideBar.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(SideBar);
