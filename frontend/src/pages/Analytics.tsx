'use client'

import type React from 'react'
import Sidebar from '../components/sideBar'
import ViralTweetCard, { type ViralTweetData } from '../components/viral-tweet'

interface AnalyticsLayoutProps {
  children: React.ReactNode
}

const AnalyticsLayout: React.FC<AnalyticsLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab="analytics" />
      <main className="flex-1">{children}</main>
    </div>
  )
}

const Analytics: React.FC = () => {
  // Sample viral tweet data
  const viralTweets: ViralTweetData[] = [
    {
      id: '1',
      content:
        '🚀 Just shipped a new feature that automates tweet scheduling! No more manual posting. The future is automated! #DevLife #Automation #ProductLaunch',
      postedDate: 'March 15, 2024 at 9:00 AM',
      likes: 2400,
      retweets: 856,
      views: 15200,
    },
    {
      id: '2',
      content:
        'Pro tip: Use environment variables for API keys. Never commit secrets to your repo! Security first, always. 🔐 #Security #DevTips #BestPractices',
      postedDate: 'March 14, 2024 at 11:30 AM',
      likes: 1800,
      retweets: 642,
      views: 12100,
    },
    {
      id: '3',
      content:
        'Building in public: Day 30 of creating the ultimate developer productivity suite. The journey has been incredible! #BuildInPublic #Startup #Developer',
      postedDate: 'March 13, 2024 at 2:00 PM',
      likes: 1500,
      retweets: 423,
      views: 9800,
    },
    {
      id: '4',
      content:
        "Code review best practices: Be kind, be specific, and always explain the 'why' behind your suggestions. Growth mindset! #CodeReview #TeamWork",
      postedDate: 'March 12, 2024 at 1:15 PM',
      likes: 1200,
      retweets: 387,
      views: 8400,
    },
    {
      id: '5',
      content:
        'Learning Rust has been a game-changer for my systems programming skills. The compiler is your best friend! 🦀 #RustLang #SystemsProgramming',
      postedDate: 'March 11, 2024 at 6:00 PM',
      likes: 987,
      retweets: 234,
      views: 6700,
    },
  ]

  return (
    <AnalyticsLayout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
          <p className="text-gray-600">Viral Tweet Analyzer</p>
        </div>

        {/* Top 5 Viral Tweets Section */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Top 5 Viral Tweets
          </h2>
          <div className="space-y-4">
            {viralTweets.map((tweet) => (
              <ViralTweetCard key={tweet.id} tweet={tweet} />
            ))}
          </div>
        </div>

        {/* Tweet Performance Chart Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Tweet Performance Over the Week
          </h2>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <p className="text-lg font-medium mb-2">
                  Weekly Engagement Trends
                </p>
                <p className="text-sm">Chart visualization coming soon...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnalyticsLayout>
  )
}

export default Analytics
