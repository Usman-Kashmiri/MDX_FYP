import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import morgan from "morgan";
import axios from "axios";
import { addUser, removeUser } from "./socketFunctions.js";

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());
app.options("*", cors());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

const PORT = process.env.PORT || 8182;
server.listen(PORT, () => {
    console.log(`Socket.IO server running on: ${PORT}`);
});

// ? router index
app.get("/", (req, res) => {
    res.send("Nbundl node server v1.0.1");
});

// export const baseURL = "https://lawyer.dotclick.co/api"; // dotclick hosting (Dotclick.co/cpanel)
export const baseURL = "http://127.0.0.1:8000/api"; // dotclick hosting (Dotclick.co/cpanel)

const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

export const toggleOnlineStatus = async (token, status) => {
    try {
        axiosInstance.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${token}`;

        const response = await axiosInstance.get(`/auth/user/${status}`);
        console.log("API response: ", response.data);
    } catch (error) {
        console.error("Error: ", error);
    }
};

// * global vars
global.io;
global.onlineUsers = [];

global.io = new Server(server, {
    cors: { origin: "*" },
});

global.io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join", async (data) => {
        addUser({ token: data.token, user: data.user }, socket.id);
        await toggleOnlineStatus(data.token, "online");
    });

    socket.on("logout", () => {
        removeUser(socket.id);
    });

    socket.on("disconnect", () => {
        removeUser(socket.id);
        console.log("user disconnected", socket.id);
    });
});
