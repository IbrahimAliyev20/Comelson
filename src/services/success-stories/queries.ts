import { queryOptions } from "@tanstack/react-query";
import { getSuccessStories, getSuccessStoriesBySlug } from "./api";


const getSuccessStoriesQuery = (locale: string) => {
    return queryOptions({
        queryKey: ["success-stories", locale],
        queryFn: () => getSuccessStories(locale),
    });
}

const getSuccessStoriesBySlugQuery = (slug: string, locale: string) => {
    return queryOptions({
        queryKey: ["success-stories-by-slug", slug, locale],
        queryFn: () => getSuccessStoriesBySlug(slug, locale),
    });
}


export { getSuccessStoriesQuery, getSuccessStoriesBySlugQuery };
