import { darken } from "@material-ui/core/styles";
const styles = theme => ({
    container: {
        display: "flex",
        justifyContent: "center",
    },
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
});

export default styles;
