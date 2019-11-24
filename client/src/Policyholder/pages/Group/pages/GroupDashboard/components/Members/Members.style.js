const styles = theme => ({
  root: {
    flexGrow: 1
  },
  button: {
    margin: theme.spacing(1)
  },
  paper3: {
    backgroundColor: "#dc3545",
    padding: "20px;",
    color: "#f4f4f4"
  },
  paper2: {
    backgroundColor: "#d4edda",
    padding: "20px;",
    color: "#155724"
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary
  },
  standing: {
    fontWeight: "bold",
    border: "1px solid",
    padding: "2px 2px 1px 2px",
    margin: "0px 2px"
  },
  good: {
    color: "#2ECC40",
    borderColor: "#2ECC40"
  },
  okay: {
    color: "#FFDC00",
    borderColor: "#FFDC00"
  },
  bad: {
    color: "#FF4136",
    borderColor: "#FF4136"
  },
  card: {
    margin: 20
  },
  theImage: {
    textAlign: "center",
    padding: "10px"
  },
  img: {
    padding: "10px"
  },
  right: {
    textAlign: "right"
  },
  spaceBetween: {}
});

export default styles;
