import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import Button from "../Shared/Button";
import { ButtonSize, ButtonType } from "../../enums/Button";

type TriggerProps = {
  colapsed: boolean;
};

const Trigger = ({ colapsed }: TriggerProps) => {
  return (
    <div className="navigation-menu-trigger">
      <Button
        type={ButtonType.PRIMARY}
        ghost
        size={ButtonSize.LARGE}
        icon={colapsed ? <RightOutlined /> : <LeftOutlined />}
      ></Button>
    </div>
  );
};

export default Trigger;
