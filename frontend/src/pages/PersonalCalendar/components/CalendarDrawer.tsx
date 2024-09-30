import React from "react";
import { Drawer, Space, Card, Avatar, Divider, Typography } from "antd";
import { DeleteOutlined, EditOutlined, StopOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import formatDateAndTime from "../PersonalCalendarPage";

const { Title } = Typography;

interface Props {
  events: any[];
  open: boolean;
  selectedDate: Dayjs | null;
  onClose: () => void;
  handleDeleteEvent: (eventId: string) => void;
  handleEditEvent: (eventId: string) => void;
  handleCancelEvent: (eventId: string) => void;
}

const CalendarDrawer: React.FC<Props> = ({
  events,
  open,
  selectedDate,
  onClose,
  handleDeleteEvent,
  handleEditEvent,
  handleCancelEvent,
}) => {
  return (
    <Space>
      <section className="calendar-container">
        <Drawer
          placement="bottom"
          closable={false}
          onClose={onClose}
          open={open}
          className="drawer-container"
        >
          <h2>Events on {selectedDate?.format("DD-MM-YYYY")}</h2>
          {events.length > 0 &&
            selectedDate &&
            events
              .filter((event) =>
                dayjs(event.startDate).isSame(selectedDate, "day"),
              )
              .map((event: any) => {
                const formattedStartDate = formatDateAndTime(event.startDate);
                const formattedEndDate = formatDateAndTime(event.endDate);

                return (
                  <Card
                    key={event.id}
                    className="card-container"
                    actions={[
                      <DeleteOutlined
                        key="delete"
                        onClick={() => handleDeleteEvent(event._id)}
                        className="delete-icon-card"
                      />,
                      <EditOutlined
                        key="edit"
                        onClick={() => handleEditEvent(event._id)}
                        className="edit-icon-card"
                      />,
                      <StopOutlined
                        key="cancel"
                        onClick={() => handleCancelEvent(event._id)}
                      />,
                    ]}
                  >
                    <Card.Meta
                      avatar={
                        <Avatar
                          src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${event.id}`}
                        />
                      }
                      title={event.title}
                      description={event.description}
                    />
                    <Divider orientation="left">Start Date:</Divider>
                    <Title level={5}>{formattedStartDate}</Title>

                    <Divider orientation="left">End Date:</Divider>
                    <Title level={5}>{formattedEndDate}</Title>

                    <Divider orientation="left">Location:</Divider>
                    <Title level={5}>{event.location}</Title>

                    <Divider orientation="left">Status:</Divider>
                    <Title level={5}>{event.status}</Title>
                  </Card>
                );
              })}
        </Drawer>
      </section>
    </Space>
  );
};

export default CalendarDrawer;
