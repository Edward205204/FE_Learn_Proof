import { redirect } from 'next/navigation'
import { PATH } from '@/constants/path'

export default function AdminIndexPage() {
  redirect(PATH.ADMIN_DASHBOARD)
}
