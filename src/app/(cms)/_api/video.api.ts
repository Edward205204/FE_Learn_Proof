import http from '@/utils/http'

export type VideoUploadResponse = {
  url: string
  key: string
}

function buildFormData(file: File): FormData {
  const form = new FormData()
  form.append('file', file)
  return form
}

const videoApi = {
  uploadVideo: (file: File) =>
    http.post<VideoUploadResponse>('/video/upload', buildFormData(file), {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
}

export default videoApi
