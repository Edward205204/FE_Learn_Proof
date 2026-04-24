'use server'

import { courseApi, SearchSuggestion } from '@/app/(public)/_api/course.api'
import { unstable_cache } from 'next/cache'

// Hàm fetch dữ liệu thực tế (sẽ được cache)
const fetchSuggestions = async (query: string) => {
  const res = await courseApi.getSearchSuggestions(query)
  return (res.data || []) as SearchSuggestion[]
}

// Tạo hàm cache (thời gian sống 1 giờ, tag: 'search-suggestions')
const getCachedSuggestions = unstable_cache(async (query: string) => fetchSuggestions(query), ['search-suggestions'], {
  revalidate: 3600,
  tags: ['search-suggestions']
})

/**
 * Server Action xử lý tìm kiếm gợi ý khóa học.
 * Giúp tận dụng tối đa cơ sở hạ tầng phía server và hỗ trợ useTransition ở client.
 */
export async function getSearchSuggestionsAction(query: string) {
  const trimmedQuery = query.trim().toLowerCase()

  if (!trimmedQuery || trimmedQuery.length < 2) {
    return { success: true, data: [] }
  }

  try {
    // Gọi hàm có cache
    const suggestions = await getCachedSuggestions(trimmedQuery)
    return { success: true, data: suggestions }
  } catch (error) {
    console.error('[SEARCH_ACTION_ERROR]', error)
    return { success: false, data: [], error: 'Không thể tải gợi ý tìm kiếm' }
  }
}
