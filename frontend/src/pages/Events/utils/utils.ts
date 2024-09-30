import { EvenType } from "../types/EventTypes";

export function sortByDate(eventList: EvenType[]): EvenType[] {
  return eventList.sort((a, b) => {
    const dateA = new Date(a.eventDate);
    const dateB = new Date(b.eventDate);

    return dateA.getTime() - dateB.getTime();
  });
}

export function devideEventsByMonth(eventList: EvenType[]) {
  const devideEventsByMonth = {
    thsMonth: [] as EvenType[],
    nextMonth: [] as EvenType[],
  };

  const currentDate = new Date();

  eventList.forEach((event) => {
    const eventDate = new Date(event.eventDate);

    if (
      eventDate.getMonth() === currentDate.getMonth() &&
      eventDate.getFullYear() === currentDate.getFullYear()
    ) {
      devideEventsByMonth.thsMonth.push(event);
    } else {
      devideEventsByMonth.nextMonth.push(event);
    }
  });

  return devideEventsByMonth;
}


