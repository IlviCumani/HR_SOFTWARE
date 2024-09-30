import React, { createContext, useState, ReactNode, useEffect } from "react";
import useHttp from "../../../hooks/useHttp";

interface NotificationItem {
  _id: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  userId: string;
  path: string;
}

interface NotificationContextProps {
  data: NotificationItem[];
  setData: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
  dataLength: number;
  markAsRead: (id: string) => void;
  appendData: () => void;
}

export const NotificationContext = createContext<
  NotificationContextProps | undefined
>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<NotificationItem[]>([]);

  const [, , fetchData] = useHttp();
  const API = import.meta.env.REACT_APP_NOTIFICATIONS_API;

  const dataLength = data.length;

  const markAsRead = (notificationId: string) => {
    fetchData(
      {
        endpoint: `${API}/${notificationId}/read`,
        method: "PATCH",
      },
      () => {
        setData((prev) =>
          prev.map((item) =>
            item._id === notificationId ? { ...item, isRead: true } : item
          )
        );
      }
    );
  };

  const employID = JSON.parse(
    localStorage.getItem("userData") || "{}"
  ).employID;

  const appendData = () => {
    fetchData(
      {
        endpoint: `${API}/?userId=${employID}`,
      },
      setData
    );
  };

  useEffect(() => {
    appendData();
  }, [employID]);

  return (
    <NotificationContext.Provider
      value={{ data, setData, dataLength, markAsRead, appendData }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
