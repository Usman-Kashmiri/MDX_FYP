import React, { useState, useEffect, useCallback } from "react";
import { attachTokenWithFormAxios, formAxios } from "../services/axiosConfig";
import Pusher from "pusher-js";
import { useParams } from "react-router-dom";
import { pusher } from "../services/pusherConfig";

const CustomChat = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user.role === "Client" ? "client" : "lawyer";
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState(user.first_name);
  const [reciverId, setReciverId] = useState(id);

  const fetchMessages = useCallback(async () => {
    try {
      await attachTokenWithFormAxios();
      const response = await formAxios.get(`/${role}/chat/list/${id}`);
      setMessages(response.data.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [role, id, setMessages]);

  useEffect(() => {
    // ? Fetch initial chat messages
    fetchMessages();

    Pusher.logToConsole = true;
    // ? Subscribe to Pusher channel for real-time updates
   

    const channel = pusher.subscribe(`my-channel.${id}`);
    channel.bind(`my-event.${id}`, (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      // ? Unsubscribe from the channel when the component unmounts
      pusher.unsubscribe(`my-channel.${id}`);
    };
  }, [fetchMessages, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await attachTokenWithFormAxios();
      const formdata = new FormData();
      formdata.append("message", message);
      formdata.append("recevier_id", id);
      await formAxios.post(`/${role}/chat/create`, formdata);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div>
      <h2>Chat Messages</h2>
      <input
        type="hidden"
        value={reciverId}
        onChange={(e) => setReciverId(e.target.value)}
      />
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <div>
        {messages?.map((msg, i) => (
          <div key={i}>
            <strong>{msg.id}</strong>: {msg.message}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default CustomChat;
