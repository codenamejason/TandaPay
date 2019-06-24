const styles = (theme) => ({
    toolbar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "0 8px",
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    standing: {
        fontWeight: "bold",
        border: "1px solid",
        padding: "2px 2px 1px 2px",
        margin: "0px 2px",
    },
    good: {
        color: "#2ECC40",
        borderColor: "#2ECC40",
    },
    okay: {
        color: "#FFDC00",
        borderColor: "#FFDC00",
    },
    bad: {
        color: "#FF4136",
        borderColor: "#FF4136",
    },
});

export default styles;
