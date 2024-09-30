import "../../styles/ShowSlectedEvent.css";

import { EvenType } from "../../types/EventTypes";

import { Flex, Typography } from "antd";

import EventListItem from "./EventListItem";
import SelectedEventInformation from "./SelectedEventInformation";
import { PhotosAndMapCard } from "./PhotosAndMapCard";
import EmployeeList from "./EmployeeList";

// import { isHR } from "../../../../utils/utils";
import { t } from "i18next";

const ShowSelectedEvent = ({ selectedEvent }: { selectedEvent: EvenType }) => {
	// const isHr = isHR();
	return (
		<section className="show-event-container">
			<Typography.Title className="event-name-text">{selectedEvent.eventName}</Typography.Title>

			<PhotosAndMapCard selectedEvent={selectedEvent} />

			<Flex vertical gap={10}>
				<EventListItem>
					{selectedEvent.location.name && (
						<Typography.Paragraph>
							<strong>{t("locationName")}</strong> {selectedEvent.location.name}
						</Typography.Paragraph>
					)}
					<Typography.Paragraph>
						<strong>{t("locationAddress")}</strong> {selectedEvent.location.address}
					</Typography.Paragraph>
				</EventListItem>
				<SelectedEventInformation selectedEvent={selectedEvent} />
			</Flex>

			<EmployeeList participants={selectedEvent.eventParticipants} />
		</section>
	);
};

export default ShowSelectedEvent;
