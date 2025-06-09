import { PrismaClient } from '@prisma/client'

const client = new PrismaClient()
export const updateSettings = async (req: any, res: any) => {
  try {
    const { emailNotifications, requireApproval } = req.body
    const userId = req.user.id

    // Update the user's settings in the database
    const updatedTweets = await client.setting.updateMany({
      where: { userId },
      data: {
        email: emailNotifications,
        approved: requireApproval,
      },
    })

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: updatedTweets,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update settings',
      error: error.message,
    })
  }
}
export const fetchUserSettings = async (req: any, res: any) => {
  try {
    const userId = req.user.id

    // Get the most recent tweet to fetch current settings
    const latestTweet = await client.setting.findFirst({
      where: { userId },
      select: {
        email: true,
        approved: true,
      },
    })

    if (!latestTweet) {
      return res.status(404).json({
        success: false,
        message: 'No tweets found for user',
      })
    }

    res.status(200).json({
      success: true,
      emailNotifications: latestTweet.email,
      requireApproval: latestTweet.approved,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user settings',
      error: error.message,
    })
  }
}
