"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
//@ts-ignore
router.post('/signup', auth_controller_1.signup);
//@ts-ignore
router.post('/login', auth_controller_1.login);
//@ts-ignore
router.post('/logout', auth_controller_1.logout);
//@ts-ignore
router.get('/check', auth_middleware_1.protectRoute, auth_controller_1.checkAuth);
exports.default = router;
