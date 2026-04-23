'use server'

import { courseApi, SearchSuggestion } from '@/app/(public)/_api/course.api'

/**
 * Server Action xử lý tìm kiếm gợi ý khóa học.
 * Giúp tận dụng tối đa cơ sở hạ tầng phía server và hỗ trợ useTransition ở client.
 */
export async function getSearchSuggestionsAction(query: string) {
  if (!query || query.trim().length < 2) {
    return { success: true, data: [] }
  }

  try {
    const res = await courseApi.getSearchSuggestions(query)
    
    // Axios trả về dữ liệu trong field .data
    const suggestions = (res.data || []) as SearchSuggestion[]
    return { success: true, data: suggestions }
  } catch (error) {
    console.error('[SEARCH_ACTION_ERROR]', error)
    return { success: false, data: [], error: 'Không thể tải gợi ý tìm kiếm' }
  }
}
