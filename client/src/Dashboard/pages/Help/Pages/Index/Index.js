import React from "react";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";
import { Link } from "react-router-dom";
const Index = props => {
  const { classes } = props;

  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />
      <Typography variant="h2">User Help page</Typography>

      <List>
        <ListItem button component={Link} to="/admin/help/secretary-guide">
          <ListItemText primary="Secretary Guide" />
        </ListItem>
      </List>
    </main>
  );
};

export default withStyles({ withTheme: true })(Index);
