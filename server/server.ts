import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes";
import db from "./database";
import http from "http";
import helmet from "helmet";
import { Server } from "socket.io";
import {
    toggleCosplayCrossedOut,
    toggleCosplayGlow,
    togglePrejudgeCrossedOut,
    togglePrejudgeGlow,
} from "./controllers/cosplayerController";

dotenv.config();

const allowedOrigins = (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const corsOptions = {
    origin:
        allowedOrigins.length > 0
            ? allowedOrigins
            : ["http://localhost:3000", "http://localhost:5173"],
};

db.sync();

const app = express();

app.use(helmet());

const httpserver = http.createServer(app);
const socket = new Server(httpserver, {
    cors: {
        origin: corsOptions.origin,
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

const port = Number(process.env.PORT) || 3000;

httpserver.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

export { socket };
