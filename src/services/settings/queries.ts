import { queryOptions } from "@tanstack/react-query";
import { getSettings } from "./api";


const getSettingsQuery = (locale: string) => {
    return queryOptions({
        queryKey: ["settings", locale],
        queryFn: () => getSettings(locale),
    });
}

export { getSettingsQuery };