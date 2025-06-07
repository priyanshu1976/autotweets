import { PrismaClient } from '@prisma/client'
import { twitterClient } from '../db/utils'
import { Request, Response } from 'express'

export const scheduleTweets = async (req: Request, res: Response) => {
  const prisma = new PrismaClient()
  try {
    const tweets = await prisma.tweet.findMany({
      orderBy: {
        createdAt: 'asc', // Changed from scheduledAt to createdAt
      },
    })
    return res.status(200).json(tweets)
  } catch (error) {
    console.error('Error fetching scheduled tweets:', error)
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
      posted: false, // Changed from isPosted to posted
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
        data: { posted: true }, // Changed from isPosted to posted
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
        error: e instanceof Error ? e.message : 'Unknown error',
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
        posted: true, // Changed from isPosted to posted
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

export const setPrompt = async (req: Request, res: Response) => {
  const prisma = new PrismaClient()
  const userId = (req as any).user.id
  const { prompt } = req.body

  try {
    if (!prompt || prompt.trim() === '') {
      return res.status(400).json({ message: 'Prompt is required' })
    }

    const newPrompt = await prisma.prompt.create({
      data: {
        text: prompt,
        userId: userId,
      },
    })

    return res.status(201).json({
      message: 'Prompt saved successfully',
      prompt: newPrompt,
    })
  } catch (error: unknown) {
    console.error(
      'Error in setPrompt:',
      error instanceof Error ? error.message : 'Unknown error'
    )
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
