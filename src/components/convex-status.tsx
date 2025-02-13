'use client'
import { useQuery } from 'convex/react'

import { api } from '../../convex/_generated/api'

export default function ConvexStatus() {
  // Query existing users to verify connection
  const users = useQuery(api.user.getAllUserRole)

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Convex Status</h2>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${users ? 'bg-green-500' : 'bg-red-500'}`}
          />
          <span>Connection Status: {users ? 'Connected' : 'Disconnected'}</span>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold mb-2">Available Tables:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>user</li>
            <li>recuperaSenha</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
