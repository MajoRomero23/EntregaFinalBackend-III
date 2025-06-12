import http from "http";
import app from "./app.js";
import { Server } from "socket.io";
import dotenv from "dotenv";
import connectDB from "./src/database.js";

dotenv.config();

const PORT = process.env.PORT || 8080;

const server = http.createServer(app);
const io = new Server(server);

connectDB();

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
