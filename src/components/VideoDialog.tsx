'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { extractYouTubeID } from '@/lib/utils'

interface VideoDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  videoUrl: string | null
}

export function VideoDialog({
  isOpen,
  onOpenChange,
  videoUrl,
}: VideoDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Vídeo do Exercício</DialogTitle>
        </DialogHeader>
        {videoUrl && (
          <div className="aspect-video w-full">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${extractYouTubeID(videoUrl)}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
