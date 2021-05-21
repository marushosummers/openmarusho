import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import TwitterIcon from "@material-ui/icons/Twitter";
import GitHubIcon from "@material-ui/icons/GitHub";
// core components
import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/material-dashboard-react/components/headerLinksStyle.js";

const useStyles = makeStyles(styles);

export default function AdminNavbarLinks() {
  const classes = useStyles();
  return (
    <div>
      <Button
        color={window.innerWidth > 959 ? "transparent" : "white"}
        justIcon={window.innerWidth > 959}
        simple={!(window.innerWidth > 959)}
        aria-label="Twitter"
        className={classes.buttonLink}
      >
        <a href="https://twitter.com/marusho_summers" className={classes.icons}>
          <TwitterIcon className={classes.icons} />
        </a>
      </Button>
      <Button
        color={window.innerWidth > 959 ? "transparent" : "white"}
        justIcon={window.innerWidth > 959}
        simple={!(window.innerWidth > 959)}
        aria-label="GitHub"
        className={classes.buttonLink}
      >
        <a href="https://github.com/marushosummers" className={classes.icons}>
          <GitHubIcon className={classes.icons} />
        </a>
      </Button>
    </div>
  );
}
