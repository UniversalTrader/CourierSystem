import mongoose from "mongoose";
import app from "./app.js";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io"; // Socket.IO import karna
import { deleteOldOrders } from "./utils/cronjob.js";
dotenv.config({ path: "./config.env" });

const DB = process.env.DB_URL;
mongoose
  .connect(DB)
  .then(() => console.log("Database connected"))
  .catch((err) => console.log(err));

// HTTP server create karna
const server = http.createServer(app);

// Socket.IO server ka setup
const io = new Server(server, {
  cors: {
    origin: "*", // Set your admin panel's domain here
  }
});

// Socket.IO connection handle karna
io.on("connection", (socket) => {
  console.log("New client connected: " + socket.id);

  // Disconnect event
  socket.on("disconnect", () => {
    console.log("Client disconnected: " + socket.id);
  });
});

// Server ko listen karna
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { io }; // Socket.IO ko export karna taake controllers me use ho sake