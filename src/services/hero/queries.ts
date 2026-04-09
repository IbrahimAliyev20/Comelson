import { queryOptions } from "@tanstack/react-query";
import { getBreadcrumbs } from "./api";


const getBreadcrumbsQuery = (locale: string) => {
    return queryOptions({
        queryKey: ["breadcrumbs", locale],
        queryFn: () => getBreadcrumbs(locale),
    });
}

export { getBreadcrumbsQuery };