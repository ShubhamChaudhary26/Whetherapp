import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Replace with your server URL

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState("");

  // Handle incoming messages
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.on("typing", (data) => {
      setTyping(`${data.username} is typing...`);
    });

    socket.on("stop_typing", () => {
      setTyping("");
    });

    return () => {
      socket.off("receive_message");
      socket.off("typing");
      socket.off("stop_typing");
    };
  }, []);

  const joinRoom = () => {
    if (username && room) {
      socket.emit("join_room", { username, room });
    }
  };

  const sendMessage = () => {
    if (message && room) {
      const messageData = { username, room, message, time: new Date().toLocaleTimeString() };
      socket.emit("send_message", messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setMessage("");
      socket.emit("stop_typing", room);
    }
  };

  const handleTyping = () => {
    if (room) {
      socket.emit("typing", { username, room });
    }
  };

  const stopTyping = () => {
    if (room) {
      socket.emit("stop_typing", room);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Real-Time Chat</h1>
        {!room ? (
          <>
            <input
              type="text"
              placeholder="Username"
              className="w-full p-2 mb-4 border rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="text"
              placeholder="Room"
              className="w-full p-2 mb-4 border rounded"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />
            <button
              className="w-full p-2 bg-blue-500 text-white rounded"
              onClick={joinRoom}
            >
              Join Room
            </button>
          </>
        ) : (
          <>
            <div className="border p-2 rounded-lg mb-4 h-64 overflow-y-auto">
              {messages.map((msg, index) => (
                <div key={index} className="mb-2">
                  <strong>{msg.username}: </strong>
                  <span>{msg.message}</span>
                  <div className="text-xs text-gray-500">{msg.time}</div>
                </div>
              ))}
            </div>
            {typing && <p className="text-green-500">{typing}</p>}
            <input
              type="text"
              placeholder="Type your message..."
              className="w-full p-2 mb-4 border rounded"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleTyping}
              onBlur={stopTyping}
            />
            <button
              className="w-full p-2 bg-blue-500 text-white rounded"
              onClick={sendMessage}
            >
              Send
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;

