var moment = require("moment");
var Chartist = require("chartist");

const getMax = (a, b) => {
  return Math.max(a, b);
};
const getMin = (a, b) => {
  return Math.min(a, b);
};
const convertDate = (timestamp) => {
  return new Date(timestamp * 1000);
};

// variables used to create animation on charts
// Waight, HR
var delays = 80,
  durations = 500;

// Activity
var delays2 = 80,
  durations2 = 500;

// ##############################
// // // Weight
// #############################

const makeWeightChart = (dbData) => {
  const _values = [];
  const values = [];
  const times = [];
  const labels = [];

  // 配列に格納
  dbData.forEach((data) => {
    values.push(Math.round(data.value * 10 ** data.unit * 10) / 10);
    times.push(convertDate(data.date));
    _values.push({
      x: convertDate(data.date),
      y: Math.round(data.value * 10 ** data.unit * 10) / 10,
    });
  });

  // 最大値を取得
  const maxValue = values.reduce(getMax);
  // 最小値を取得
  const minValue = values.reduce(getMin);
  // 配列の先頭の値を、最終の値として取得
  const lastUpdatedValue = values[0];
  // 配列の先頭の日時を、最終更新日時として取得
  const lastUpdated = times[0];
  // [0]と[1]の差分を取得
  const transValue = Math.round((values[0] - values[1]) * 10) / 10;
  console.log(values[0]);

  // 配列に格納
  times.forEach((time) => {
    labels.push(time.getDate());
  });

  return {
    data: {
      series: [
        {
          data: _values,
        },
      ],
    },
    props: {
      lastUpdatedValue: lastUpdatedValue,
      lastUpdated: lastUpdated,
      transValue: transValue,
    },
    options: {
      axisX: {
        type: Chartist.FixedScaleAxis,
        divisor: 7,
        labelInterpolationFnc: function (value) {
          return moment(value).format("MMM D");
        },
        high: Date.now(),
      },
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 10,
      }),
      low: minValue - 1,
      high: maxValue + 1, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
      chartPadding: {
        top: 0,
        right: 10,
        bottom: 0,
        left: 0,
      },
    },
    animation: {
      draw: function (data) {
        if (data.type === "line" || data.type === "area") {
          data.element.animate({
            d: {
              begin: 600,
              dur: 700,
              from: data.path
                .clone()
                .scale(1, 0)
                .translate(0, data.chartRect.height())
                .stringify(),
              to: data.path.clone().stringify(),
              easing: Chartist.Svg.Easing.easeOutQuint,
            },
          });
        } else if (data.type === "point") {
          data.element.animate({
            opacity: {
              begin: (data.index + 1) * delays,
              dur: durations,
              from: 0,
              to: 1,
              easing: "ease",
            },
          });
        }
      },
    },
  };
};

// ##############################
// // // HR
// #############################

const makeHRChart = (dbData) => {
  const _values = [];
  const values = [];
  const times = [];
  const labels = [];

  // 配列に格納
  dbData.forEach((data) => {
    values.push(data.value);
    times.push(convertDate(data.created));
    _values.push({
      x: convertDate(data.created),
      y: data.value,
    });
  });

  // TODO: データが無い時の値もここで定義しているため、見通しを良くしたい
  // 最大値を取得
  const maxValue = values.length ? values.reduce(getMax) : 120;
  // 最小値を取得
  const minValue = values.length ? values.reduce(getMin) : 50;
  // 配列の先頭の値を、最終の値として取得
  const lastUpdatedValue = values.length ? values[0] : "🤫";
  // 配列の先頭の日時を、最終更新日時として取得
  const lastUpdated = times.length ? times[0] : "Stopping synchronization";
  // [0]と[1]の差分を取得
  const transValue = Math.round((values[0] - values[1]) * 10) / 10;

  // 配列に格納
  times.forEach((time) => {
    labels.push(time.getDate());
  });

  return {
    data: {
      series: [
        {
          data: _values,
        },
      ],
    },
    props: {
      lastUpdatedValue: lastUpdatedValue,
      lastUpdated: lastUpdated,
      transValue: transValue,
    },
    options: {
      axisX: {
        type: Chartist.FixedScaleAxis,
        divisor: 6,
        labelInterpolationFnc: function (value) {
          return moment(value).format("H:mm");
        },
        high: Date.now(),
      },
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 1,
      }),
      low: minValue - 1,
      high: maxValue + 1, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
      showPoint: false,
      chartPadding: {
        top: 0,
        right: 10,
        bottom: 0,
        left: 0,
      },
    },
    animation: {
      draw: function (data) {
        if (data.type === "line" || data.type === "area") {
          data.element.animate({
            d: {
              begin: 600,
              dur: 700,
              from: data.path
                .clone()
                .scale(1, 0)
                .translate(0, data.chartRect.height())
                .stringify(),
              to: data.path.clone().stringify(),
              easing: Chartist.Svg.Easing.easeOutQuint,
            },
          });
        } else if (data.type === "point") {
          data.element.animate({
            opacity: {
              begin: (data.index + 1) * delays,
              dur: durations,
              from: 0,
              to: 1,
              easing: "ease",
            },
          });
        }
      },
    },
  };
};

// ##############################
// // // Activity
// #############################

const makeActivityChart = (dbData) => {
  const _values = [];
  const values = [];
  const times = [];

  // 配列に格納
  dbData.forEach((data) => {
    values.push(data.totalcalories);
    times.push(new Date(data.date));
    _values.push({
      x: data.date,
      y: data.totalcalories,
    });
  });

  // 最大値を取得
  const maxValue = values.reduce(getMax);
  // 最小値を取得
  // const minValue = values.reduce(getMin);
  // 配列の先頭の値を、最終の値として取得
  const lastUpdatedValue = values[0];
  // 配列の先頭の日時を、最終更新日時として取得
  const lastUpdated = times[0];
  // [0]と[1]の差分を取得
  const transValue = Math.round((values[0] - values[1]) * 10) / 10;

  // // 配列に格納
  // const labels = [];
  // times.forEach((time) => {
  //   labels.push(time.getDate());
  // });

  return {
    data: {
      labels: times.reverse(),
      series: [values.reverse()],
    },
    props: {
      lastUpdatedValue: lastUpdatedValue,
      lastUpdated: lastUpdated,
      transValue: transValue,
    },
    options: {
      axisX: {
        showGrid: false,
        labelInterpolationFnc: function (value) {
          return moment(value).format("D");
        },
        high: Date.now(),
      },
      low: 0,
      high: maxValue + 400,
      chartPadding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    responsiveOptions: [
      [
        "screen and (max-width: 640px)",
        {
          seriesBarDistance: 5,
        },
      ],
    ],
    animation: {
      draw: function (data) {
        if (data.type === "bar") {
          data.element.animate({
            opacity: {
              begin: (data.index + 1) * delays2,
              dur: durations2,
              from: 0,
              to: 1,
              easing: "ease",
            },
          });
        }
      },
    },
  };
};

module.exports = { makeWeightChart, makeHRChart, makeActivityChart };
