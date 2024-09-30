import React, { useContext, useState } from "react";
import { Paths } from "../../utils/paths";
import NavigationLink from "../Shared/NavigationLink";
import { Badge, Popover } from "antd";
import "../Notifications/NotificationStyle.css";
import NotificationContent from "../Notifications/NotificationContent";
import { BellOutlined } from "@ant-design/icons";
import { NotificationContext, NotificationProvider } from "../Notifications/context/useNotificationContext";

const HeaderIcons: React.FC = () => {
  const { data } = useContext(NotificationContext)!;
  const [open, setOpen] = useState<boolean>(false);

  const handleOpenChange = () => {
    setOpen(!open);
  };

  const unreadCount = data.filter((item) => !item.isRead).length;

  const navigationLinkList = [
    {
      icon: (
        <Paths.PersonalCalendar.icon
          style={{ color: "white" }}
          className="nav-menu-icon white-icon"
        />
      ),
      linkTo: `${Paths.PersonalCalendar.path}`,
    },
    {
      icon: (
        <Popover
          content={
            <NotificationProvider>
              <NotificationContent />
            </NotificationProvider>
          }
          title="Notifications"
          trigger="click"
          open={open}
          onOpenChange={handleOpenChange}
        >
          <Badge count={unreadCount} size="small">
            {" "}
            {/* Use unread count */}
            <BellOutlined
              style={{ color: "white" }}
              className="nav-menu-icon white-icon"
            />
          </Badge>
        </Popover>
      ),
    },
    {
      icon: (
        <Paths.Profile.icon
          style={{ color: "white" }}
          className="nav-menu-icon white-icon"
        />
      ),
      linkTo: `${Paths.Profile.path}`,
    },
  ];

  return (
    <ul className="header-icons-list">
      {navigationLinkList.map((item, index) => (
        <li key={index}>
          <NavigationLink {...item} />
        </li>
      ))}
    </ul>
  );
};

export default HeaderIcons;
