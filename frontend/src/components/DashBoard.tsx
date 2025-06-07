'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import TweetCard, { type TweetData } from './tweet-card'

const Dashboard: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'posted' | 'pending'
  >('all')

  const [tweets, setTweets] = useState<TweetData[]>([])

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const response = await fetch(
          'http://localhost:5001/api/tweets/getScheduleTweets',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        const data = await response.json()
        setTweets(data)
        console.log('data', data)
      } catch (error) {
        console.error('Error fetching tweets:', error)
      }
    }

    fetchTweets()
  }, [])

  const filteredTweets = tweets.filter((tweet) => {
    if (activeFilter === 'all') return true
    //@ts-ignore
    if (activeFilter === 'posted') return tweet.isPosted === true
    //@ts-ignore
    if (activeFilter === 'pending') return tweet.isPosted === false
    return true
  })

  const filterButtons = [
    { id: 'all' as const, label: 'All' },
    { id: 'posted' as const, label: 'Posted' },
    { id: 'pending' as const, label: 'Pending' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            {"Today's"} {tweets.length} Scheduled Tweets
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex gap-1">
            {filterButtons.map((button) => (
              <button
                key={button.id}
                onClick={() => setActiveFilter(button.id)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  activeFilter === button.id
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tweet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredTweets.map((tweet) => (
            <TweetCard key={tweet.id} tweet={tweet} />
          ))}
        </div>

        {/* Floating Action Button */}
        <button className="fixed bottom-6 right-6 w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group">
          <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  )
}

export default Dashboard
