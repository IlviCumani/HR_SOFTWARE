import EventCard from "./EventCard";
import ShowSelectedEvent from "./SelectedEvent/ShowSelectedEvent";
import Modal from "../../../components/Shared/Modal";
import NoDataResult from "./NoDataResult";
import { EventMenuProps, EvenType } from "../types/EventTypes";
import { Typography } from "antd";
import { useEffect, useState } from "react";
import { getFromLocalStorage } from "../../../utils/utils";
import { t } from "i18next";

const EventMenu = ({
	EventList = [],
	title,
	displayNoResult = false,
	onUserJoinEvent,
	isSubmitting,
}: EventMenuProps) => {
	const isOnlyOneEvent = EventList.length === 1;
	const [selectedEvent, setSelectedEvent] = useState<EvenType | undefined>(undefined);
	const [isJoined, setIsJoined] = useState(false);
	const employee = getFromLocalStorage("userData");

	function handleModalShow(event: EvenType | undefined) {
		setSelectedEvent(event);
	}

	useEffect(() => {
		if (selectedEvent) {
			const allIds = selectedEvent.eventParticipants.map((employee) => employee._id);
			const isJoined = allIds.includes(employee.employID);
			setIsJoined(isJoined);
		}
	}, [selectedEvent]);

	useEffect(() => {
		setSelectedEvent((prev) => EventList.find((event) => event._id === prev?._id));
	}, [EventList]);

	function handleJoinButtonClick() {
		onUserJoinEvent(selectedEvent!._id);
		setIsJoined(true);
	}

	return EventList.length === 0 ? (
		displayNoResult && <NoDataResult />
	) : (
		<section className="event-menu-container">
			<Modal
				title={t("eventDetails")}
				isOpen={!!selectedEvent}
				onCancel={() => handleModalShow(undefined)}
				onOk={!isJoined ? () => handleJoinButtonClick() : undefined}
				okBtnText={t("joinEvent")}
				okBtnTextSubmitting={t("joining")}
				isLoading={isSubmitting}
			>
				{selectedEvent && <ShowSelectedEvent selectedEvent={selectedEvent} />}
			</Modal>

			<Typography.Title type="secondary" level={4}>
				{title}
			</Typography.Title>
			<ul id="events">
				{EventList.map((event) => (
					<li key={event._id} onClick={() => handleModalShow(event)}>
						<EventCard event={event} isAlone={isOnlyOneEvent} />
					</li>
				))}
			</ul>
		</section>
	);
};

export default EventMenu;
