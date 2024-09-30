import React, { useContext } from "react";
import { Button, List } from "antd";
import VirtualList from "rc-virtual-list";
import "../Notifications/NotificationStyle.css";
import { useNavigate } from "react-router-dom";
import { NotificationContext } from "./context/useNotificationContext";

const ContainerHeight = 400;

const NotificationContent: React.FC = () => {
  const { data, markAsRead, appendData } = useContext(NotificationContext)!; 
  const navigate = useNavigate();

  const onScroll = () => {
    appendData();
  };

  return (
    <List className="ant-list">
      <VirtualList
        data={data}
        height={ContainerHeight}
        itemHeight={47}
        itemKey="_id"
        onScroll={onScroll}
        className="notification-NavList"
      >
        {(item) => (
          <List.Item
            className={item.isRead ? "notification-is-read" : ""}
            key={item._id}
          >
            <List.Item.Meta
              title={<a onClick={() => navigate(item.path)}>{item.message}</a>}
              description={item.createdAt}
            />
            <Button
              style={{ color: item.isRead ? "purple" : "blue" }}
              className="markAsRead"
              type="text"
              onClick={() => markAsRead(item._id)} 
            >
              {item.isRead ? "Read" : "Mark as Read"}
            </Button>
          </List.Item>
        )}
      </VirtualList>
    </List>
  );
};

export default NotificationContent;
