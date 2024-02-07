import dotenv from 'dotenv';

dotenv.config();

export const config = {
    dbURL: process.env.MONGO_URL || '',
    port: parseInt(process.env.PORT || '3000'),
};