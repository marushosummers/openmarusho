import React from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
//import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import FavoriteIcon from "@material-ui/icons/Favorite";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import Update from "@material-ui/icons/Update";
import AccessTime from "@material-ui/icons/AccessTime";
import Accessibility from "@material-ui/icons/Accessibility";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import {
  makeWeightChart,
  makeHRChart,
  makeActivityChart,
} from "variables/makeCharts.js";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

import firebase from "firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";

const useStyles = makeStyles(styles);

export default function Dashboard() {
  const classes = useStyles();
  const UTC_NOW = Date.now();

  // TODO: firestoreとの連携部分は別モジュールに切り出す

  // 体重: 7日間のデータを取得
  const [weightData, weightloading, weighterror] = useCollectionData(
    firebase
      .firestore()
      .collection("weight")
      .where("date", ">", Math.floor(UTC_NOW / 1000 - 60 * 60 * 24 * 7))
      .orderBy("date", "desc")
  );

  // 心拍数: 3時間のデータを取得
  const [hrData, hrloading, hrerror] = useCollectionData(
    firebase
      .firestore()
      .collection("heart_rate")
      .where("created", ">", Math.floor(UTC_NOW / 1000 - 60 * 60 * 3))
      .orderBy("created", "desc")
      .limit(200)
  );

  // 活動量: 7日間のデータを取得
  const [activityData, activityloading, activityerror] = useCollectionData(
    firebase.firestore().collection("activity").orderBy("date", "desc").limit(7)
  );

  if (weighterror) {
    console.log(weighterror.message);
  }
  if (weightloading) {
    return <div></div>;
  }
  if (!weightData) {
    return <div></div>;
  }

  if (hrerror) {
    console.log(hrerror.message);
  }
  if (hrloading) {
    return <div></div>;
  }
  if (!hrData) {
    return <div></div>;
  }

  if (activityerror) {
    console.log(activityerror.message);
  }
  if (activityloading) {
    return <div></div>;
  }
  if (!activityData) {
    return <div></div>;
  }

  console.log(hrData);
  const weightChart = makeWeightChart(weightData);
  const hrChart = makeHRChart(hrData);
  const activityChart = makeActivityChart(activityData);

  // Status定義 ###################
  const getStatus = (hr) => {
    const hours = new Date().getHours();
    if (hours < 8 && hours > 1) {
      return "😪";
    } else if (hr > 130) {
      return "😇";
    } else if (hr > 120) {
      return "🤯";
    } else if (hr > 110) {
      return "🥵";
    } else if (hr > 100) {
      return "🤪";
    } else if (hr > 95) {
      return "🤩";
    } else if (hr > 90) {
      return "😎";
    } else if (hr > 85) {
      return "😳";
    } else if (hr > 80) {
      return "😃";
    } else if (hr > 75) {
      return "🥴";
    } else if (hr > 40) {
      return "🥱";
    } else {
      return "🦊";
    }
  };
  // ##############################

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={6} md={4}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <Accessibility />
              </CardIcon>
              <p className={classes.cardCategory}>Status</p>
              <h3 className={classes.cardTitle}>
                <large>{getStatus(hrChart.props.lastUpdatedValue)}</large>
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Update />
                {hrChart.props.lastUpdated.toLocaleString()}
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={4}>
          <Card>
            <CardHeader color="danger" stats icon>
              <CardIcon color="danger">
                <FavoriteIcon />
              </CardIcon>
              <p className={classes.cardCategory}>Heart beat</p>
              <h3 className={classes.cardTitle}>
                {hrChart.props.lastUpdatedValue} bpm
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <AccessTime />
                {hrChart.props.lastUpdated.toLocaleString()}
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={4}>
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon color="warning">
                <WhatshotIcon />
              </CardIcon>
              <p className={classes.cardCategory}>Activity</p>
              <h3 className={classes.cardTitle}>
                {Math.round(activityChart.props.lastUpdatedValue)} kcal
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <AccessTime />
                {activityChart.props.lastUpdated.toLocaleDateString()}
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={4}>
          <Card chart>
            <CardHeader color="info">
              <ChartistGraph
                className="ct-chart"
                data={weightChart.data}
                type="Line"
                options={weightChart.options}
                listener={weightChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Daily Weight</h4>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <Update />
                {weightChart.props.lastUpdated.toLocaleDateString()}
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card chart>
            <CardHeader color="danger">
              <ChartistGraph
                className="ct-chart"
                data={hrChart.data}
                type="Line"
                options={hrChart.options}
                listener={hrChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Heart beat</h4>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <Update />
                {hrChart.props.lastUpdated.toLocaleString()}
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card chart>
            <CardHeader color="warning">
              <ChartistGraph
                className="ct-chart"
                data={activityChart.data}
                type="Bar"
                options={activityChart.options}
                responsiveOptions={activityChart.responsiveOptions}
                listener={activityChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Activity</h4>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <Update />
                {activityChart.props.lastUpdated.toLocaleDateString()}
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
