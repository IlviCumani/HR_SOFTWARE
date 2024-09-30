import React, { useState } from "react";
import "../../styles/PersonalCalendarPage/PersonalCalendar.css";
import { Drawer, Modal, Typography, Card, Avatar, Divider, Button } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  StopOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import TableHeader from "../../components/Table/TableHeader";
import Meta from "antd/es/card/Meta";
import EditNewEventForm from "./components/EditNewEventForm";
import useEvents, { NewEvent } from "./hooks/personalCalendarFetchHooks";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./components/PersonalCalendarPage.css";

const { Title } = Typography;

const PersonalCalendarPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<NewEvent>({
    title: "",
    description: "",
    startDate: null,
    endDate: null,
    startTime: null,
    endTime: null,
    location: "",
    invitee: [],
  });
  const [editEventId, setEditEventId] = useState<string | null>(null);

  const {
    allEvents,
    addNewEvent,
    handleDeleteEvent,
    handleCancelEvent,
    handleEditEvent,
  } = useEvents();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const onChanges = (value: any, identifier: string) => {
    setNewEvent((prev) => ({ ...prev, [identifier]: value }));
  };

  const formatDateAndTime = (isoDateString: string) => {
    const date = new Date(isoDateString);
    return dayjs(date).format("DD-MM-YYYY HH:mm");
  };

  const showDrawer = (arg: any) => {
    setSelectedDate(dayjs(arg.date));
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setSelectedDate(null);
  };

  const handleAddNewEvent = async () => {
    await addNewEvent(newEvent);
    setIsModalOpen(false);
    setNewEvent({
      title: "",
      description: "",
      startDate: null,
      endDate: null,
      startTime: null,
      endTime: null,
      location: "",
      invitee: [],
    });
  };

  const handleEditEventClick = async () => {
    if (editEventId) {
      await handleEditEvent(editEventId, newEvent);
      setIsModalOpen(false);
      setEditEventId(null);
      setNewEvent({
        title: "",
        description: "",
        startDate: null,
        endDate: null,
        startTime: null,
        endTime: null,
        location: "",
        invitee: [],
      });
      setOpen(false);
    }
  };

  return (
    <>
      <div>
        <section className="calendar-container">
          <TableHeader title="Personal Calendar" onClick={showModal} />
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={allEvents.map((event) => ({
              id: event._id,
              title: event.title,
              start: event.startDate,
              end: event.endDate,
              extendedProps: {
                description: event.description,
                location: event.location,
                status: event.status,
                startTime: event.startTime,
                endTime: event.endTime,
              },
            }))}
            dateClick={showDrawer}
            eventClick={(info) => {
              const event = info.event.extendedProps;
              setEditEventId(info.event.id);
              setNewEvent({
                title: info.event.title,
                description: event.description,
                startDate: dayjs(info.event.start),
                endDate: dayjs(info.event.end),
                startTime: dayjs(event.startTime),
                endTime: dayjs(event.endTime),
                location: event.location,
                invitee: [],
              });
              showModal();
            }}
          />
        </section>
        <Drawer
          placement="bottom"
          closable={false}
          onClose={onClose}
          open={open}
          key="bottom"
          className="drawer-container"
        >
          <h2>Events on {selectedDate?.format("DD-MM-YYYY")}</h2>

          {allEvents.length > 0 && selectedDate && (
            <>
              <h3>Your Events</h3>
              {allEvents
                .filter((event) =>
                  dayjs(event.startDate).isSame(selectedDate, "day")
                )
                .map((event) => (
                  <Card
                    key={event._id}
                    className="card-container"
                    actions={[
                      <DeleteOutlined
                        key="delete"
                        onClick={() => handleDeleteEvent(event._id)}
                        className="delete-icon-card"
                      />,
                      <EditOutlined
                        key="edit"
                        onClick={() => {
                          setEditEventId(event._id);
                          setNewEvent({
                            title: event.title,
                            description: event.description,
                            startDate: dayjs(event.startDate),
                            endDate: dayjs(event.endDate),
                            startTime: dayjs(event.startTime),
                            endTime: dayjs(event.endTime),
                            location: event.location,
                            invitee: [],
                          });
                          showModal();
                        }}
                        className="edit-icon-card"
                      />,
                      <StopOutlined
                        key="cancel"
                        onClick={() => handleCancelEvent(event._id)}
                      />,
                    ]}
                  >
                    <Meta
                      avatar={
                        <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />
                      }
                      title={event.title}
                      description={event.description}
                    />
                    <Divider orientation="left">Start Date:</Divider>
                    <Title level={5}>
                      {formatDateAndTime(event.startDate)}
                    </Title>

                    <Divider orientation="left">End Date:</Divider>
                    <Title level={5}>{formatDateAndTime(event.endDate)}</Title>

                    <Divider orientation="left">Start Time:</Divider>
                    <Title level={5}>
                      {formatDateAndTime(event.startTime)}
                    </Title>

                    <Divider orientation="left">End Time:</Divider>
                    <Title level={5}>{formatDateAndTime(event.endTime)}</Title>

                    <Divider orientation="left">Location:</Divider>
                    <Title level={5}>{event.location}</Title>

                    <Divider orientation="left">Status:</Divider>
                    <Title level={5}>{event.status}</Title>
                  </Card>
                ))}
            </>
          )}
        </Drawer>
        <Modal
          open={isModalOpen}
          width={600}
          onCancel={() => {
            setIsModalOpen(false);
            setEditEventId(null);
            setNewEvent({
              title: "",
              description: "",
              startDate: null,
              endDate: null,
              startTime: null,
              endTime: null,
              location: "",
              invitee: [],
            });
          }}
          title={editEventId ? "Edit Event" : "Add New Event"}
          footer={[
            editEventId ? (
              <Button
                key="submit"
                type="primary"
                onClick={handleEditEventClick}
              >
                <CheckCircleOutlined key="save" className="save-icon" />
                Save Changes
              </Button>
            ) : (
              <Button key="submit" type="primary" onClick={handleAddNewEvent}>
                Add Event
              </Button>
            ),
          ]}
        >
          <EditNewEventForm newEvent={newEvent} onChanges={onChanges} />
        </Modal>
      </div>
    </>
  );
};

export default PersonalCalendarPage;
