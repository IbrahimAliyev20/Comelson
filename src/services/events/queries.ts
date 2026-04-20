import { queryOptions } from "@tanstack/react-query";
import { getEventCategories, getEvents, getEvent } from "./api";


const getEventCategoriesQuery = (locale: string) => {
    return queryOptions({
        queryKey: ["event-categories", locale],
        queryFn: () => getEventCategories(locale),
    });
}

const getEventsQuery = (locale: string) => {
    return queryOptions({
        queryKey: ["events", locale],
        queryFn: () => getEvents(locale),
    });
}


const getEventQuery = (locale: string, slug: string) => {
    return queryOptions({
        queryKey: ["event", locale, slug],
        queryFn: () => getEvent(locale, slug),
    });
}
export { getEventCategoriesQuery, getEventsQuery, getEventQuery };