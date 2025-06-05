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
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const generateImage = (text) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.post('https://api.deepai.org/api/text2img', {
        text: text,
    }, {
        headers: {
            'Api-Key': 'd8255425-3bb7-473a-8b6a-46a4b78c9ae2',
        },
    });
    const imageUrl = response.data.output_url;
    const image = yield axios_1.default.get(imageUrl, { responseType: 'arraybuffer' });
    fs_1.default.writeFileSync('tweet-image.jpg', image.data);
    console.log('image created');
    return 'tweet-image.jpg';
});
exports.default = generateImage;
