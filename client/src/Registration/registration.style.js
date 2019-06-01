const styles = theme => ({
  root: {
    height: "100vh"
  },
  image: {
    backgroundImage: "url(https://source.unsplash.com/random)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }
  },
  title: {
    color: "white"
  },
  subtitle: {
    color: "white",
    textAlign: "center"
  },
  form: {
    margin: theme.spacing(5),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  area: {
    margin: theme.spacing(8, 0),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  social: {
    margin: theme.spacing(3),
    display: "flex",
    flexDirection: "row",
    justifyContent: "center"
  },
  link: {
    textDecoration: "none",
    "&:hover": {
      textDecoration: "none"
    }
  },
  divider: {
    width: "100%",
    backgroundColor: "lightgrey"
  }
});

export default styles;
