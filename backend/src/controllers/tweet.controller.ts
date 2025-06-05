import { PrismaClient } from '@prisma/client'
import { twitterClient } from '../db/utils'

export const scheduleTweets = async (req: Request, res: Response) => {
  const prisma = new PrismaClient()
  try {
    const tweets = await prisma.tweet.findMany({
      orderBy: {
        scheduledAt: 'asc',
      },
    })
    //@ts-ignore
    return res.status(200).json(tweets)
  } catch (error) {
    console.error('Error fetching scheduled tweets:', error)
    //@ts-ignore
    res.status(500).json({ error: 'Failed to fetch scheduled tweets' })
  } finally {
    await prisma.$disconnect()
  }
}

export const postTweet = async (text: string) => {
  try {
    const result = await twitterClient.v2.tweet(text)
    console.log('✅ Tweet posted:', result.data.id)
    return result.data
  } catch (error) {
    console.error('❌ Error posting tweet:', error)
    throw error
  }
}

export const postScheduledTweets = async () => {
  const prisma = new PrismaClient()

  // Find all tweets that are due to be posted
  const dueTweets = await prisma.tweet.findMany({
    where: {
      isPosted: false,
      scheduledAt: { lte: new Date() }, // lte = less than or equal to current time
    },
  })

  console.log('dueTweets', dueTweets)
  const results = []

  // Process each due tweet
  for (const tweet of dueTweets) {
    try {
      // Post the tweet to Twitter
      const postedTweet = await postTweet(tweet.content)

      // Update tweet status in database
      await prisma.tweet.update({
        where: { id: tweet.id },
        data: { isPosted: true, postedAt: new Date() },
      })

      // Record successful posting
      results.push({
        id: tweet.id,
        status: 'success',
        tweetId: postedTweet.id,
      })
    } catch (e) {
      // Handle posting errors
      console.error(`Failed to post tweet ID: ${tweet.id}`)
      results.push({
        id: tweet.id,
        status: 'error',
        //@ts-ignore
        error: e.message,
      })
    }
  }

  return {
    message: `Processed ${dueTweets.length} tweets`,
    results,
  }
}

export const deletePostedTweets = async () => {
  const prisma = new PrismaClient()

  try {
    // Delete all tweets that have been posted
    const deletedTweets = await prisma.tweet.deleteMany({
      where: {
        isPosted: true,
      },
    })

    return {
      message: `Successfully deleted ${deletedTweets.count} posted tweets`,
      count: deletedTweets.count,
    }
  } catch (error) {
    console.error('Error deleting posted tweets:', error)
    throw error
  }
}
