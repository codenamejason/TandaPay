const styles = (theme) => ({
	area: {
		margin: theme.spacing(5, 0),
		display: "flex",
		flexDirection: "column",
		alignItems: "center"
	},
	buttonGroup: {
		textAlign: "center"
	},
	button: {
		width: theme.spacing(15)
	},
	highlight: {
		color: theme.palette.warning.main,
		fontWeight: "bold",
		margin: theme.spacing(0, 0, 3, 0),
		textAlign: "center"
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
	},
	card: {
		padding: theme.spacing(3),
		margin: theme.spacing(0, 3),
		height: theme.spacing(40)
	},
	cardContent: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		height: "100%"
	},
	img: {
		width: theme.spacing(30),
		margin: theme.spacing(0, 0, 5, 0)
	},
	connect: {
		width: "100%"
	}
});

export default styles;
