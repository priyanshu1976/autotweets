import type React from 'react'
import { Heart, Repeat2, Eye } from 'lucide-react'

export interface ViralTweetData {
  id: string
  content: string
  postedDate: string
  likes: number
  retweets: number
  views: number
}

interface ViralTweetCardProps {
  tweet: ViralTweetData
}

const ViralTweetCard: React.FC<ViralTweetCardProps> = ({ tweet }) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start gap-4">
        {/* Tweet Content */}
        <div className="flex-1">
          <p className="text-gray-800 text-sm leading-relaxed mb-3">
            {tweet.content}
          </p>
          <p className="text-gray-500 text-xs">Posted on {tweet.postedDate}</p>
        </div>

        {/* Engagement Metrics */}
        <div className="flex flex-col gap-3 items-end">
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span className="text-red-500 font-semibold text-sm">
              {formatNumber(tweet.likes)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Repeat2 className="w-4 h-4 text-green-500" />
            <span className="text-green-500 font-semibold text-sm">
              {formatNumber(tweet.retweets)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4 text-blue-500" />
            <span className="text-blue-500 font-semibold text-sm">
              {formatNumber(tweet.views)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViralTweetCard
