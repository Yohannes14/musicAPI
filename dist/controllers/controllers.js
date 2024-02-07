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
exports.fetchStatistics = exports.deleteSong = exports.updateSong = exports.fetchSongById = exports.fetchSongs = exports.addSong = void 0;
const song_1 = require("../models/song");
const addSong = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check required fields are present 
        const { title, artist, album, genre } = req.body;
        if (!title) {
            return res.status(400).json({ error: 'Title required.' });
        }
        if (!artist) {
            return res.status(400).json({ error: 'Artist required.' });
        }
        if (!album) {
            return res.status(400).json({ error: 'Album required.' });
        }
        if (!genre) {
            return res.status(400).json({ error: 'Genre required.' });
        }
        const song = yield song_1.SongModal.create({ title, artist, album, genre });
        res.status(201).json({ data: song, message: 'Song created successfully' });
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.addSong = addSong;
///LIST SONGS
const fetchSongs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const songs = yield song_1.SongModal.find();
        res.json({ songs });
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.fetchSongs = fetchSongs;
///LIST SONGS BY ID
const fetchSongById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const song = yield song_1.SongModal.findById(id);
        if (!song) {
            return res.status(404).json({ error: 'Song not found' });
        }
        res.json({ song });
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.fetchSongById = fetchSongById;
///UPDATE SONG
const updateSong = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedSong = yield song_1.SongModal.findByIdAndUpdate(id, req.body);
        if (!updatedSong) {
            return res.status(404).json({ error: 'Song not found' });
        }
        res.json({ message: 'Song updated successfully' });
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.updateSong = updateSong;
//REMOVE SONGS
const deleteSong = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const removedSong = yield song_1.SongModal.findByIdAndDelete(id);
        if (!removedSong) {
            return res.status(404).json({ error: 'Song not found' });
        }
        res.status(201).json({ message: 'Song delete successfully' });
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.deleteSong = deleteSong;
/////GET OVERALL STATISTICS
const fetchStatistics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        ///Total # of songs, artists, albums, genres
        const totalSongs = yield song_1.SongModal.countDocuments();
        const totalArtists = yield song_1.SongModal.distinct('artist').countDocuments();
        const totalAlbums = yield song_1.SongModal.distinct('album').countDocuments();
        const totalGeneres = yield song_1.SongModal.distinct('genre').countDocuments();
        // # of songs in every genre
        const genresStatistics = yield song_1.SongModal.aggregate([{ $group: { _id: '$genre', count: { $sum: 1 } } }]);
        ///# of songs & albums each artist has
        const artistsStatistics = yield song_1.SongModal.aggregate([
            {
                $match: {
                    album: { $exists: true, $ne: '' } // Exclude documents where album is not present or is an empty string
                }
            },
            {
                $group: {
                    _id: '$artist',
                    songsCount: { $sum: 1 },
                    albumsCount: { $addToSet: '$album' }
                }
            },
            {
                $project: {
                    _id: 1,
                    songsCount: 1,
                    albumsCount: { $size: '$albumsCount' } // Count the number of unique albums
                }
            }
        ]);
        ////# songs in each album ... and so on.
        const albumsStatistics = yield song_1.SongModal.aggregate([
            { $group: { _id: '$album', count: { $sum: 1 } } }
        ]);
        res.json({ totalSongs, totalArtists, totalAlbums, totalGeneres, genresStatistics, artistsStatistics, albumsStatistics });
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.fetchStatistics = fetchStatistics;
