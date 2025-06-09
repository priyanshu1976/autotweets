"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tweet_controller_1 = require("../controllers/tweet.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
//@ts-ignore
router.get('/getScheduleTweets', auth_middleware_1.protectRoute, tweet_controller_1.scheduleTweets);
//@ts-ignore
router.post('/setprompt', auth_middleware_1.protectRoute, tweet_controller_1.setPrompt);
//@ts-ignore
router.get('/getprompt', auth_middleware_1.protectRoute, tweet_controller_1.getPrompt);
//@ts-ignore
router.post('/tokentwitter', auth_middleware_1.protectRoute, tweet_controller_1.setToken);
exports.default = router;
