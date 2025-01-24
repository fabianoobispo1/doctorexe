import { useQuery } from 'convex/react'

import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'

export function useStorageUrl(storageId: string | undefined) {
  const url = useQuery(
    api.files.getImageUrl,
    storageId ? { imageId: storageId as Id<'_storage'> } : 'skip',
  )
  return url
}
