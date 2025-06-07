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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const node_cron_1 = __importDefault(require("node-cron"));
const utils_1 = __importDefault(require("./db/utils"));
const tweets_route_1 = __importDefault(require("./routes/tweets.route"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const tweet_controller_1 = require("./controllers/tweet.controller");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/api/tweets', tweets_route_1.default);
app.use('/api/auth', auth_route_1.default);
node_cron_1.default.schedule('0 10 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('🕙 Generating morning tweets...');
    yield (0, utils_1.default)(5, 'morning');
    yield (0, tweet_controller_1.postScheduledTweets)();
    yield (0, tweet_controller_1.deletePostedTweets)();
}));
// generateDevTweets(2, 'morning')
//postScheduledTweets()
node_cron_1.default.schedule('0 13 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('🕐 Generating afternoon tweets...');
    yield (0, utils_1.default)(5, 'afternoon');
    yield (0, tweet_controller_1.postScheduledTweets)();
    yield (0, tweet_controller_1.deletePostedTweets)();
}));
node_cron_1.default.schedule('0 17 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('🕔 Generating evening tweets...');
    yield (0, utils_1.default)(5, 'evening');
    yield (0, tweet_controller_1.postScheduledTweets)();
    yield (0, tweet_controller_1.deletePostedTweets)();
}));
node_cron_1.default.schedule('0 18 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('🕗 Generating night tweets...');
    yield (0, utils_1.default)(2, 'night');
    yield (0, tweet_controller_1.postScheduledTweets)();
    yield (0, tweet_controller_1.deletePostedTweets)();
}));
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
