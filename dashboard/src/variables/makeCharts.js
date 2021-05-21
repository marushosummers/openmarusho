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

// ##############################
// // // Weight
// #############################

// variables used to create animation on charts
var delays = 80,
  durations = 500;

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

  console.log(_values);
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
        divisor: 8,
        labelInterpolationFnc: function (value) {
          return moment(value).format("MMM D");
        },
        high: Date.now(),
      },
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0,
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

module.exports = { makeWeightChart };
