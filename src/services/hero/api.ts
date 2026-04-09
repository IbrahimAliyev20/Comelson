import { ApiResponse, BreadcrumbResponse } from "@/types/types"
import { get } from "@/lib/api"

const getBreadcrumbs = async (locale: string) => {
  const response = await get<ApiResponse<BreadcrumbResponse[]>>('/breadcrumbs', {
    params: { locale }
  })
  return response
}
export { getBreadcrumbs }