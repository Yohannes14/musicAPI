
import { addSong, fetchSongs, fetchSongById, updateSong, deleteSong, fetchStatistics } from "../controllers/controllers";
import express from "express";

const router = express.Router();

///CREATE SONG
router.post('/songs', addSong);

///LIST ALL SONGS
router.get('/songs', fetchSongs);

///LIST SONGS BY ID
router.get('/songs/:id', fetchSongById);

//UPDATE SONG BY ID
router.put('/songs/:id', updateSong);

///REMOVE SONG FROM THE LIST

router.delete('/songs/:id', deleteSong);

// List OF STATISTICS
router.get('/statistics', fetchStatistics)

export default router;