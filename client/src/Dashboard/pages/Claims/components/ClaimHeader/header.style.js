const styles = (theme) => ({
	title: {
		color: "black"
	},
	link: {
		textDecoration: "none",
		color: "inherit"
	},
	buttonContainer: {
		display: "flex"
	},
	button: {
		width: theme.spacing(20),
		backgroundColor: theme.palette.button.main,
		color: "white",
		borderRadius: "0",
		"&:hover": {
			backgroundColor: theme.palette.button.dark
		},
		[theme.breakpoints.down("xs")]: {
			marginTop: theme.spacing(3)
		}
	},
	divider: {
		width: "100%",
		color: "black",
		marginTop: theme.spacing(3)
	}
});

export default styles;
