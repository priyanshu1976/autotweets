"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const tweets_route_1 = __importDefault(require("./routes/tweets.route"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const profile_route_1 = __importDefault(require("./routes/profile.route"));
const path_1 = __importDefault(require("path"));
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
app.use('/api/profile', profile_route_1.default);
// todo schedule cron to create tweet in 10am in the morning
// cron.schedule('0 10 * * *', async () => {
//   console.log('Running scheduled tweet generation at 10 AM')
//   await generateDevTweets()
// })
// todo post cron to create tweet in 5pm in the morning
// cron.schedule('0 17 * * *', async () => {
//   console.log('posting scheduled tweet generation at 5 pm')
//   await postAllTweets()
// })
if (process.env.NODE_ENV === 'production') {
    app.use(express_1.default.static(path_1.default.join(__dirname, '../frontend/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path_1.default.join(__dirname, '../frontend', 'dist', 'index.html'));
    });
}
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
