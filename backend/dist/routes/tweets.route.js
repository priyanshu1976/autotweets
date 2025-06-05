"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tweet_controller_1 = require("../controllers/tweet.controller");
const router = express_1.default.Router();
//@ts-ignore
router.post('/getScheduleTweets', tweet_controller_1.scheduleTweets);
//@ts-ignore
router.post('/postScheduledTweets', tweet_controller_1.postScheduledTweets);
exports.default = router;
