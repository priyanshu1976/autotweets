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
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const posttweet_1 = __importDefault(require("./db/posttweet"));
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
if (process.env.NODE_ENV === 'production') {
    app.use(express_1.default.static(path_1.default.join(__dirname, '../frontend/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path_1.default.join(__dirname, '../frontend', 'dist', 'index.html'));
    });
}
// todo schedule cron to create tweet in 10am in the morning
node_cron_1.default.schedule('0 10 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Running scheduled tweet generation at 10 AM');
    yield (0, utils_1.default)();
}));
// todo post cron to create tweet in 5pm in the morning
node_cron_1.default.schedule('0 17 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('posting scheduled tweet generation at 5 pm');
    yield (0, posttweet_1.default)();
}));
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
