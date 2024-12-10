require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

connectDB();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", (req, res, next) => {
    req.io = io;
    next();
}, taskRoutes);

io.on("connection", (socket) => {
    console.log("A user connected");
    socket.on("disconnect", () => console.log("A user disconnected"));
});

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));





