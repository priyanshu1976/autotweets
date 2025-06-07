import type React from 'react'
import { Clock, CheckCircle, Edit3 } from 'lucide-react'

export interface TweetData {
  id: string
  content: string
  status: 'posted' | 'pending'
  timestamp: string
  scheduledTime?: string
}

interface TweetCardProps {
  tweet: TweetData
}

const TweetCard: React.FC<TweetCardProps> = ({ tweet }) => {
  //@ts-ignore
  const isPosted = tweet.isPosted === true

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      {/* Status Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isPosted ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-green-600 font-medium text-sm">Posted</span>
            </>
          ) : (
            <>
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="text-orange-600 font-medium text-sm">
                Pending
              </span>
            </>
          )}
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <Edit3 className="w-4 h-4" />
        </button>
      </div>

      {/* Tweet Content */}
      <div className="mb-4">
        <p className="text-gray-800 text-sm leading-relaxed">{tweet.content}</p>
      </div>

      {/* Timestamp */}
      <div className="text-xs text-gray-500">
        {isPosted ? (
          <span>Posted at {tweet.timestamp}</span>
        ) : (
          <span>Scheduled for {tweet.scheduledTime}</span>
        )}
      </div>
    </div>
  )
}

export default TweetCard
