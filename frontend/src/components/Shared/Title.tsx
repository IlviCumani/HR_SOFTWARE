import React from "react";
import { Typography } from "antd";

const { Title: AntTitle } = Typography;

interface TitleProps {
  level?: 1 | 2 | 3 | 4 | 5;
  title: string;
  style?: React.CSSProperties;
}

const Title: React.FC<TitleProps> = ({ level = 5, title, style }) => {
  return (
    <AntTitle level={level} style={style}>
      {title}
    </AntTitle>
  );
};

export default Title;
