import React, { useState, useEffect } from "react";
import { Widget, addResponseMessage, deleteMessages } from "react-chat-widget";
import "react-chat-widget/lib/styles.css";
import socket from "../../shared/socket";

export default function Chat(props) {
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    socket.on("new-channel", (obj) => {
      console.log("joined new channel");
      deleteMessages(messageCount);
      setMessageCount(0);
    });

    socket.on("message", ({ username, msg }) => {
      console.log(`New message from ${username}: ${msg}`);
      addResponseMessage(msg);
      setMessageCount(messageCount + 1);
    });
  }, []);

  const handleNewUserMessage = (msg) => {
    console.log(msg);
    socket.emit("message", {
      channelId: props.channelId,
      username: props.username,
      msg: msg
    });
  };

  return (
    <div>
      <Widget
        handleNewUserMessage={handleNewUserMessage}
        title={props.channelId}
        subtitle={props.description}
      />
    </div>
  );
}
