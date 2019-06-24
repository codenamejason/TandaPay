const styles = theme => ({
    container: {
        margin: theme.spacing(5, 0, 0, 0),
    },
    center: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    cardContainer: {
        display: "flex",
        justifyContent: "center",
    },
    overview: {
        width: "80%",
        height: theme.spacing(30),
    },
    basic: {
        width: "70%",
        height: theme.spacing(60),
    },
    profileContainer: {
        display: "flex",
        height: "100%",
        margin: theme.spacing(0, 0, 0, 5),
        flexDirection: "column",
        justifyContent: "space-around",
    },
});

export default styles;
