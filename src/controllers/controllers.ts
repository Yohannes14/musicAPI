import { Request, Response } from "express";
import { SongModal } from "../models/song"

export const addSong = async (req: Request, res: Response) => {
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
        const song = await SongModal.create({ title, artist, album, genre });
        res.status(201).json({ data: song, message: 'Song created successfully' })

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });

    }

};

///LIST SONGS
export const fetchSongs = async (req: Request, res: Response) => {
    try {
        const songs = await SongModal.find();
        res.json({ songs })

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });

    }

};

///LIST SONGS BY ID
export const fetchSongById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const song = await SongModal.findById(id);
        if (!song) {
            return res.status(404).json({ error: 'Song not found' })
        }
        res.json({ song })

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });

    }

};
///UPDATE SONG
export const updateSong = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedSong = await SongModal.findByIdAndUpdate(id, req.body);
        if (!updatedSong) {
            return res.status(404).json({ error: 'Song not found' })
        }
        res.json({ message: 'Song updated successfully' });

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });

    }

};

//REMOVE SONGS
export const deleteSong = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const removedSong = await SongModal.findByIdAndDelete(id)
        if (!removedSong) {
            return res.status(404).json({ error: 'Song not found' });
        }
        res.status(201).json({ message: 'Song delete successfully' })

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });

    }

};

/////GET OVERALL STATISTICS

export const fetchStatistics = async (req: Request, res: Response) => {
    try {

        ///Total # of songs, artists, albums, genres
        const totalSongs = await SongModal.countDocuments();
        const totalArtists = await SongModal.distinct('artist').countDocuments();
        const totalAlbums = await SongModal.distinct('album').countDocuments();
        const totalGeneres = await SongModal.distinct('genre').countDocuments();

        // # of songs in every genre
        const genresStatistics = await SongModal.aggregate([{ $group: { _id: '$genre', count: { $sum: 1 } } }]);

        ///# of songs & albums each artist has
        const artistsStatistics = await SongModal.aggregate([
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
        const albumsStatistics = await SongModal.aggregate([
            { $group: { _id: '$album', count: { $sum: 1 } } }
        ]);
        res.json({ totalSongs, totalArtists, totalAlbums, totalGeneres, genresStatistics, artistsStatistics, albumsStatistics });

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });

    }
}
