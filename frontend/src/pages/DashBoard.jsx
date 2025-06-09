import Sidebar from '../components/Sidebar'
import StatCard from '../components/StatCard'
import TweetCard from '../components/TweetCard'
import Switch from '../components/Switch'
import Button from '../components/Button'
import { axiosInstance } from '../lib/axios'
import { useState, useEffect } from 'react'
import {
  Clock,
  MessageSquare,
  CheckCircle,
  Zap,
  BarChart2,
  Edit,
  Loader2,
} from 'lucide-react'

const getTimeAgo = (date) => {
  const now = new Date()
  const diffMs = now - date
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))

  if (diffHrs < 24) {
    return `${diffHrs} hours ago`
  } else {
    const diffDays = Math.floor(diffHrs / 24)
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  }
}

const getNextTweetTime = () => {
  const now = new Date()
  const nextTweet = new Date()
  nextTweet.setHours(14, 0, 0, 0) // Set to 2 PM

  if (now > nextTweet) {
    nextTweet.setDate(nextTweet.getDate() + 1)
  }

  return {
    time: nextTweet.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
    hoursUntil: Math.floor((nextTweet - now) / (1000 * 60 * 60)),
  }
}

const recentActivity = [
  {
    text: 'Tweet posted successfully',
    time: getTimeAgo(new Date(Date.now() - 2 * 60 * 60 * 1000)),
    color: 'bg-green-500',
  },
  {
    text: 'New tweets generated',
    time: getTimeAgo(new Date(Date.now() - 4 * 60 * 60 * 1000)),
    color: 'bg-green-500',
  },
  {
    text: 'Schedule updated',
    time: getTimeAgo(new Date(Date.now() - 24 * 60 * 60 * 1000)),
    color: 'bg-purple-500',
  },
]

export default function Dashboard() {
  const [tweets, setTweets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const response = await axiosInstance.get('/tweets/getScheduleTweets')
        setTweets(response.data)
      } catch (error) {
        console.error('Error fetching tweets:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTweets()
  }, [])

  const nextTweetInfo = getNextTweetTime()

  return (
    <div className="flex min-h-screen bg-slate-950">
      <div className="flex-1 text-white">
        {/* Header */}
        <div className="border-b border-slate-800 p-6">
          <h1 className="text-3xl font-bold text-teal-400">Dashboard</h1>
          <p className="text-slate-400 mt-1">
            Monitor your automated tweet schedule and performance
          </p>
        </div>

        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Next Tweet"
              value={nextTweetInfo.time}
              subtitle={`In ${nextTweetInfo.hoursUntil} hours`}
              icon={<Clock className="w-5 h-5" />}
              iconColor="text-purple-400"
            />
            <StatCard
              title="Tweets Left"
              value={tweets.length}
              subtitle="Today"
              icon={<MessageSquare className="w-5 h-5" />}
              iconColor="text-purple-400"
            />
            {/* <StatCard
              title="Total Posted"
              value="127"
              subtitle="This month"
              icon={<CheckCircle className="w-5 h-5" />}
              iconColor="text-green-400"
            /> */}
            <StatCard
              title="Status"
              value="Active"
              subtitle="Auto-posting enabled"
              icon={<Zap className="w-5 h-5" />}
              iconColor="text-teal-400"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upcoming Tweets */}
            <div className="lg:col-span-2">
              <div className="bg-slate-900 border border-slate-800 rounded-lg">
                <div className="p-6 border-b border-slate-800">
                  <h2 className="text-xl font-semibold text-white">
                    Upcoming Tweets
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  {loading ? (
                    <div className="flex justify-center items-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
                    </div>
                  ) : tweets.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      No tweets scheduled
                    </div>
                  ) : (
                    tweets.map((tweet) => (
                      <TweetCard
                        key={tweet.id}
                        tweet={{
                          id: tweet.id,
                          user: '@sleeptweeter',
                          time: new Date(tweet.createdAt).toLocaleTimeString(),
                          content: tweet.content,
                          category: 'Scheduled',
                        }}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              {/* <div className="bg-slate-900 border border-slate-800 rounded-lg">
                <div className="p-6 border-b border-slate-800">
                  <h3 className="text-lg font-semibold text-white">
                    Quick Actions
                  </h3>
                </div>
                <div className="p-6 space-y-3">
                  <Button className="w-full">Generate New Tweets</Button>
                  <Button variant="outline" className="w-full">
                    <BarChart2 className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Schedule
                  </Button>
                </div>
              </div> */}

              {/* Recent Activity */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg">
                <div className="p-6 border-b border-slate-800">
                  <h3 className="text-lg font-semibold text-white">
                    Recent Activity
                  </h3>
                </div>
                <div className="p-6 space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${activity.color}`}
                      />
                      <div className="flex-1">
                        <p className="text-sm text-slate-300">
                          {activity.text}
                        </p>
                        <p className="text-xs text-slate-500">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
