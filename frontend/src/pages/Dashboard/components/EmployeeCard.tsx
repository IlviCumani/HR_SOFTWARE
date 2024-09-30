import Button from "../../../components/Shared/Button";
import { Typography } from "antd";
import { Link } from "react-router-dom";

type EmployeeCardProps = {
  displayNr: number;
  displayTxt: string;
  onClickPath: string;
  status: string;
};

const EmployeeCard = ({
  displayNr,
  displayTxt,
  onClickPath,
  status,
}: EmployeeCardProps) => {
  const { Title, Text } = Typography;
  return (
    <Link to={onClickPath} className="active-dashboard-wrapp">
      <Button className={`active-dashboard ${status}`} type="text">
        <Title style={{ margin: 0, color: "#666666" }}>{displayNr}</Title>
        <Text style={{ fontSize: 20, color: "#666666" }}>{displayTxt}</Text>
      </Button>
    </Link>
  );
};

export default EmployeeCard;
