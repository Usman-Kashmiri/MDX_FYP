import { toggleOnlineStatus } from "./server.js";

export const addUser = async (data, socket) => {
    const index = global.onlineUsers.findIndex((exUser) => {
        return exUser.user.id == data.user.id;
    });

    if (index == -1) {
        global.onlineUsers.push({
            user: data.user,
            token: data.token,
            socket,
        });
    } else {
        global.onlineUsers[index].socket = socket;
    }
    global.io.emit("update-chat-list");
};

export const removeUser = async (socket) => {
    const removedUser = global.onlineUsers.find((exUser) => {
        return exUser.socket == socket;
    });

    if (removedUser !== undefined && removedUser !== null) {
        await toggleOnlineStatus(removedUser.token, "offline");

        global.onlineUsers = global.onlineUsers.filter((exUser) => {
            return exUser.socket !== socket;
        });

        console.log("removed user", removedUser);
    } else {
        console.log("user not found");
    }
    global.io.emit("update-chat-list");
};
