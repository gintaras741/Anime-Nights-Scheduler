import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes";
import db from "./database";
import http from "http";
import path from "path";
import helmet from "helmet";
import { Server } from "socket.io";
import {
    toggleCosplayCrossedOut,
    toggleCosplayGlow,
    togglePrejudgeCrossedOut,
    togglePrejudgeGlow,
} from "./controllers/cosplayerController";
import { authenticateKey } from "./middleware/auth";

const corsOptions = {
    origin: ["http://localhost:3000", "http://localhost:5173"],
};

dotenv.config();

db.sync();

const app = express();

app.use(helmet());

const httpserver = http.createServer(app);
const socket = new Server(httpserver, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:5173"],
        methods: ["GET", "POST"],
    },
});

socket.on("connection", (socket) => {
    console.log("New client connected");
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
    socket.on("cosplayersCrossedOut", toggleCosplayCrossedOut);
    socket.on("cosplayersGlowToggle", toggleCosplayGlow);
    socket.on("prejudgeCrossedOut", togglePrejudgeCrossedOut);
    socket.on("prejudgeGlowToggle", togglePrejudgeGlow);
});

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api", router);

httpserver.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});

export { socket };
