const styles = theme => ({
    container: {
        display: "flex",
        justifyContent: "center",
    },
    card: {
        width: "70%",
        padding: theme.spacing(3),
    },
    divider: {
        width: "100%",
        color: "black",
    },
    providers: {
        display: "flex",
        justifyContent: "space-evenly",
        flexDirection: "column",
    },
});

export default styles;
