"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controllers_1 = require("../controllers/controllers");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
///CREATE SONG
router.post('/songs', controllers_1.addSong);
///LIST ALL SONGS
router.get('/songs', controllers_1.fetchSongs);
///LIST SONGS BY ID
router.get('/songs/:id', controllers_1.fetchSongById);
//UPDATE SONG BY ID
router.put('/songs/:id', controllers_1.updateSong);
///REMOVE SONG FROM THE LIST
router.delete('/songs/:id', controllers_1.deleteSong);
// List OF STATISTICS
router.get('/statistics', controllers_1.fetchStatistics);
exports.default = router;
