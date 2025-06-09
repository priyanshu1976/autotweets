'use client'

import { useState } from 'react'
import Input from '../components/Input'
import Button from '../components/Button'
import Card from '../components/Card'
import StepItem from '../components/StepItem'
import StatusIndicator from '../components/StatusIndicator'
import { Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import { axiosInstance } from '../lib/axios'

export default function TwitterAPISetup() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    apiKey: '',
    apiSecret: '',
    accessToken: '',
    accessTokenSecret: '',
  })

  const handleInputChange = (e, name) => {
    console.log(name, e.target.value)
    setFormData({
      ...formData,
      [name]: e.target.value,
    })
  }

  const handleSaveKeys = async () => {
    setIsLoading(true)
    try {
      console.log(formData)
      const response = await axiosInstance.post(
        '/tweets/tokentwitter',
        formData
      )
      console.log(response.data)
      if (response.data.message === 'Twitter credentials saved successfully') {
        toast.success('API keys saved successfully!')
      }
      console.log(formData)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save API keys')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-teal-400">Twitter API Setup</h1>
        <p className="text-slate-400 mt-1">
          Connect your Twitter account by providing your API credentials
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form - 2/3 width */}
        <div className="lg:col-span-2">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <div className="space-y-6">
              <Input
                label="Twitter API Key"
                name="apiKey"
                value={formData.apiKey}
                onChange={handleInputChange}
                placeholder="Enter your Twitter API Key"
                icon={<Eye size={18} />}
                isPassword={true}
              />

              <Input
                label="Twitter API Secret"
                name="apiSecret"
                value={formData.apiSecret}
                onChange={handleInputChange}
                placeholder="Enter your Twitter API Secret"
                isPassword={true}
                icon={<Eye size={18} />}
              />

              <Input
                label="Twitter Access Token"
                name="accessToken"
                value={formData.accessToken}
                onChange={handleInputChange}
                placeholder="Enter your Twitter Access Token"
                icon={<Eye size={18} />}
                isPassword={true}
              />

              <Input
                label="Twitter Access Token Secret"
                name="accessTokenSecret"
                value={formData.accessTokenSecret}
                onChange={handleInputChange}
                placeholder="Enter your Twitter Access Token Secret"
                isPassword={true}
                icon={<Eye size={18} />}
              />

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  onClick={handleSaveKeys}
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save API Keys'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - 1/3 width */}
        <div className="space-y-6">
          {/* Need API Keys */}
          <Card title="Need API Keys?">
            <p className="text-slate-400 text-sm mb-4">
              Follow our step-by-step guide to get your Twitter API credentials
            </p>
            <Button
              variant="guide"
              className="w-full"
              onClick={() =>
                window.open(
                  'https://developer.twitter.com/en/portal/dashboard',
                  '_blank'
                )
              }
            >
              📖 Get API Keys Guide
            </Button>
          </Card>

          {/* Security Notice */}
          <Card>
            <div className="flex items-start gap-3">
              <div className="text-yellow-500 text-xl">⚠️</div>
              <div>
                <h3 className="text-yellow-500 font-medium mb-2">
                  Security Notice
                </h3>
                <p className="text-slate-400 text-sm">
                  Your API keys are encrypted and stored securely. We never
                  share your credentials with third parties.
                </p>
              </div>
            </div>
          </Card>

          {/* Setup Steps */}
          <Card title="Setup Steps">
            <div className="space-y-3">
              <StepItem number="1" title="Create Twitter Developer Account" />
              <StepItem number="2" title="Create a new Twitter App" />
              <StepItem number="3" title="Generate API Keys & Tokens" />
              <StepItem number="4" title="Copy keys to this form" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
