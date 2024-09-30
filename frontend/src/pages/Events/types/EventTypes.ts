import { SelectedLocationData } from "./MapLatLng";

export type EvenType = {
	_id: string;
	eventName: string;
	eventDescription?: string;
	eventDate: Date;
	eventEndDate?: Date;
	eventStartTime: string;
	eventEndTime?: string;
	location: SelectedLocationData;
	eventParticipants: EventParticipantsType[];
	images: string[];
};

export type EventParticipantsType = {
	_id: string;
	fullName: string;
	profilePhoto: string | undefined;
};

export type EventListItemProps = {
	title?: string;
	children: React.ReactNode;
	level?: 1 | 2 | 3 | 4 | 5;
};

export type EventCardProps = {
	event: EvenType;
	isAlone?: boolean;
};

export type EventMenuProps = {
	EventList?: EvenType[];
	title: string;
	onOpenModal: () => void;
	displayNoResult?: boolean;
	onUserJoinEvent: (eventId: string) => void;
	isSubmitting: boolean;
};
