import { queryOptions } from "@tanstack/react-query";
import { getSuccessStories, getSuccessStoriesBySlug } from "./api";


const getSuccessStoriesQuery = (locale: string) => {
    return queryOptions({
        queryKey: ["success-stories", locale],
        queryFn: () => getSuccessStories(locale),
    });
}

const getSuccessStoriesBySlugQuery = (slug: string) => {
    return queryOptions({
        queryKey: ["success-stories-by-slug", slug],
        queryFn: () => getSuccessStoriesBySlug(slug),
    });
}


export { getSuccessStoriesQuery, getSuccessStoriesBySlugQuery };