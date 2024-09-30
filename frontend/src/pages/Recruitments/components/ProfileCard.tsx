import { Card, Row, Col, Avatar } from "antd";
import { useRecruitmentContext } from "../context";
import { Text } from "../../../components/Shared/Typography";
import { randomColor } from "../../../utils/color.util";
const ProfileCard = () => {
  const { editingRecord } = useRecruitmentContext();
  const avatarText = `${editingRecord?.name?.[0] || ""}${
    editingRecord?.surname?.[0] || ""
  }`;
  const color = randomColor(avatarText);
  return (
    <Card style={{ backgroundColor: "#f5f5f5" }}>
      <Row align="middle" gutter={[16, 16]}>
        <Col>
          <Avatar
            size={64}
            style={{
              backgroundColor: `${color}`,
              fontSize: 24,
            }}
          >
            {avatarText.toUpperCase()}
          </Avatar>
        </Col>
        <Col>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            {editingRecord?.name} {editingRecord?.surname}
          </Text>
          <br />
          <Text>{editingRecord?.email}</Text>
          <br />
          <Text>{editingRecord?.position}</Text>
        </Col>
      </Row>
    </Card>
  );
};

export default ProfileCard;
