import React from "react";
import {
  Line,
  Bar,
  Radar,
  Doughnut,
  Bubble,
  Pie,
  PolarArea,
} from "react-chartjs-2";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import _ from "lodash";

Chart.register(CategoryScale);

function aggregateDataByKey(data, xAxisKey, yAxisKey, aggregateKey) {
  if (aggregateKey) {
    const aggregatedData = {};

    data.forEach((item) => {
      const xValue = item[xAxisKey];
      const yValue = item[yAxisKey];
      const aggregateValue = item[aggregateKey];

      // Skip entries where start_year is missing
      if (!xValue) {
        return;
      }

      if (!aggregatedData[xValue]) {
        aggregatedData[xValue] = { [xAxisKey]: xValue, [yAxisKey]: 0 };
      }

      aggregatedData[xValue][yAxisKey] += aggregateValue;
    });
    return Object.values(aggregatedData);
  } else {
    return data;
  }
}

const chartComponents = {
  line: Line,
  bar: Bar,
  radar: Radar,
  doughnut: Doughnut,
  bubble: Bubble,
  pie: Pie,
  polarArea: PolarArea,
};

const colors = [
  "#FF0080",
  "#00BFFF",
  "#FFD700",
  "#32CD32",
  "#FF4500",
  "#9400D3",
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4CAF50",
  "#FF9800",
  "#9C27B0",
  "#3F51B5",
];

const getRandomColor = (index) => colors[index % colors.length];

const commonOptions = {
  layout: {
    padding: { top: 20, bottom: 20, left: 20, right: 20 },
  },
  plugins: {
    tooltip: {
      enabled: true,
      backgroundColor: "rgba(0,0,0,0.8)",
      titleColor: "white",
      bodyColor: "white",
      borderColor: "white",
      borderWidth: 1,
      cornerRadius: 5,
      displayColors: false,
    },
    legend: { display: true },
  },
  animation: {
    duration: 4000,
    easing: "easeInOutQuart",
    mode: "progressive",
  },
};

const specificOptions = {
  bar: {
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { family: "Roboto", size: 14, weight: "bold" } },
      },
      y: {
        grid: { display: false },
        ticks: {
          font: { family: "Roboto", size: 14, weight: "bold" },
          callback: (value) => value + "%",
        },
      },
    },
  },
  line: {
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { family: "Roboto", size: 14, weight: "bold" } },
      },
      y: {
        grid: { display: false },
        ticks: {
          font: { family: "Roboto", size: 14, weight: "bold" },
          callback: (value) => value + "%",
        },
      },
    },
  },
  radar: {
    scales: {
      r: { ticks: { beginAtZero: true, min: 0, max: 5, stepSize: 1 } },
    },
  },
  doughnut: { responsive: true, maintainAspectRatio: false },
  bubble: {
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        title: { display: true, text: "Likelihood" },
      },
      y: { title: { display: true, text: "Impact" } },
    },
  },
  pie: { responsive: true, maintainAspectRatio: false },
  polarArea: {
    scales: { r: { ticks: { beginAtZero: true, stepSize: 100, max: 5 } } },
  },
};

const getChartOptions = (type) => ({
  ...commonOptions,
  ...specificOptions[type],
});

const transformData = ({
  type,
  filteredData,
  xAxis,
  yAxis,
  aggKey,
  bubble,
  ...rest
}) => {
  const data = bubble
    ? rest?.data
    : aggregateDataByKey(filteredData, xAxis, yAxis, aggKey);
  switch (type) {
    case "bar":
    case "line":
      return {
        labels: data.map((item) => item[xAxis]),
        datasets: [
          {
            label: yAxis,
            backgroundColor: data.map((_, index) => getRandomColor(index)),
            borderColor: "rgba(0,0,0,1)",
            borderWidth: 1,
            data: data.map((item) => item[yAxis]),
          },
        ],
      };
    case "radar":
      return {
        labels: data.map((item) => item[xAxis]),
        datasets: [
          {
            label: yAxis,
            data: data.map((item) => item[yAxis]),
            backgroundColor: "rgba(79, 59, 169, 0.7)",
            borderColor: "rgba(79, 59, 169, 1)",
            borderWidth: 2,
            pointBackgroundColor: "white",
            pointBorderColor: "rgba(79, 59, 169, 1)",
          },
        ],
      };
    case "doughnut":
      const regionCounts = data.reduce((acc, item) => {
        acc[item[xAxis]] = (acc[item[xAxis]] || 0) + 1;
        return acc;
      }, {});
      return {
        labels: Object.keys(regionCounts),
        datasets: [
          {
            data: Object.values(regionCounts),
            backgroundColor: colors,
            hoverBackgroundColor: colors,
          },
        ],
      };
    case "bubble":
      return {
        datasets: [
          {
            label: bubble.y,
            data: data.map((item) => ({
              x: item[bubble.x],
              y: item[bubble.y],
              r: item[bubble.r] * 5,
            })),
          },
        ],
      };
    case "pie":
      const sectors = data.reduce((acc, item) => {
        acc[item[xAxis]] = (acc[item[xAxis]] || 0) + item[yAxis];
        return acc;
      }, {});
      return {
        labels: Object.keys(sectors),
        datasets: [
          {
            data: Object.values(sectors),
            backgroundColor: Object.keys(sectors).map((_, index) =>
              getRandomColor(index)
            ),
          },
        ],
      };
    case "polarArea":
      return {
        labels: data.map((item) => item[xAxis]),
        datasets: [
          {
            data: data.map((item) => item[yAxis]),
            backgroundColor: colors,
            borderColor: colors.map((color) => color.replace("0.6", "1")),
            borderWidth: 1,
          },
        ],
      };
    default:
      return {};
  }
};

const ChartComponent = (props) => {
  const { title, type, data, xAxis, yAxis, canvasHeight, canvasWidth } = props;
  const DynamicChart = chartComponents[type];
  const chartOptions = getChartOptions(type);

  const filteredData = data.filter(
    (item) =>
      item[xAxis] !== undefined &&
      item[yAxis] !== undefined &&
      item[yAxis] &&
      item[xAxis]
  );

  const chartData = transformData({ ...props, filteredData });

  return (
    <div
      style={{
        margin: "50px",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        borderRadius: "8px",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        backgroundColor: "white",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>{title}</h2>
      <div
        className={`${canvasHeight ? `h-[${canvasHeight}]` : "h-[600px]"} ${
          canvasWidth ? `w-[${canvasWidth}]` : "w-full"
        }`}
      >
        <DynamicChart data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default ChartComponent;
