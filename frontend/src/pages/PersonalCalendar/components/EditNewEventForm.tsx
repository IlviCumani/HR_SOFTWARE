import { useState, useEffect } from "react";
import {
  Input,
  DatePicker,
  TimePicker,
  Typography,
  List,
  Space,
  Dropdown,
  Button,
  message,
  Checkbox,
  Form,
  Col,
  Row,
} from "antd";
import { UserOutlined, CloseOutlined } from "@ant-design/icons";
import { Dayjs } from "dayjs";
import MapInput from "../../Events/components/Map/MapInput";
import useMap from "../../Events/hook/useMap";
import { EmployeeDataType } from "../../Employment/types/Employee";
import { getFromLocalStorage } from "../../../utils/utils";

const { TextArea } = Input;
const { Title } = Typography;

interface NewEvent {
  title: string;
  description: string;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  startTime: Dayjs | null;
  endTime: Dayjs | null;
  location: string;
  invitee?: string[];
}

const EditNewEventForm = ({
  newEvent,
  onChanges,
}: {
  newEvent: NewEvent;
  onChanges: (value: any, field: string) => void;
}) => {
  const [users, setUsers] = useState<EmployeeDataType[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<EmployeeDataType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const main_api = import.meta.env.REACT_APP_MAIN;
  const map = useMap();

  useEffect(() => {
    const userData = getFromLocalStorage();
    setLoggedInUserId(userData.employID || null);

    const fetchAllEmployees = async () => {
      try {
        const response = await fetch(`${main_api}/employees`, {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        });

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError("Failed to fetch employees");
      } finally {
        setLoading(false);
      }
    };

    fetchAllEmployees();
  }, []);

  const handleMenuClick = (e: any) => {
    const userId = e.key;
    const user = users.find((user) => user._id === userId);
    if (user) {
      setSelectedUsers((prevSelectedUsers) => {
        if (prevSelectedUsers.some((u) => u._id === user._id)) {
          message.info(`User ${user.name} is already selected`);
          return prevSelectedUsers;
        }
        message.info(`Selected user: ${user.name}`);
        const newSelectedUsers = [...prevSelectedUsers, user];
        onChanges(
          newSelectedUsers.map((u) => u._id),
          "invitee"
        );
        return newSelectedUsers;
      });
    } else {
      console.log("User not found");
    }
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers((prevSelectedUsers) => {
      const newSelectedUsers = prevSelectedUsers.filter(
        (user) => user._id !== userId
      );
      onChanges(
        newSelectedUsers.map((u) => u._id),
        "invitee"
      );
      return newSelectedUsers;
    });
    message.info("User removed");
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
      onChanges([], "invitee");
    } else {
      const allUsersExceptLoggedIn = users.filter(
        (user) => user._id !== loggedInUserId
      );
      setSelectedUsers(allUsersExceptLoggedIn);
      onChanges(
        allUsersExceptLoggedIn.map((u) => u._id),
        "invitee"
      );
    }
    setSelectAll(!selectAll);
  };

  const menuItems = users
    .filter((user) => user._id !== loggedInUserId)
    .map((user) => ({
      label: user.name,
      key: user._id,
      icon: <UserOutlined />,
    }));

  const menuProps = {
    items: menuItems,
    onClick: handleMenuClick,
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Form layout="vertical">
        <Form.Item name="title" label="Title:" required>
          <Input
            placeholder="Title"
            name="title"
            size="large"
            value={newEvent.title}
            onChange={(e) => onChanges(e.target.value, "title")}
            required
          />
        </Form.Item>
        <Form.Item name="description" label="Description:">
          <TextArea
            placeholder="Description"
            autoSize={{ minRows: 3, maxRows: 5 }}
            name="description"
            value={newEvent.description}
            onChange={(e) => onChanges(e.target.value, "description")}
          />
        </Form.Item>
        <Row gutter={10} justify="space-between">
          <Col>
            <Form.Item name="StartDate" label="Start Date:" required>
              <DatePicker
                onChange={(value) => onChanges(value, "startDate")}
                className="modal-date-picker"
                value={newEvent.startDate}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="endDate" label="End Date:">
              <DatePicker
                onChange={(value) => onChanges(value, "endDate")}
                className="modal-date-picker-end"
                value={newEvent.endDate}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="space-between">
          <Col>
            <Form.Item name="startTime" label="Start Time:">
              <TimePicker
                onChange={(value) => onChanges(value, "startTime")}
                value={newEvent.startTime}
                className="modal-time-picker"
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="endTime" label="End Time:">
              <TimePicker
                onChange={(value) => onChanges(value, "endTime")}
                value={newEvent.endTime}
                className="modal-time-picker-end"
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="location">
          <MapInput map={map} />
        </Form.Item>
        <Title level={5}>Invite Users</Title>
        <Space wrap>
          <Checkbox checked={selectAll} onChange={handleSelectAll}>
            Invite All Users
          </Checkbox>
          <Dropdown.Button menu={menuProps} placement="bottom">
            Invite
            <UserOutlined />
          </Dropdown.Button>

          <Col>
            <strong>Selected Users:</strong>
            <div style={{ overflow: "scroll", maxHeight: "200px" }}>
              {selectedUsers.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  <List
                    bordered
                    dataSource={selectedUsers}
                    renderItem={(item) => (
                      <List.Item
                        actions={[
                          <Button
                            type="text"
                            icon={<CloseOutlined />}
                            onClick={() => handleRemoveUser(item._id)}
                          />,
                        ]}
                      >
                        {item.name}
                      </List.Item>
                    )}
                  />
                </div>
              )}
            </div>
          </Col>
        </Space>
      </Form>
    </>
  );
};

export default EditNewEventForm;
