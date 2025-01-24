import { useState } from 'react'
import { useMutation } from 'convex/react'
import { Loader2 } from 'lucide-react'

import { api } from '@/convex/_generated/api'

import { Button } from './ui/button'

export const FileUpload = ({
  onUploadComplete,
}: {
  onUploadComplete: (storageId: string) => void
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      const uploadUrl = await generateUploadUrl()

      const result = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      })

      const { storageId } = await result.json()
      onUploadComplete(storageId)
    } catch (error) {
      console.error('Erro no upload:', error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Button variant="outline" asChild disabled={isUploading}>
      <label>
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleUpload}
          disabled={isUploading}
        />
        {isUploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Enviando...
          </>
        ) : (
          'Adicionar Foto'
        )}
      </label>
    </Button>
  )
}
