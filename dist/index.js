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
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes/routes"));
const config_1 = require("./config/config");
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Enable CORS for all routes
app.use((0, cors_1.default)());
app.use('/api', routes_1.default);
const server = http_1.default.createServer(app);
function connectToDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(config_1.config.dbURL);
            console.log('Connected to MongoDB');
        }
        catch (error) {
            console.error('Error connecting to MongoDB:', error);
        }
    });
}
// Call the connectToDatabase function
connectToDatabase();
// Define the port from the configuration
const port = config_1.config.port;
// Start the Express server
server.listen(port, () => {
    console.log(`Server ready on port ${port}`);
});
