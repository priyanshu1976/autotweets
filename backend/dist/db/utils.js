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
exports.geminiAPI = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const prompt_1 = __importDefault(require("./prompt"));
const client_1 = require("@prisma/client");
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const openaiKey = process.env.OPENAI_API_KEY;
const geminiKey = process.env.GEMINI_API_KEY;
const geminiAPI = (prompt) => __awaiter(void 0, void 0, void 0, function* () {
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
        // console.log(rawText)
        return rawText;
    }
    catch (error) {
        console.log('err in call gemni function');
    }
});
exports.geminiAPI = geminiAPI;
function extractJsonFromMarkdown(raw) {
    const match = raw.match(/```json\s*([\s\S]*?)\s*```/i);
    if (match && match[1]) {
        return match[1].trim();
    }
    throw new Error('Invalid JSON returned from Gemini');
}
function generateDevTweets() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const prompts = yield prisma.prompt.findMany({
                select: {
                    text: true,
                    userId: true,
                    id: true,
                },
            });
            if (!prompts.length) {
                throw new Error('No prompts found in database');
            }
            console.log(prompts);
            for (const prompt of prompts) {
                try {
                    console.log('saving tweets for the promt : ', prompt.text);
                    const rawText = yield (0, prompt_1.default)(prompt.text);
                    const jsonText = extractJsonFromMarkdown(rawText);
                    const tweets = JSON.parse(jsonText);
                    console.log(tweets);
                    // Save first 3 tweets to DB
                    for (const tweet of tweets.slice(0, 3)) {
                        yield prisma.tweet.create({
                            data: {
                                content: tweet.content,
                                promptId: prompt.id,
                                userId: prompt.userId,
                                posted: false,
                                createdAt: new Date(),
                            },
                        });
                    }
                }
                catch (error) {
                    console.error(`Failed to process prompt for user ${prompt.userId}:`, error);
                    continue;
                }
            }
            console.log(`All the tweets saved to DB successfully.`);
        }
        catch (error) {
            console.error('Failed to generate or save tweets:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
exports.default = generateDevTweets;
