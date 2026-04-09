import { queryOptions } from "@tanstack/react-query";
import { getFormLogo } from "./api";


const getFormLogoQuery = (locale: string) => {
    return queryOptions({
        queryKey: ["form-logo", locale],
        queryFn: () => getFormLogo(locale),
    });
}

export { getFormLogoQuery };
