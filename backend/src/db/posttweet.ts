import { TwitterApi } from 'twitter-api-v2'
import { PrismaClient } from '@prisma/client'
import { decrypt } from '../lib/utils'

export const postTweet = async (
  text: string,
  {
    appkey,
    appSecret,
    accessToken,
    accessSecret,
  }: {
    appkey: string
    appSecret: string
    accessToken: string
    accessSecret: string
  }
) => {
  const client = new TwitterApi({
    appKey: appkey,
    appSecret: appSecret,
    accessToken: accessToken,
    accessSecret: accessSecret,
  })
  const twitterClient = client.readWrite

  try {
    const result = await twitterClient.v2.tweet(text)
    console.log('✅ Tweet posted:', result.data.id)
    return result.data
  } catch (error) {
    console.error('❌ Error posting tweet:', error)
    throw error
  }
}

async function postAllTweets() {
  const prisma = new PrismaClient()

  try {
    // Get all unposted tweets
    const tweets = await prisma.tweet.findMany({
      where: {
        posted: false,
      },
    })

    console.log(tweets)

    for (const tweet of tweets) {
      try {
        const accessKey = await prisma.accessKey.findUnique({
          where: {
            userId: tweet.userId,
          },
        })

        const permission = await prisma.setting.findFirst({
          where: {
            userId: tweet.userId,
          },
        })

        if (!permission?.approved) {
          console.log('doesnot have post permission')
          continue
        }

        if (!accessKey) {
          console.error(`No access keys found for user ${tweet.userId}`)
          continue
        }

        // Decrypt the API keys before using them
        const decryptedApiKey = decrypt(accessKey.twitterApiKey)
        const decryptedApiSecret = decrypt(accessKey.twitterApiSecret)
        const decryptedAccessToken = decrypt(accessKey.twitterAccessToken)
        const decryptedAccessSecret = decrypt(accessKey.twitterAccessSecret)

        await postTweet(tweet.content, {
          appkey: decryptedApiKey,
          appSecret: decryptedApiSecret,
          accessToken: decryptedAccessToken,
          accessSecret: decryptedAccessSecret,
        })

        // Update tweet status after successful posting
        await prisma.tweet.update({
          where: { id: tweet.id },
          data: { posted: true },
        })

        console.log(`Successfully posted tweet ${tweet.id}`)
      } catch (error) {
        console.error(`Failed to post tweet ${tweet.id}:`, error)
      }
    }
  } catch (error) {
    console.error('Error in postAllTweets:', error)
  } finally {
    await prisma.$disconnect()
  }
}
export default postAllTweets
