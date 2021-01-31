import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import "antd/dist/antd.css";
import socket from "../../shared/socket";
import { List, Card } from "antd";
import "./index.css";
export default function Movie(props) {
  const [config, setConfig] = useState({
    playing: false,
    seeking: false
  });
  const isAdmin = props.isAdmin;
  console.log("isAdmin = ", isAdmin);
  const player = useRef(null);
  const [flag, setFlag] = useState(false);
  useEffect(() => {
    socket.on("movie", (newConfig) => {
      setConfig({ ...config, ...newConfig });
      setFlag(true);
      if (newConfig.time) player.current.seekTo(newConfig.time);
    });
    return () => {
      socket.off("movie");
    };
  }, []);

  const handlePlay = () => {
    console.log("Emitting play");
    setConfig({ ...config, playing: true });
    if (flag) {
      setFlag(false);
    } else {
      socket.emit("movie", {
        playing: true,
        time: player.current.getCurrentTime()
      });
    }
  };
  const handlePause = () => {
    console.log("Emitting pause");
    setConfig({ ...config, playing: false });
    if (flag) {
      setFlag(false);
    } else {
      socket.emit("movie", {
        playing: false,
        time: player.current.getCurrentTime()
      });
    }
  };
  const data = [
    {
      title: "Construct",
      cover: (
        <img
          height="200px"
          alt="CONSTRUCT"
          src="https://i.ytimg.com/vi/7SrlYSKlUvQ/maxresdefault.jpg"
        />
      ),
      summary:
        " CONSTRUCT is a Sci-Fi short film advancing the art of filmmaking, VFX and virtual production."
    },
    {
      title: "Advenger: End game",
      cover: (
        <img
          height="200px"
          alt="Advenger: End game"
          src="https://upload.wikimedia.org/wikipedia/en/0/0d/Avengers_Endgame_poster.jpg"
        />
      ),
      summary:
        "After Thanos, an intergalactic warlord, disintegrates half of the universe, the Avengers must reunite and assemble again to reinvigorate their trounced allies and restore balance."
    },
    {
      title: "Fast and furious",
      cover: (
        <img
          height="200px"
          alt="Fast and furios"
          src="https://images-na.ssl-images-amazon.com/images/I/910VekmDZ5L._AC_SY741_.jpg"
        />
      ),
      summary:
        "Dominic and his family are caught in a quagmire when Shaw's brother seeks bloody revenge. They must not only deal with their enemy but also save a crucial programme from falling into the wrong hands."
    }
  ];
  return (
    <div>
      <ReactPlayer
        controls={!!isAdmin}
        ref={player}
        url={"https://vimeo.com/90509568"}
        className="react-player"
        onPlay={handlePlay}
        onPause={handlePause}
        {...config}
      />
      <div className="movieList">
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 4,
            lg: 4,
            xl: 6,
            xxl: 3
          }}
          dataSource={data}
          renderItem={(item) => {
            return (
              <List.Item>
                <Card title={item.title} hoverable cover={item.cover}>
                  {item.summary}
                </Card>
              </List.Item>
            );
          }}
        />
      </div>
    </div>
  );
}
