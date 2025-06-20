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
exports.getPrompt = exports.setToken = exports.setPrompt = exports.deletePostedTweets = exports.scheduleTweets = void 0;
const client_1 = require("@prisma/client");
const scheduleTweets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new client_1.PrismaClient();
    try {
        //@ts-ignore
        const userId = req.user.id; // Get userId from authenticated user
        const tweets = yield prisma.tweet.findMany({
            where: {
                userId: userId, // Filter tweets by userId
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
        return res.status(200).json(tweets);
    }
    catch (error) {
        console.error('Error fetching scheduled tweets:', error);
        res.status(500).json({ error: 'Failed to fetch scheduled tweets' });
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.scheduleTweets = scheduleTweets;
// export const postScheduledTweets = async () => {
//   const prisma = new PrismaClient()
//   // Find all tweets that are due to be posted
//   const dueTweets = await prisma.tweet.findMany({
//     where: {
//       posted: false, // Changed from isPosted to posted
//     },
//   })
//   console.log('dueTweets', dueTweets)
//   const results = []
//   // Process each due tweet
//   for (const tweet of dueTweets) {
//     try {
//       // Post the tweet to Twitter
//       const postedTweet = await postTweet(tweet.content)
//       // Update tweet status in database
//       await prisma.tweet.update({
//         where: { id: tweet.id },
//         data: { posted: true }, // Changed from isPosted to posted
//       })
//       // Record successful posting
//       results.push({
//         id: tweet.id,
//         status: 'success',
//         tweetId: postedTweet.id,
//       })
//     } catch (e) {
//       // Handle posting errors
//       console.error(`Failed to post tweet ID: ${tweet.id}`)
//       results.push({
//         id: tweet.id,
//         status: 'error',
//         error: e instanceof Error ? e.message : 'Unknown error',
//       })
//     }
//   }
//   return {
//     message: `Processed ${dueTweets.length} tweets`,
//     results,
//   }
// }
const deletePostedTweets = () => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new client_1.PrismaClient();
    try {
        // Delete all tweets that have been posted
        const deletedTweets = yield prisma.tweet.deleteMany({
            where: {
                posted: true, // Changed from isPosted to posted
            },
        });
        return {
            message: `Successfully deleted ${deletedTweets.count} posted tweets`,
            count: deletedTweets.count,
        };
    }
    catch (error) {
        console.error('Error deleting posted tweets:', error);
        throw error;
    }
});
exports.deletePostedTweets = deletePostedTweets;
const setPrompt = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new client_1.PrismaClient();
    const userId = req.user.id;
    const { prompt } = req.body;
    try {
        if (!prompt || prompt.trim() === '') {
            return res.status(400).json({ message: 'Prompt is required' });
        }
        // First find if a prompt exists for this user
        const existingPrompt = yield prisma.prompt.findFirst({
            where: {
                userId: userId,
            },
        });
        let updatedPrompt;
        if (existingPrompt) {
            // Update existing prompt
            updatedPrompt = yield prisma.prompt.update({
                where: {
                    id: existingPrompt.id,
                },
                data: {
                    text: prompt,
                },
            });
        }
        else {
            // Create new prompt
            updatedPrompt = yield prisma.prompt.create({
                data: {
                    text: prompt,
                    userId: userId,
                },
            });
        }
        return res.status(201).json({
            message: 'Prompt saved successfully',
            prompt: updatedPrompt,
        });
    }
    catch (error) {
        console.error('Error in setPrompt:', error instanceof Error ? error.message : 'Unknown error');
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.setPrompt = setPrompt;
const setToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new client_1.PrismaClient();
    const userId = req.user.id;
    const { apiKey, apiSecret, accessToken, accessTokenSecret } = req.body;
    try {
        if (!apiKey || !apiSecret || !accessToken || !accessTokenSecret) {
            return res
                .status(400)
                .json({ message: 'All Twitter credentials are required' });
        }
        const twitterCredentials = yield prisma.accessKey.upsert({
            where: { userId },
            update: {
                twitterApiKey: apiKey,
                twitterApiSecret: apiSecret,
                twitterAccessToken: accessToken,
                twitterAccessSecret: accessTokenSecret,
            },
            create: {
                userId,
                twitterApiKey: apiKey,
                twitterApiSecret: apiSecret,
                twitterAccessToken: accessToken,
                twitterAccessSecret: accessTokenSecret,
            },
        });
        return res.status(201).json({
            message: 'Twitter credentials saved successfully',
            credentials: Object.assign(Object.assign({}, twitterCredentials), { twitterApiKey: undefined, twitterApiSecret: undefined, twitterAccessToken: undefined, twitterAccessSecret: undefined }),
        });
    }
    catch (error) {
        console.error('Error in setToken:', error instanceof Error ? error.message : 'Unknown error');
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.setToken = setToken;
const getPrompt = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new client_1.PrismaClient();
    const userId = req.user.id;
    try {
        const userPrompt = yield prisma.prompt.findFirst({
            where: { userId },
            select: {
                text: true,
                createdAt: true,
            },
        });
        if (!userPrompt) {
            return res.status(404).json({ message: 'No prompt found for this user' });
        }
        return res.status(200).json(userPrompt);
    }
    catch (error) {
        console.error('Error in getPrompt:', error instanceof Error ? error.message : 'Unknown error');
        res.status(500).json({ message: 'Internal Server Error' });
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.getPrompt = getPrompt;
