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
exports.fetchUserSettings = exports.updateSettings = void 0;
const client_1 = require("@prisma/client");
const client = new client_1.PrismaClient();
const updateSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { emailNotifications, requireApproval } = req.body;
        const userId = req.user.id;
        // Update the user's settings in the database
        const updatedTweets = yield client.setting.updateMany({
            where: { userId },
            data: {
                email: emailNotifications,
                approved: requireApproval,
            },
        });
        res.status(200).json({
            success: true,
            message: 'Settings updated successfully',
            data: updatedTweets,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update settings',
            error: error.message,
        });
    }
});
exports.updateSettings = updateSettings;
const fetchUserSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        // Get the most recent tweet to fetch current settings
        const latestTweet = yield client.setting.findFirst({
            where: { userId },
            select: {
                email: true,
                approved: true,
            },
        });
        if (!latestTweet) {
            return res.status(404).json({
                success: false,
                message: 'No tweets found for user',
            });
        }
        res.status(200).json({
            success: true,
            emailNotifications: latestTweet.email,
            requireApproval: latestTweet.approved,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user settings',
            error: error.message,
        });
    }
});
exports.fetchUserSettings = fetchUserSettings;
