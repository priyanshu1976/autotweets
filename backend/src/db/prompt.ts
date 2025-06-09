import { geminiAPI } from './utils'
async function generatePrompt(userInput: string) {
  const promptToGemini = `
You are an expert prompt engineer.

Take the following user description of tweet preferences:

"${userInput}"

Based on this, write a professional, clear prompt that instructs an AI to generate short, engaging tweets in JSON format.

Your output must include:
- What topics the tweets should cover
- Tone (funny, informative, sarcastic, etc.)
- Hashtag requirements (1–3 hashtags per tweet)
- JSON format requirements (see below)
- Any specific writing guidelines

All tweets must follow this JSON structure:

{
  "content": "Tweet text",
  "hashtags": ["#tag1", "#tag2"],
  "imageUrl": null,
  "scheduledAt": "2025-06-01T08:00:00Z",
  "postedAt": null,
  "isPosted": false,
  "createdAt": "2025-06-01T06:30:00Z"
}

Ensure your prompt includes:
- Character limit under 350
- Language tone/style based on user input
- Timestamp format (ISO 8601)
- Output must only be a valid prompt, no extra explanation.

Return ONLY the prompt.`

  const tweetPrompt = await geminiAPI(promptToGemini)
  // console.log(tweetPrompt)
  // console.log('now i want the json tweet about cricket')
  const tweet = await geminiAPI(tweetPrompt)
  // console.log(tweet)
  return tweet
}
export default generatePrompt
