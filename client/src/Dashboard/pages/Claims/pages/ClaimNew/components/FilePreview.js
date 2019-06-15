import React from "react";
import { withStyles, Card } from "@material-ui/core";
import styles from "./upload.style";
const FilePreview = (props) => {
	const { file, classes } = props;
	return (
		<Card className={classes.card}>
			<h4>{file.name.substr(0, 10)}</h4>
		</Card>
	);
};

export default withStyles(styles, { withTheme: true })(FilePreview);
