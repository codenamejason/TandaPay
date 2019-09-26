const styles = theme => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundColor: "#222",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
  },
  title: {
    color: "white",
    textAlign: "center",
  },
  subtitle: {
    color: "white",
    textAlign: "center",
  },
  area: {
    margin: theme.spacing(8, 0),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  social: {
    margin: theme.spacing(3),
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  link: {
    textDecoration: "none",
    "&:hover": {
      textDecoration: "none",
    },
  },
  divider: {
    width: "100%",
    backgroundColor: "lightgrey",
  },
});

export default styles;
