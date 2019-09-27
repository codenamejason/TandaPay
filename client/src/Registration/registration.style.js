const styles = theme => ({
  root: {
    height: "100vh",
    backgroundColor: "white",
  },
  image: {
    backgroundColor: "#2a2a72",
    backgroundImage: "linear-gradient(315deg, #2a2a72 0%, #009ffd 74%)",
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
    fontSize: "14px;",
    marginTop: "10px"
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
