import React, { useState, useEffect } from "react";
import DrawingBoard from "react-drawing-board";
import socket from "../../shared/socket";

export default function Draw(props) {
  const [operations, setOperations] = useState([]);
  useEffect(() => {
    socket.on("draw", (newOps) => {
      setOperations((oldOps) => {
        return [...oldOps, ...newOps];
      });
    });

    socket.emit("drawinit");
  }, []);
  const handleDraw = (newOp, afterOp) => {
    // emit newOp
    socket.emit("draw", newOp);
    setOperations(afterOp);
  };
  return (
    <div>
      <DrawingBoard
        userId="global" //
        operations={operations}
        onChange={handleDraw}
        toolbarPlacement={"left"}
      />
    </div>
  );
}
