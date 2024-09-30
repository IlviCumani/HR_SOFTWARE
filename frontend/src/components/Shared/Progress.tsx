import { Progress as P, ProgressProps as PP, ConfigProvider } from "antd";

type ProgressProps = {
  percentPosition?: {
    align: "start" | "center" | "end";
    type: "inner" | "outer";
  };
  percentage: number;
  status?: "normal" | "exception" | "active" | "success";
  size?: number | [number | string, number];
  props?: PP;
  format?: (percent?: number, successPercent?: number) => React.ReactNode;
};

const Progress = ({
  percentPosition = {
    align: "end",
    type: "inner",
  },
  percentage,
  status,
  format,
  props,
  size = ["100%", 20],
}: ProgressProps) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Progress: {
            defaultColor: "#2A9BE6",
          },
        },
      }}
    >
      <P
        {...props}
        size={size}
        format={format}
        percentPosition={percentPosition}
        percent={percentage}
        status={status}
      />
    </ConfigProvider>
  );
};

export default Progress;
