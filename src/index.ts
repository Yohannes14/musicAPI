import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import cors from 'cors';
import router from './routes/routes';
import { config } from './config/config';

const app = express();
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

app.use('/api', router);

const server = http.createServer(app);


async function connectToDatabase() {
    try {
        await mongoose.connect(config.dbURL);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}
// Call the connectToDatabase function
connectToDatabase();
// Define the port from the configuration
const port: number = config.port;

// Start the Express server
server.listen(port, () => {
    console.log(`Server ready on port ${port}`);
});
