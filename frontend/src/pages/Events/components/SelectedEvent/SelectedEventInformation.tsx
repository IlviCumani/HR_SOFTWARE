import { Flex, Typography } from "antd";
import EventListItem from "./EventListItem";

import { EvenType } from "../../types/EventTypes";
import { useState } from "react";

import { t } from "i18next";

const dateOptions: Intl.DateTimeFormatOptions = {
	month: "short",
	day: "numeric",
};

export default function SelectedEventInformation({ selectedEvent }: { selectedEvent: EvenType }) {
	const [expanded, setExpanded] = useState(false);

	const dateStr = new Date(selectedEvent.eventDate).toLocaleDateString("en-GB", dateOptions);

	const dateEndStr = new Date(
		selectedEvent.eventEndDate || selectedEvent.eventDate,
	).toLocaleDateString("en-GB", dateOptions);

	const isOnlyOneDay = dateStr === dateEndStr;

	const displayedDate = dateStr + (isOnlyOneDay ? "" : ` - ${dateEndStr}`);
	const displayedTime =
		selectedEvent.eventStartTime + (!isOnlyOneDay ? "" : ` - ${selectedEvent.eventEndTime}`);

	return (
		<Flex justify="flex-start" align="flex-start" gap={30}>
			<div className="selected-event-list-container">
				<ul className="selected-event-list">
					<EventListItem title={t("date")} level={4}>
						{displayedDate}
					</EventListItem>
					<EventListItem title={t("time")} level={4}>
						{displayedTime}
					</EventListItem>
				</ul>
			</div>
			{selectedEvent.eventDescription && (
				<div className="selected-event-description-container">
					<Typography.Paragraph
						ellipsis={{
							rows: 5,
							expandable: "collapsible",
							expanded: expanded,
							symbol: expanded ? "Show less" : "Show more",
							onExpand: (_, info) => setExpanded(info.expanded),
						}}
					>
						{selectedEvent.eventDescription}
					</Typography.Paragraph>
				</div>
			)}
		</Flex>
	);
}
