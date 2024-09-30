export interface ApexChartState {
  series: {
    name: string;
    data: number[];
  }[];
  options: {
    chart: {
      height: number;
      type: "line";
      zoom: {
        enabled: boolean;
      };
    };
    dataLabels: {
      enabled: boolean;
    };
    stroke: {
      curve: "straight";
    };
    title: {
      text: string;
      align: "left";
    };
    grid: {
      row: {
        colors: string[];
        opacity: number;
      };
    };
    xaxis: {
      categories: string[];
    };
  };
}

export interface SalaryData {
  value: number;
  label: string;
}

export function getMonthName(monthNumber: number) {
  const date = new Date();
  date.setMonth(monthNumber - 1);
  return date.toLocaleString("en-EN", { month: "short" });
}
