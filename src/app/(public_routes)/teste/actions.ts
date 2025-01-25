'use server'

import { storageProvider } from '@/services/storage'

export async function submitFormAction(prevState: unknown, formData: FormData) {
  const file = formData.get('file') as File
  const url = await storageProvider.upload(file)

  return {
    url,
  }
}
