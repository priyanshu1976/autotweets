import { useState, useEffect } from 'react'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'

export default function TweetPreferences() {
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentPrompt, setCurrentPrompt] = useState('')
  const [isLoadingPrompt, setIsLoadingPrompt] = useState(true)
  const maxLength = 500

  useEffect(() => {
    const fetchCurrentPrompt = async () => {
      try {
        const response = await axiosInstance.get('tweets/getprompt')
        setCurrentPrompt(response.data.text || 'Prompt not set')
      } catch (error) {
        console.error('Error fetching prompt:', error)
        setCurrentPrompt('prompt not set')
      } finally {
        setIsLoadingPrompt(false)
      }
    }

    fetchCurrentPrompt()
  }, [])

  const handleSavePrompt = async () => {
    setIsLoading(true)
    try {
      const response = await axiosInstance.post('tweets/setprompt', {
        prompt: inputValue,
      })
      setCurrentPrompt(inputValue)
      toast.success('Prompt saved successfully')
    } catch (error) {
      console.error('Error saving prompt:', error)
      toast.error('Failed to save prompt')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-cyan-400 mb-2">
            Tweet Preferences
          </h1>
          <p className="text-gray-400">
            Describe your tweet style and let AI create content that matches
            your voice
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 border border-gray-700 rounded-lg h-[120px] flex flex-col">
              {/* Input Area */}
              <div className="p-4 border-t border-gray-700">
                <div className="flex gap-3">
                  <textarea
                    placeholder="Describe your tweet style..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 resize-none p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    rows={2}
                    maxLength={maxLength}
                    disabled={isLoading}
                  />
                </div>
                <div className="text-right text-xs text-gray-400 mt-1">
                  {inputValue.length}/{maxLength}
                </div>
              </div>
            </div>

            {/* Save Prompt Button */}
            <button
              onClick={handleSavePrompt}
              disabled={isLoading}
              className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-medium py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed relative"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </div>
              ) : (
                'Save Prompt'
              )}
            </button>
          </div>

          {/* Right Column - Info Panels */}
          <div className="space-y-6">
            {/* Current Prompt */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-white">
                  Current Prompt
                </h2>
              </div>
              <div className="p-4 space-y-4">
                {isLoadingPrompt ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-gray-300">{currentPrompt}</p>
                    <div className="text-xs text-gray-400">
                      Last updated:{' '}
                      <span className="text-cyan-400">Just now</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Example Prompts */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-white">
                  Example Prompts
                </h2>
              </div>
              <div className="p-4 space-y-3">
                <div className="text-sm text-gray-300 p-3 bg-gray-700 rounded-lg">
                  "Create motivational tweets about productivity and morning
                  routines"
                </div>
                <div className="text-sm text-gray-300 p-3 bg-gray-700 rounded-lg">
                  "Tweet facts about Web3 and Solana with technical insights"
                </div>
                <div className="text-sm text-gray-300 p-3 bg-gray-700 rounded-lg">
                  "Share funny observations about remote work life"
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-white">
                  Tips for Better Prompts
                </h2>
              </div>
              <div className="p-4">
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">•</span>
                    Be specific about tone and style
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">•</span>
                    Mention your target audience
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">•</span>
                    Include topics you want to cover
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">•</span>
                    Specify any hashtags or mentions
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
