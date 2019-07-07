const styles = theme => ({
    paper: {
        top: "30%",
        left: "40%",
        position: "absolute",
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: "2px solid #000",
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 4),
        outline: "none",
    },
});

export default styles;
