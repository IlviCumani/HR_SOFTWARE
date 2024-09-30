import EventMenu from "./components/EventMenu";
import Loader from "../../components/Shared/Loader";
import Modal from "../../components/Shared/Modal";
import NoDataResult from "./components/NoDataResult";
import TableHeader from "../../components/Table/TableHeader";
import "./styles/EventPage.css";
import { EvenType } from "./types/EventTypes";
import { sortByDate, devideEventsByMonth } from "./utils/utils";
import useHttp from "../../hooks/useHttp";
import { useState, useEffect, useRef } from "react";
import AddEventForm from "./components/AddEventForm";
import { useTranslation } from "react-i18next";
import { isHR, getFromLocalStorage } from "../../utils/utils";
import useAlert from "../../hooks/useAlert";

const EVENT_API = import.meta.env.REACT_APP_EVENTS_API;

const EventPage: React.FC = () => {
  const { t } = useTranslation();
  const user = getFromLocalStorage("userData");
  const isHr = isHR();
  const [isLoading, error, sendRequest] = useHttp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadedEvents, setLoadedEvents] = useState<EvenType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { contextHolder, handleAlert } = useAlert({
    displayDescription: error
      ? t("failedToAddEvent")
      : t("eventAddedSucesfuly"),
    displayTitle: error ? t("errorEvent") : t("successEvent"),
    type: error ? "error" : "success",
  });

  const formRef = useRef<any>();

  function handleOpenModal() {
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
  }

  function handleFileUpload(isUploading: boolean) {
    setIsUploading(isUploading);
  }

  function handleAddEvent(newEvent: EvenType) {
    setIsSubmitting(true);
    sendRequest(
      useHttp.postRequestHelper(EVENT_API, newEvent),
      (responseData: EvenType) => {
        setLoadedEvents((prevEvents) => {
          console.log("prevEvents", responseData);
          return [...prevEvents, responseData];
        });
        handleCloseModal();
        setIsSubmitting(false);
        handleAlert();
      }
    );
  }

  function handleUserJoinEvent(eventId: string) {
    setIsSubmitting(true);
    console.log("emp id", user.employID);
    console.log("event", eventId);
    sendRequest(
      useHttp.patchRequestHelper(`${EVENT_API}/assign/${eventId}`, {
        joinEmployee: user.employID,
      }),
      (response) => {
        setLoadedEvents((prevEvents) => {
          return prevEvents.map((event) => {
            if (event._id === eventId) {
              return {
                ...event,
                eventParticipants: [...response.eventParticipants],
              };
            }
            return event;
          });
        });
        setIsSubmitting(false);
      }
    );
  }

  useEffect(() => {
    sendRequest(
      {
        endpoint: EVENT_API,
      },
      (responseData: EvenType[]) => {
        setLoadedEvents(responseData);
      }
    );
  }, []);

  const { thsMonth, nextMonth } = devideEventsByMonth(loadedEvents);

  if (isLoading && !isSubmitting) {
    return <Loader />;
  }

  return (
    <main>
      {contextHolder}
      <Modal
        title={t("addEvent")}
        isOpen={isModalOpen}
        onCancel={handleCloseModal}
        onOk={() => {
          formRef.current.submit();
        }}
        width={650}
        isLoading={isLoading || isUploading}
        okBtnTextSubmitting={isUploading ? t("uploading") : t("submitting")}
      >
        <AddEventForm
          ref={formRef}
          onAdd={handleAddEvent}
          onUploadChange={handleFileUpload}
        />
      </Modal>
      <TableHeader
        title={t("eventTitle")}
        onClick={handleOpenModal}
        hideButton={!isHr}
      />
      {error ? (
        <NoDataResult isError />
      ) : (
        <>
          <EventMenu
            title={t("thisMonth")}
            EventList={sortByDate(thsMonth)}
            displayNoResult
            onOpenModal={handleOpenModal}
            onUserJoinEvent={handleUserJoinEvent}
            isSubmitting={isSubmitting}
          />
          <EventMenu
            title={t("upcoming")}
            EventList={sortByDate(nextMonth)}
            onOpenModal={handleOpenModal}
            onUserJoinEvent={handleUserJoinEvent}
            isSubmitting={isSubmitting}
          />
        </>
      )}
    </main>
  );
};

export default EventPage;
