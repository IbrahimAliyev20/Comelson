import { queryOptions } from "@tanstack/react-query";
import { getBlog, getBlogCategories, getBlogs } from "./api";


const getBlogCategoriesQuery = (locale: string) => {
    return queryOptions({
        queryKey: ["blog-categories", locale],
        queryFn: () => getBlogCategories(locale),
    });
}

const getBlogsQuery = (locale: string, category_id: number | null, search: string) => {
    return queryOptions({
        queryKey: ["blogs", locale, category_id, search],
        queryFn: () => getBlogs(locale, category_id, search),
    });
}

const getBlogQuery = (locale: string, slug: string) => {
    return queryOptions({
        queryKey: ["blog", locale, slug],
        queryFn: () => getBlog(locale, slug),
    });
}
export { getBlogCategoriesQuery, getBlogsQuery, getBlogQuery };
