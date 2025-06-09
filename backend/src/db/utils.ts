import axios from 'axios'
import dotenv from 'dotenv'
import generatePrompt from './prompt'
import { PrismaClient } from '@prisma/client'

dotenv.config()
const prisma = new PrismaClient()

const openaiKey = process.env.OPENAI_API_KEY
const geminiKey = process.env.GEMINI_API_KEY

export const geminiAPI = async (prompt: string) => {
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
    // console.log(rawText)

    return rawText
  } catch (error) {
    console.log('err in call gemni function')
  }
}

function extractJsonFromMarkdown(raw: string): string {
  const match = raw.match(/```json\s*([\s\S]*?)\s*```/i)
  if (match && match[1]) {
    return match[1].trim()
  }
  throw new Error('Invalid JSON returned from Gemini')
}

async function generateDevTweets() {
  try {
    const prompts = await prisma.prompt.findMany({
      select: {
        text: true,
        userId: true,
        id: true,
      },
    })
    if (!prompts.length) {
      throw new Error('No prompts found in database')
    }

    console.log(prompts)

    for (const prompt of prompts) {
      try {
        console.log('saving tweets for the promt : ', prompt.text)
        const rawText = await generatePrompt(prompt.text)
        const jsonText = extractJsonFromMarkdown(rawText)
        const tweets = JSON.parse(jsonText)

        console.log(tweets)

        // Save first 3 tweets to DB
        for (const tweet of tweets.slice(0, 3)) {
          await prisma.tweet.create({
            data: {
              content: tweet.content,
              promptId: prompt.id,
              userId: prompt.userId,
              posted: false,
              createdAt: new Date(),
            },
          })
        }
      } catch (error) {
        console.error(
          `Failed to process prompt for user ${prompt.userId}:`,
          error
        )
        continue
      }
    }

    console.log(`All the tweets saved to DB successfully.`)
  } catch (error: any) {
    console.error(
      'Failed to generate or save tweets:',
      error.response?.data || error.message
    )
  } finally {
    await prisma.$disconnect()
  }
}

export default generateDevTweets
