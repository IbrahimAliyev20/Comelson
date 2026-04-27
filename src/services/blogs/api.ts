import { get } from '@/lib/api'
import { ApiResponse, BlogCategoryResponse, BlogResponse } from '@/types/types'

const getBlogCategories = async (locale: string) => {
  const response = await get<ApiResponse<BlogCategoryResponse[]>>('/blog-categories', {
    params: { locale }
  })
  return response
}

const getBlogs = async (
  locale: string,
  category_id: number | null,
  search: string,
  sort?: 'asc' | 'desc'
) => {
  const response = await get<ApiResponse<BlogResponse[]>>('/blogs', {
    params: {
      locale,
      ...(category_id !== null ? { category_id } : {}),
      ...(search ? { search } : {}),
      ...(sort ? { sort } : {}),
    }
  })
  return response
}

const getBlog = async (locale: string, slug: string) => {
  const response = await get<BlogResponse>('/blog', {
    params: { locale, slug }
  })
  return response
}
export { getBlogCategories, getBlogs, getBlog }
