import { Category } from 'src/types/category.types'
import { SuccessResponseApi } from 'src/types/utils.types'
import http from 'src/utils/http'

const URL = 'categories'

const categoryApi = {
  getCategories() {
    return http.get<SuccessResponseApi<Category[]>>(URL)
  }
}

export default categoryApi
