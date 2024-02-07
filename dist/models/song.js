"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SongModal = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const SongSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    album: { type: String, required: true },
    genre: { type: String, required: true },
});
exports.SongModal = mongoose_1.default.model('Song', SongSchema);
