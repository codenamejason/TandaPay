const styles = theme => ({
  cardContainer: {
    display: "flex",
    justifyContent: "center"
  },
  overview: {
    width: "80%",
    height: theme.spacing(30),
    [theme.breakpoints.down("md")]: {
      width: "100%"
    }
  },
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  profileContainer: {
    display: "flex",
    height: "100%",
    margin: theme.spacing(0, 0, 0, 5),
    flexDirection: "column",
    justifyContent: "space-around"
  },
  subgroup: {
    color: theme.palette.warning.main,
    fontWeight: "bold"
  },
  standing: {
    color: theme.palette.secondary.light,
    fontWeight: "bold"
  }
});

export default styles;
