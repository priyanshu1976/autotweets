import { useState, useEffect } from 'react'
import Card from '../components/Card'
import Switch from '../components/Switch'
import Select from '../components/Select'
import Button from '../components/Button'
import SettingItem from '../components/SettingItem'
import StatItem from '../components/StatItem'
import { axiosInstance } from '../lib/axios'
import { useSettingStore } from '../store/useSettingStore'

export default function Settings() {
  const { fetchSettings, settings } = useSettingStore()

  const [requireApproval, setRequireApproval] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(false)
  const [errorAlerts, setErrorAlerts] = useState(true)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  useEffect(() => {
    setEmailNotifications(settings?.emailNotifications)
    setRequireApproval(settings?.requireApproval)
  }, [settings])

  if (!settings) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6">
        <div className="mb-6">
          <div className="h-8 w-48 bg-slate-800 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-64 bg-slate-800 rounded animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 rounded-lg p-6">
              <div className="h-6 w-32 bg-slate-800 rounded animate-pulse mb-4"></div>
              <div className="space-y-4">
                <div className="h-16 bg-slate-800 rounded animate-pulse"></div>
                <div className="h-16 bg-slate-800 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-lg p-6">
              <div className="h-6 w-24 bg-slate-800 rounded animate-pulse mb-4"></div>
              <div className="h-24 bg-slate-800 rounded animate-pulse"></div>
            </div>
            <div className="bg-slate-900 rounded-lg p-6">
              <div className="h-6 w-24 bg-slate-800 rounded animate-pulse mb-4"></div>
              <div className="space-y-3">
                <div className="h-10 bg-slate-800 rounded animate-pulse"></div>
                <div className="h-10 bg-slate-800 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleSaveChanges = () => {
    setShowConfirmDialog(true)
  }

  const handleConfirmSave = async () => {
    try {
      setIsSaving(true)
      const updatedSettings = {
        requireApproval,
        emailNotifications,
        errorAlerts,
      }

      const response = await axiosInstance.post(
        '/profile/setting',
        updatedSettings
      )

      if (response.status === 200) {
        setShowConfirmDialog(false)
        fetchSettings()
      } else {
        throw new Error('Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-teal-400">Settings</h1>
        <p className="text-slate-400 mt-1">
          Configure your SleepTweeter preferences and posting behavior
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Posting Settings */}
          <Card title="Posting Settings">
            <SettingItem
              title="Require Approval Before Posting"
              description="When enabled, tweets will be saved as drafts for your review before posting"
            >
              <Switch
                checked={requireApproval}
                onChange={() => setRequireApproval((prev) => !prev)}
              />
            </SettingItem>
          </Card>

          {/* Notifications */}
          <Card title="Notifications">
            <SettingItem
              title="Email Notifications"
              description="Get notified when tweets are posted"
            >
              <Switch
                checked={emailNotifications}
                onChange={() => setEmailNotifications((prev) => !prev)}
              />
            </SettingItem>

            <SettingItem
              title="Error Alerts"
              description="Get alerted if posting fails"
            >
              <Switch checked={errorAlerts} onChange={setErrorAlerts} />
            </SettingItem>
          </Card>
        </div>

        {/* Sidebar - 1/3 width */}
        <div className="space-y-6">
          {/* Account */}
          <Card title="Account">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                ST
              </div>
              <div>
                <div className="font-medium">@sleeptweeter</div>
                <div className="text-sm text-slate-400">Premium Plan</div>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Manage Account
            </Button>
          </Card>

          {/* Quick Stats */}
          <Card title="Quick Stats">
            <StatItem
              label="Total Tweets"
              value="1,247"
              valueColor="text-teal-400"
            />
            <StatItem
              label="This Month"
              value="127"
              valueColor="text-purple-400"
            />
          </Card>

          {/* Danger Zone */}
          <Card title="Danger Zone" className="border-red-500">
            <div className="space-y-3">
              <Button
                variant="danger"
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                Reset All Settings
              </Button>
              <Button
                variant="danger"
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                Delete Account
              </Button>
            </div>
          </Card>

          {/* Save Changes */}
          <div className="space-y-3">
            <Button
              className="w-full py-3"
              onClick={handleSaveChanges}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>

            {showConfirmDialog && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-slate-900 p-6 rounded-lg max-w-md w-full">
                  <h3 className="text-xl font-semibold mb-4">
                    Confirm Changes
                  </h3>
                  <p className="text-slate-400 mb-6">
                    Are you sure you want to save these changes?
                  </p>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowConfirmDialog(false)}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleConfirmSave}
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Confirm'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
