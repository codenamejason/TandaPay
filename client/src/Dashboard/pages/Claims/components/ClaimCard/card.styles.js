const styles = (theme) => ({
	card: {
		padding: theme.spacing(3),
		margin: theme.spacing(0, 3),
		display: "flex",
		flexDirection: "column"
	},
	img: {
		height: theme.spacing(20),
		backgroundColor: "darkgrey",
		width: "100%"
	},
	container: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		marginTop: theme.spacing(2)
	},
	status: {
		fontWeight: "bold",
		textAlign: "left"
	},
	pending: {
		color: theme.palette.warning.dark
	},
	denied: {
		color: theme.palette.error.dark
	},
	approved: {
		color: theme.palette.secondary.dark
	},
	button: {
		backgroundColor: theme.palette.button.main,
		color: "white",
		borderRadius: "0",
		"&:hover": {
			backgroundColor: theme.palette.button.dark
		}
	},
	amount: {
		color: theme.palette.money.main,
		fontWeight: "bold"
	}
});

export default styles;
