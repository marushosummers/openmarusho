import { transition, container } from "assets/jss/material-dashboard-react.js";

const appStyle = (theme) => ({
  wrapper: {
    position: "relative",
    top: "0",
    height: "100vh",
  },
  mainPanel: {
    [theme.breakpoints.up("md")]: {
      width: `100%`,
    },
    overflow: "auto",
    position: "relative",
    float: "left",
    ...transition,
    maxHeight: "100%",
    width: "100%",
    overflowScrolling: "touch",
  },
  content: {
    marginTop: "70px",
    padding: "10px 10px",
    minHeight: "calc(100vh - 180px)",
  },
  container,
  map: {
    marginTop: "70px",
  },
});

export default appStyle;
