import { queryOptions } from "@tanstack/react-query";
import { getPartnerships } from "./api";


const getPartnershipsQuery = (locale: string) => {
    return queryOptions({
        queryKey: ["partnerships", locale],
        queryFn: () => getPartnerships(locale),
    });
}

export { getPartnershipsQuery };
