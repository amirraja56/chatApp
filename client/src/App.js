import React, { useEffect, useState, useMemo } from 'react';
import './index.css';
import { io } from 'socket.io-client'

export default function App() {
  const socket = useMemo(() => io("http://localhost:4003/"), []);
  const [message, setMessage] = useState("");
  const [userMessage, setUserMessage] = useState([]);
  const [room, setRoom] = useState("");
  const [joinRoom, setJoinRoom] = useState("");
  const [otherMessage, setOtherMessage] = useState([]);

  const handleSend = (e) => {
    e.preventDefault();
    socket.emit("message", { room, message })
    setMessage("")
    setUserMessage((userMessage) => [...userMessage, message]);
  };

  const handleRoom = (e) => {
    e.preventDefault();
    socket.emit("join-room", joinRoom)
    setJoinRoom("")
    // setOtherMessage((otherMessage) => [...otherMessage, joinRoom]);
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id)
    });

    socket.on("recieve-message", (data) => {
      console.log(data)
      setOtherMessage((otherMessage) => [...otherMessage, data]);
    })
    return () => {
      socket.disconnect();
    }
  }, []);

  return (
    <>
      <div className="container">
        <div className="chat-container">
          <div className="chat-header">
            Live Chat
          </div>
          <div className="chat-messages" id="chatMessages">
            {/* <!-- Chat messages will be displayed here --> */}
            <div className="text">
              {userMessage.map((res, index) => (
                <fieldset className='user-message' key={index}>{res}</fieldset>
              ))}
            </div>
            <div className="text">
              {otherMessage.map((res, index) => (
                <fieldset className='other-message' key={index}>{res}</fieldset>
              ))}
            </div>
          </div>
          <div className="input-container">
            <form onSubmit={handleSend}>
              <div className="input-group">
                <input value={room} onChange={(e) => { setRoom(e.target.value) }} type="text" className="form-control" placeholder="Recipient name" />
              </div>
              <div className="input-group">
                <input value={message} onChange={(e) => { setMessage(e.target.value) }} type="text" className="form-control" placeholder="Type your message..." />
                <div className="input-group-append">
                  <button className="btn btn-primary send-button" type="submit">Send</button>
                </div>
              </div>
            </form>
            <form onSubmit={handleRoom}>
              <div className="input-group">
                <input value={joinRoom} onChange={(e) => { setJoinRoom(e.target.value) }} type="text" className="form-control" placeholder="Group Name" />
                <div className="input-group-append">
                  <button className="btn btn-primary send-button" type="submit">Join </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
};

