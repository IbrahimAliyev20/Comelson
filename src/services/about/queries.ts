import { queryOptions } from "@tanstack/react-query";
import { getAbout } from "./api";


const getAboutQuery = (locale: string) => {
    return queryOptions({
        queryKey: ["about", locale],
        queryFn: () => getAbout(locale),
    });
}

export { getAboutQuery };