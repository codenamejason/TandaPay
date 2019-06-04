const styles = (theme) => ({
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main
	},
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(1)
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
		width: "100%",
		[theme.breakpoints.up("md")]: {
			width: "auto",
			padding: theme.spacing(1.5, 6, 1.5, 6),
			float: "right"
		}
	},
	formControl: {
		margin: theme.spacing(3)
	},
	group: {
		margin: theme.spacing(1, 0)
	}
});

export default styles;
