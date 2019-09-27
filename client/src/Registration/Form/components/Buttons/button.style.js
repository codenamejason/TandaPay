const styles = (theme) => ({
	social: {
		margin: theme.spacing(3),
		display: "flex",
		flexDirection: "row",
		justifyContent: "center"
	},
	link: {
		textDecoration: "none",
		fontSize: "12px",
		textAlign: "center",
	
		"&:hover": {
			textDecoration: "none"
		}
	}
});

export default styles;
