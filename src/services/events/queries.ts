import { queryOptions } from "@tanstack/react-query";
import { getEventCategories, getEvents, getEvent } from "./api";


const getEventCategoriesQuery = (locale: string) => {
    return queryOptions({
        queryKey: ["event-categories", locale],
        queryFn: () => getEventCategories(locale),
    });
}

const getEventsQuery = (locale: string, category_id: number) => {
    return queryOptions({
        queryKey: ["events", locale, category_id],
        queryFn: () => getEvents(locale, category_id),
    });
}


const getEventQuery = (locale: string, slug: string) => {
    return queryOptions({
        queryKey: ["event", locale, slug],
        queryFn: () => getEvent(locale, slug),
    });
}
export { getEventCategoriesQuery, getEventsQuery, getEventQuery };