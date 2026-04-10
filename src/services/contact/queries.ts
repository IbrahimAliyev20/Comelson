import { queryOptions } from "@tanstack/react-query";
import { getContact, getSocialMedia } from "./api";


const getContactQuery = (locale: string) => {
    return queryOptions({
        queryKey: ["contact", locale],
        queryFn: () => getContact(locale),
    });
}

const getSocialMediaQuery = (locale: string) => {
    return queryOptions({
        queryKey: ["social-media", locale],
        queryFn: () => getSocialMedia(locale),
    });
}

export { getContactQuery, getSocialMediaQuery };
