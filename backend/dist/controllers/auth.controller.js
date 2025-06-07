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
exports.checkAuth = exports.logout = exports.login = exports.signup = void 0;
const client_1 = require("@prisma/client");
const utils_1 = require("../lib/utils");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (password.length < 6) {
            return res
                .status(400)
                .json({ message: 'Password must be at least 6 characters' });
        }
        const existingUser = yield prisma.user.findUnique({ where: { email } });
        if (existingUser)
            return res.status(400).json({ message: 'Email already exists' });
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = yield prisma.user.create({
            data: {
                name,
                email,
                Password: hashedPassword,
            },
        });
        (0, utils_1.generateToken)(newUser.id, res);
        return res.status(201).json({
            _id: newUser.id,
            name: newUser.name,
            email: newUser.email,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.log('Error in signup controller:', error.message);
        }
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield prisma.user.findUnique({ where: { email } });
        if (!user)
            return res.status(400).json({ message: 'Invalid credentials' });
        const isPasswordCorrect = yield bcryptjs_1.default.compare(password, user.Password);
        if (!isPasswordCorrect)
            return res.status(400).json({ message: 'Invalid credentials' });
        (0, utils_1.generateToken)(user.id, res);
        return res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.log('Error in login controller:', error.message);
        }
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.login = login;
const logout = (req, res) => {
    try {
        res.cookie('jwt', '', { maxAge: 0 });
        return res.status(200).json({ message: 'Logged out successfully' });
    }
    catch (error) {
        if (error instanceof Error) {
            console.log('Error in logout controller:', error.message);
        }
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.logout = logout;
const checkAuth = (req, res) => {
    try {
        //@ts-ignore
        return res.status(200).json(req.user);
    }
    catch (error) {
        if (error instanceof Error) {
            console.log('Error in checkAuth controller:', error.message);
        }
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.checkAuth = checkAuth;
