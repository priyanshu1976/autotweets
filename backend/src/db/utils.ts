import axios from 'axios'
import dotenv from 'dotenv'
import generatePrompt from './prompt'
import { PrismaClient } from '@prisma/client'
import { TwitterApi } from 'twitter-api-v2'

dotenv.config()
const prisma = new PrismaClient()

const openaiKey = process.env.OPENAI_API_KEY
const geminiKey = process.env.GEMINI_API_KEY

function extractJsonFromMarkdown(raw: string): string {
  const match = raw.match(/```json\s*([\s\S]*?)\s*```/i)
  if (match && match[1]) {
    return match[1].trim()
  }
  throw new Error('Invalid JSON returned from Gemini')
}

async function generateDevTweets(count: number, timeOfDay: string) {
  const prompt = generatePrompt(count, timeOfDay)

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }
    )

    const rawText = response.data.candidates[0].content.parts[0].text
    const jsonText = extractJsonFromMarkdown(rawText)
    const tweets = JSON.parse(jsonText)

    // Loop and save to DB
    for (const tweet of tweets) {
      await prisma.tweet.create({
        data: {
          content: tweet.content,
          hashtags: tweet.hashtags,
          imageUrl: tweet.imageUrl,
          scheduledAt: new Date(tweet.scheduledAt),
          postedAt: tweet.postedAt ? new Date(tweet.postedAt) : null,
          isPosted: tweet.isPosted,
          createdAt: new Date(tweet.createdAt),
        },
      })
    }

    console.log(`${tweets.length} tweets saved to DB successfully.`)
  } catch (error: any) {
    console.error(
      'Failed to generate or save tweets:',
      error.response?.data || error.message
    )
  } finally {
    await prisma.$disconnect()
  }
}

// src/utils/twitter.ts

dotenv.config()

const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY!,
  appSecret: process.env.TWITTER_API_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessSecret: process.env.TWITTER_ACCESS_SECRET!,
})

// Authenticated client
export const twitterClient = client.readWrite

export default generateDevTweets
