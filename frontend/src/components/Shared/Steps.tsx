import { Steps as S } from "antd";

type StepsProps = {
  current: number;
  items: any[];
  responsive?: boolean;
  direction?: "horizontal" | "vertical";
  status?: "wait" | "process" | "finish" | "error";
  onChange?: any;
};

const Steps = ({
  current,
  items,
  responsive,
  direction,
  status,
  onChange,
}: StepsProps) => {
  function deriveStatus(index: number) {
    if (status) {
      return status;
    }
    if (current === index) {
      return "process";
    }
    if (current > index) {
      return "finish";
    }
    return "wait";
  }

  return (
    <S
      style={{
        display: "flex",
        flexDirection: direction === "vertical" ? "column" : "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        padding: "0 10px",
        margin: "0",
      }}
      current={current}
      status={current !== items.length - 1 ? "process" : status}
      responsive={responsive}
      direction={direction}
      items={items}
      onChange={onChange}
    />
  );
};

export default Steps;
