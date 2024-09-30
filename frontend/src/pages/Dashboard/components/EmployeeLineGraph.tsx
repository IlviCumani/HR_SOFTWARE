import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import useHttp from "../../../hooks/useHttp";
import { getFromLocalStorage } from "../../../utils/utils";
import {
  ApexChartState,
  getMonthName,
  SalaryData,
} from "../types/DashboardTypes";

const ApexChart: React.FC = () => {
  const [, , fetchData] = useHttp();
  const [data, setData] = useState<SalaryData[]>([]);
  const [chartState, setChartState] = useState<ApexChartState>({
    series: [{ name: "Bonus", data: [] }],
    options: {
      chart: {
        height: 350,
        type: "line",
        zoom: { enabled: false },
      },
      dataLabels: { enabled: false },
      stroke: { curve: "straight" },
      title: { text: "Bonuses by Month", align: "left" },
      grid: {
        row: { colors: ["#f3f3f3", "transparent"], opacity: 0.5 },
      },
      xaxis: { categories: [] },
    },
  });

  const { employID } = getFromLocalStorage("userData");

  useEffect(() => {
    fetchData(
      { endpoint: `salary/chart?id=${employID}` },
      (data: SalaryData[]) => {
        setData(data);
      }
    );
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      setChartState({
        series: [
          {
            name: "Bonus",
            data: data.map((bonus) => bonus.value),
          },
        ],
        options: {
          chart: {
            height: 350,
            type: "line",
            zoom: { enabled: false },
          },
          dataLabels: { enabled: false },
          stroke: { curve: "straight" },
          title: { text: "Bonuses by Month", align: "left" },
          grid: {
            row: { colors: ["#f3f3f3", "transparent"], opacity: 0.5 },
          },
          xaxis: {
            categories: data.map((month) => getMonthName(month.label)),
          },
        },
      });
    }
  }, [data]);

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={chartState.options}
          series={chartState.series}
          type="line"
          height={355}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default ApexChart;
