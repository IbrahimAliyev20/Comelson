import { queryOptions } from "@tanstack/react-query";
import { getStatistics } from "./api";


const getStatisticsQuery = (locale: string) => {
    return queryOptions({
        queryKey: ["statistics", locale],
        queryFn: () => getStatistics(locale),
    });
}

export { getStatisticsQuery };