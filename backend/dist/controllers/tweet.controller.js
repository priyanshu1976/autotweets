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
exports.setPrompt = exports.deletePostedTweets = exports.postScheduledTweets = exports.postTweet = exports.scheduleTweets = void 0;
const client_1 = require("@prisma/client");
const utils_1 = require("../db/utils");
const scheduleTweets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new client_1.PrismaClient();
    try {
        const tweets = yield prisma.tweet.findMany({
            orderBy: {
                createdAt: 'asc', // Changed from scheduledAt to createdAt
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
const postTweet = (text) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield utils_1.twitterClient.v2.tweet(text);
        console.log('✅ Tweet posted:', result.data.id);
        return result.data;
    }
    catch (error) {
        console.error('❌ Error posting tweet:', error);
        throw error;
    }
});
exports.postTweet = postTweet;
const postScheduledTweets = () => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new client_1.PrismaClient();
    // Find all tweets that are due to be posted
    const dueTweets = yield prisma.tweet.findMany({
        where: {
            posted: false, // Changed from isPosted to posted
        },
    });
    console.log('dueTweets', dueTweets);
    const results = [];
    // Process each due tweet
    for (const tweet of dueTweets) {
        try {
            // Post the tweet to Twitter
            const postedTweet = yield (0, exports.postTweet)(tweet.content);
            // Update tweet status in database
            yield prisma.tweet.update({
                where: { id: tweet.id },
                data: { posted: true }, // Changed from isPosted to posted
            });
            // Record successful posting
            results.push({
                id: tweet.id,
                status: 'success',
                tweetId: postedTweet.id,
            });
        }
        catch (e) {
            // Handle posting errors
            console.error(`Failed to post tweet ID: ${tweet.id}`);
            results.push({
                id: tweet.id,
                status: 'error',
                error: e instanceof Error ? e.message : 'Unknown error',
            });
        }
    }
    return {
        message: `Processed ${dueTweets.length} tweets`,
        results,
    };
});
exports.postScheduledTweets = postScheduledTweets;
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
        const newPrompt = yield prisma.prompt.create({
            data: {
                text: prompt,
                userId: userId,
            },
        });
        return res.status(201).json({
            message: 'Prompt saved successfully',
            prompt: newPrompt,
        });
    }
    catch (error) {
        console.error('Error in setPrompt:', error instanceof Error ? error.message : 'Unknown error');
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.setPrompt = setPrompt;
