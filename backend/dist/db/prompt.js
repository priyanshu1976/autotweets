"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
function generatePrompt(userInput) {
    return __awaiter(this, void 0, void 0, function* () {
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

Return ONLY the prompt.`;
        const tweetPrompt = yield (0, utils_1.geminiAPI)(promptToGemini);
        // console.log(tweetPrompt)
        // console.log('now i want the json tweet about cricket')
        const tweet = yield (0, utils_1.geminiAPI)(tweetPrompt);
        // console.log(tweet)
        return tweet;
    });
}
exports.default = generatePrompt;
