import ConvexStatus from '@/components/convex-status'
import { RoadmapContent } from '@/components/roadmap-content'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function roadmap() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 ">
      <ScrollArea className="h-[calc(100vh-40px)]  w-full pr-4">
        <h1 className="text-3xl font-bold my-6">Roadmap do Sistema</h1>
        <RoadmapContent />
        <ConvexStatus />
      </ScrollArea>
    </div>
  )
}
