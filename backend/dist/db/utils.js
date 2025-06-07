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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.twitterClient = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const prompt_1 = __importDefault(require("./prompt"));
const client_1 = require("@prisma/client");
const twitter_api_v2_1 = require("twitter-api-v2");
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const openaiKey = process.env.OPENAI_API_KEY;
const geminiKey = process.env.GEMINI_API_KEY;
function extractJsonFromMarkdown(raw) {
    const match = raw.match(/```json\s*([\s\S]*?)\s*```/i);
    if (match && match[1]) {
        return match[1].trim();
    }
    throw new Error('Invalid JSON returned from Gemini');
}
function generateDevTweets(count, timeOfDay) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const prompt = (0, prompt_1.default)(count, timeOfDay);
        try {
            const response = yield axios_1.default.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`, {
                contents: [
                    {
                        parts: [
                            {
                                text: prompt,
                            },
                        ],
                    },
                ],
            });
            const rawText = response.data.candidates[0].content.parts[0].text;
            const jsonText = extractJsonFromMarkdown(rawText);
            const tweets = JSON.parse(jsonText);
            // Loop and save to DB
            for (const tweet of tweets) {
                yield prisma.tweet.create({
                    data: {
                        content: tweet.content,
                        //@ts-ignore
                        hashtags: tweet.hashtags,
                        imageUrl: tweet.imageUrl,
                        scheduledAt: new Date(tweet.scheduledAt),
                        postedAt: tweet.postedAt ? new Date(tweet.postedAt) : null,
                        isPosted: tweet.isPosted,
                        createdAt: new Date(tweet.createdAt),
                    },
                });
            }
            console.log(`${tweets.length} tweets saved to DB successfully.`);
        }
        catch (error) {
            console.error('Failed to generate or save tweets:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
// src/utils/twitter.ts
dotenv_1.default.config();
const client = new twitter_api_v2_1.TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
});
// Authenticated client
exports.twitterClient = client.readWrite;
exports.default = generateDevTweets;
