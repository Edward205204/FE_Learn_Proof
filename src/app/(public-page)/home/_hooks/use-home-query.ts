import { useQuery } from '@tanstack/react-query'
import homeApi from '../_api/home.api'

// export function useHomeSectionsQuery() {
//   return useQuery({
//     queryKey: ['home-sections'],
//     queryFn: () => homeApi.getHomeSections().then((res) => res.data)
//   })
// }

export function useCategoriesQuery() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => homeApi.getCategories().then((res) => res.data)
  })
}
