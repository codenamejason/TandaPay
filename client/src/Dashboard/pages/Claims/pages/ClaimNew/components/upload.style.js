import { lighten } from "@material-ui/core/styles";
const styles = (theme) => ({
	button: {
		margin: theme.spacing(1),
		borderColor: theme.palette.primary.main,
		color: theme.palette.primary.main,
		"&:hover": {
			backgroundColor: lighten(theme.palette.primary.main, 0.1),
			color: "white"
		}
	},
	input: {
		display: "none"
	},
	container: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		border: "dashed",
		borderColor: "lightgray",
		height: theme.spacing(20),
		flexDirection: "column"
	},
	files: {
		display: "flex",
		width: "80%",
		justifyContent: "space-evenly"
	},
	card: {
		padding: theme.spacing(2)
	}
});

export default styles;
