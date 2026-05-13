import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import videoApi, { VideoUploadResponse } from '../_api/video.api'
import type { BaseErrorResponse } from '@/app/(learner)/_hooks/use-enrollment'

export function useUploadVideoMutation(opts?: { onUploaded?: (payload: VideoUploadResponse) => void }) {
  return useMutation({
    mutationFn: (file: File) => videoApi.uploadVideo(file).then((res) => res.data),
    onSuccess: (data) => {
      toast.success('Tải video lên Cloudflare thành công!')
      opts?.onUploaded?.(data)
    },
    onError: (error: AxiosError<BaseErrorResponse>) => {
      const data = error.response?.data
      let message = 'Tải video thất bại.'
      if (data?.message) {
        message = Array.isArray(data.message) ? data.message.map((e) => e.message).join(', ') : data.message
      }
      toast.error(message)
    }
  })
}
