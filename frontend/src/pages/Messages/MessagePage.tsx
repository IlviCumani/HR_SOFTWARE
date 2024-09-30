import { Avatar, Input, Layout } from "antd";
import { Menu, theme } from "antd";
import Header from "../../components/Header/Header";
import SelectedUserAvatar from "./components/SelectedUserAvatar";
import { listOfUsers } from "./dummyData";
import { stringToHashCodeHelper } from "../../utils/utils";
import { useState } from "react";
import { UserType } from "./types/userType";
import Button from "../../components/Shared/Button";
import { StepBackwardOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import MessageBoard from "./components/MessageBoard";
import "./styles/MessagePage.css";
import Vasjan from "./components/Vasjan";

const { Sider, Content } = Layout;

export function RenderAvatar(imagePath: string | undefined, name: string) {
  const color = stringToHashCodeHelper(name);

  if (imagePath) {
    return <Avatar src={imagePath} />;
  }
  return (
    <Avatar
      style={{
        backgroundColor: color,
        color: "black",
      }}
    >
      {name[0]}
    </Avatar>
  );
}

export default function MessagePage() {
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [searchTearm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const filteredUsers = listOfUsers.filter((user) => {
    const fullName = `${user.name} ${user.surname}`;
    return fullName.toLowerCase().includes(searchTearm.toLowerCase());
  });

  const items = filteredUsers.map((user) => {
    return {
      key: user._id,
      label: `${user.name} ${user.surname}`,
      icon: RenderAvatar(user.profilePhoto, user.name),
    };
  });

  function handleUserClick(userID: string) {
    const user = listOfUsers.find((user) => user._id === userID);
    setSelectedUser(user || null);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
  }

  return (
    <Layout
      style={{
        background: colorBgContainer,
        height: "100vh",
        borderRadius: borderRadiusLG,
      }}
    >
      <Layout>
        <Sider
          width={300}
          className="sidebar-menu"
          style={{ background: colorBgContainer, padding: 10 }}
        >
          <Input placeholder="Search" onChange={handleChange} size="large" />
          <Menu
            mode="inline"
            onClick={({ key }) => handleUserClick(key.toString())}
            style={{ height: "100%", borderRight: 0, marginTop: 15 }}
            items={items}
          />
        </Sider>
        <Layout>
          <Header
            first={<SelectedUserAvatar user={selectedUser} />}
            third={
              <Button
                onClick={() => {
                  navigate("/dashboard");
                }}
                icon={<StepBackwardOutlined />}
                type="dashed"
                ghost
                style={{ marginRight: 30 }}
              >
                Back
              </Button>
            }
          ></Header>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              height: "100%",
              background: colorBgContainer,
            }}
          >
            {selectedUser ? (
              <MessageBoard selectedUser={selectedUser} />
            ) : (
              <Vasjan />
            )}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
