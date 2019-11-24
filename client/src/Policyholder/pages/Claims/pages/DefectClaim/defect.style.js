const styles = theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    margin: "auto",
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
    backgroundColor: theme.palette.background.paper
  },

  root2: {
    width: "100%",
    maxWidth: 360,
    margin: "auto",
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #eee"
  },
  chip: {
    marginRight: theme.spacing(1)
  },
  section1: {
    margin: theme.spacing(3, 2)
  },
  section2: {
    margin: theme.spacing(2)
  },
  section3: {
    margin: theme.spacing(3, 1, 1)
  }
});

export default styles;
