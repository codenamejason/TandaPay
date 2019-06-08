import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
	palette: {
		primary: {
			light: "#89C1F2",
			main: "#1F215E"
		},
		secondary: {
			light: "#89C98C",
			main: "#85BB65",
			dark: "#355D36"
		},
		error: {
			main: "#C31432"
		},
		warning: {
			main: "#FBD857",
			dark: "#A78402"
		},
		sidebar: {
			main: "#00B09B",
			dark: "#96C93D"
		}
	}
});

export default theme;
