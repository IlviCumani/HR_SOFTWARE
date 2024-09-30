import { SelectProps, Tag } from "antd";
import { EmployeeDetails } from "../../../types/EmployeeDetailsProps";
import { CloseOutlined } from "@ant-design/icons";
import { capitalizeFirstLetter } from "../../../utils/utils";

type CustomTagProps = SelectProps<EmployeeDetails>["tagRender"];

const tagRender: CustomTagProps = (props) => {
  const { label, closable, onClose } = props;
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <Tag
      color={"cyan"}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{
        marginInlineEnd: 4,
        padding: "2px 8px",
        margin: "3px",
      }}
      closeIcon={<CloseOutlined />}
    >
      {capitalizeFirstLetter(label?.toString() || "")}
    </Tag>
  );
};

export default tagRender;
