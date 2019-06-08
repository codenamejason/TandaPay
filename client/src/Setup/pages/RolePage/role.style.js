const styles = (theme) => ({
	title: {
		color: "#22685D",
		textAlign: "center",
		fontWeight: "bold"
	},
	subtitle: {
		textAlign: "center",
		color: "darkgrey"
	},
	area: {
		margin: theme.spacing(8, 0),
		display: "flex",
		flexDirection: "column",
		alignItems: "center"
	},
	icon: {
		fontSize: theme.spacing(15),
		color: "darkgrey"
	},
	iconSelected: {
		color: theme.palette.primary.main
	},
	iconButton: {
		borderColor: "lightgrey",
		borderStyle: "solid",
		border: theme.spacing(0.3),
		padding: theme.spacing(3),
		margin: theme.spacing(3)
	},
	buttonSelected: {
		borderColor: theme.palette.primary.main
	},
	buttonGroup: {
		textAlign: "center"
	},
	cancelButton: {
		textAlign: "left"
	},
	nextButton: {
		textAlign: "right"
	},
	button: {
		width: theme.spacing(15)
	},
	cancel: {
		backgroundColor: theme.palette.error.main,
		color: "white",
		"&:hover": {
			backgroundColor: theme.palette.error.light
		}
	},
	next: {
		backgroundColor: theme.palette.secondary.main,
		color: "white",
		"&:hover": {
			backgroundColor: theme.palette.secondary.light
		}
	}
});

export default styles;
