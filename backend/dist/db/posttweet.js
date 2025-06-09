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
exports.postTweet = void 0;
const twitter_api_v2_1 = require("twitter-api-v2");
const client_1 = require("@prisma/client");
const postTweet = (text_1, _a) => __awaiter(void 0, [text_1, _a], void 0, function* (text, { appkey, appSecret, accessToken, accessSecret, }) {
    const client = new twitter_api_v2_1.TwitterApi({
        appKey: appkey,
        appSecret: appSecret,
        accessToken: accessToken,
        accessSecret: accessSecret,
    });
    const twitterClient = client.readWrite;
    try {
        const result = yield twitterClient.v2.tweet(text);
        console.log('✅ Tweet posted:', result.data.id);
        return result.data;
    }
    catch (error) {
        console.error('❌ Error posting tweet:', error);
        throw error;
    }
});
exports.postTweet = postTweet;
function postAllTweets() {
    return __awaiter(this, void 0, void 0, function* () {
        const prisma = new client_1.PrismaClient();
        try {
            // Get all unposted tweets
            const tweets = yield prisma.tweet.findMany({
                where: {
                    posted: false,
                },
            });
            console.log(tweets);
            for (const tweet of tweets) {
                try {
                    const accessKey = yield prisma.accessKey.findUnique({
                        where: {
                            userId: tweet.userId,
                        },
                    });
                    const permission = yield prisma.setting.findFirst({
                        where: {
                            userId: tweet.userId,
                        },
                    });
                    if (!(permission === null || permission === void 0 ? void 0 : permission.approved)) {
                        console.log('doesnot have post permission');
                        continue;
                    }
                    if (!accessKey) {
                        console.error(`No access keys found for user ${tweet.userId}`);
                        continue;
                    }
                    yield (0, exports.postTweet)(tweet.content, {
                        appkey: accessKey.twitterApiKey,
                        appSecret: accessKey.twitterApiSecret,
                        accessToken: accessKey.twitterAccessToken,
                        accessSecret: accessKey.twitterAccessSecret,
                    });
                    // Update tweet status after successful posting
                    yield prisma.tweet.update({
                        where: { id: tweet.id },
                        data: { posted: true },
                    });
                    console.log(`Successfully posted tweet ${tweet.id}`);
                }
                catch (error) {
                    console.error(`Failed to post tweet ${tweet.id}:`, error);
                }
            }
        }
        catch (error) {
            console.error('Error in postAllTweets:', error);
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
exports.default = postAllTweets;
