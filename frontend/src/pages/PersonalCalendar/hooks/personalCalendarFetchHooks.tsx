import { useState, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import { getAuthToken } from "../../../utils/utils";
const main_api = import.meta.env.REACT_APP_MAIN;

export enum Status {
  Cancelled = "cancelled",
  Finished = "finished",
  Ongoing = "ongoing",
  Upcoming = "upcoming",
}

export interface NewEvent {
  title: string;
  description: string;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  startTime: Dayjs | null;
  endTime: Dayjs | null;
  location: string;
  invitee?: string[];
}

const fetchEventsByCriteria = async (endpoint: string, userId: string) => {
  try {
    const response = await fetch(`${main_api}/events/${endpoint}/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Failed to fetch ${endpoint} events`);
    }
    return data.map(updateEventStatus);
  } catch (error) {
    console.error(`Error fetching ${endpoint} events:`, error);
    return [];
  }
};

const updateEventStatus = (event: any) => {
  const currentDate = dayjs();
  const eventStartDate = dayjs(event.startDate);
  if (event.status !== Status.Cancelled) {
    if (eventStartDate.isBefore(currentDate, "day")) {
      event.status = Status.Finished;
    } else if (eventStartDate.isSame(currentDate, "day")) {
      event.status = Status.Ongoing;
    } else {
      event.status = Status.Upcoming;
    }
  }
  return event;
};

const useEvents = () => {
  const [allEvents, setAllEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchAllEvents = async () => {
      const employID = JSON.parse(
        localStorage.getItem("userData") || "{}"
      ).employID;
      const [creatorEvents, inviteeEvents] = await Promise.all([
        fetchEventsByCriteria("byCreator", employID),
        fetchEventsByCriteria("invitee", employID),
      ]);
      setAllEvents([...creatorEvents, ...inviteeEvents]);
    };

    fetchAllEvents();
  }, []);

  const addNewEvent = async (newEvent: NewEvent) => {
    try {
      const userId = JSON.parse(
        localStorage.getItem("userData") || "{}"
      ).employID;
      const response = await fetch(`${main_api}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          ...newEvent,
          startDate: newEvent.startDate?.format("YYYY-MM-DD"),
          endDate: newEvent.endDate?.format("YYYY-MM-DD"),
          startTime: newEvent.startTime?.toISOString(),
          endTime: newEvent.endTime?.toISOString(),
          location: newEvent.location,
          creatorId: userId,
          invitees: newEvent.invitee || [],
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to add event");
      }
      const updatedEvent = updateEventStatus(data);
      setAllEvents((prev) => [...prev, updatedEvent]);
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const response = await fetch(`${main_api}/events/${eventId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete event");
      }
      setAllEvents((prev) => prev.filter((event) => event._id !== eventId));
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleCancelEvent = async (eventId: string) => {
    try {
      const response = await fetch(`${main_api}/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ status: Status.Cancelled }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to cancel event");
      }
      const updatedEvents = allEvents.map((event) =>
        event._id === eventId ? { ...event, status: Status.Cancelled } : event
      );
      setAllEvents(updatedEvents);
    } catch (error) {
      console.error("Error cancelling event:", error);
    }
  };

  const handleEditEvent = async (eventId: string, updatedEvent: any) => {
    try {
      const response = await fetch(`${main_api}/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(updatedEvent),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update event");
      }
      const updatedEvents = allEvents.map((event) =>
        event._id === eventId ? { ...event, ...data } : event
      );
      setAllEvents(updatedEvents);
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  return {
    allEvents,
    addNewEvent,
    handleDeleteEvent,
    handleCancelEvent,
    handleEditEvent,
  };
};

export default useEvents;
