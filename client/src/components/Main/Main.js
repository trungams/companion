import React, { useEffect, useState } from "react";
import { Layout, Menu, Button } from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined
} from "@ant-design/icons";
import Chat from "../Chat/Chat";
import Draw from "../Draw/Draw";
import Movie from "../Movie/Movie";
import Passcode from "../Passcode/Passcode";
import "antd/dist/antd.css";
import "./index.css";
import socket from "../../shared/socket";
const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

export default function Main(props) {
  const [collapsed, onCollapse] = useState(false);
  const [itemKey, setItemKey] = useState();
  const [content, setContent] = useState();
  const [chatRoom, setChatRoom] = useState("General");
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState();
  const [isAdmin, setIsAdmin] = useState("false");
  useEffect(() => {
    if (localStorage.getItem("loggedIn") === "true") {
      setLoggedIn(true);
      console.log(localStorage.getItem("isAdmin"));
      setIsAdmin(localStorage.getItem("isAdmin") === "true");
    }
  }, []);
  console.log("main component: isAdmin = ", isAdmin);
  const itemToContent = {
    game: <div>Game</div>,
    movie: <Movie isAdmin={isAdmin} />,
    draw: <Draw isAdmin={isAdmin} />,
    meditation: <div>Meditation</div>
  };
  const handleItemClick = (e) => {
    setItemKey(e.key);
    setContent(itemToContent[e.key]);
  };
  const handleMenuClick = (e) => {
    setChatRoom(e.key);
    socket.emit("join-channel", e.key);
  };
  const getDescription = (channelId) => {
    return "Room for " + channelId;
  };
  const handleSignOut = () => {
    console.log("signing out");
    localStorage.setItem("loggedIn", false);
    localStorage.setItem("isAdmin", false);
    setLoggedIn(false);
    setIsAdmin(false);
  };

  return (
    <div className="main">
      {isLoggedIn && (
        <Layout style={{ minHeight: "100vh" }}>
          <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
            <Menu
              theme="dark"
              defaultOpenKeys={["sub1"]}
              mode="inline"
              selectedKeys={[itemKey]}
              onClick={handleItemClick}
            >
              <SubMenu key="sub1" icon={<UserOutlined />} title="Activities">
                <Menu.Item key="game" onClick={handleMenuClick}>
                  Game
                </Menu.Item>
                <Menu.Item key="movie" onClick={handleMenuClick}>
                  Movie
                </Menu.Item>
                <Menu.Item key="draw" onClick={handleMenuClick}>
                  Draw
                </Menu.Item>
                <Menu.Item key="meditation" onClick={handleMenuClick}>
                  Meditation
                </Menu.Item>
              </SubMenu>
              <SubMenu key="sub2" icon={<TeamOutlined />} title="Services">
                <Menu.Item key="customer-service" onClick={handleMenuClick}>
                  Customer Service
                </Menu.Item>
                <Menu.Item key="emergency" onClick={handleMenuClick}>
                  Emergency
                </Menu.Item>
              </SubMenu>
            </Menu>
            <Button
              type="primary"
              className="signOut-btn"
              onClick={handleSignOut}
            >
              Sign out
            </Button>
          </Sider>

          <Layout className="site-layout">
            <Content style={{ margin: "0 16px" }}>
              {itemToContent[itemKey]}
            </Content>
          </Layout>
          <Chat
            channelId={chatRoom}
            description={getDescription(chatRoom)}
            username={username}
          />
        </Layout>
      )}
      {!isLoggedIn && (
        <Passcode
          setLoggedIn={setLoggedIn}
          setUsername={setUsername}
          setIsAdmin={setIsAdmin}
        />
      )}
    </div>
  );
}
