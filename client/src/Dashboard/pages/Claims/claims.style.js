const drawerWidth = 240;

const styles = (theme) => ({
	toolbar: {
		display: "flex",
		alignItems: "center",
		justifyContent: "flex-end",
		padding: "0 8px",
		...theme.mixins.toolbar
	},
	title: {
		flexGrow: 1
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3)
	},
	link: {
		textDecoration: "none",
		color: "inherit"
	}
});

export default styles;
