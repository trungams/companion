import React, { useState, useEffect } from "react";
import { Form, Input, Button } from "antd";
import socket from "../../shared/socket";
import "./index.css";
const layout = {
  labelCol: {
    span: 5
  },
  wrapperCol: {
    span: 16
  }
};
const tailLayout = {
  wrapperCol: {
    offset: 5
  }
};

export default function Passcode(props) {
  useEffect(() => {
    socket.on("pincode", (data) => {
      const { success, username, isAdmin } = data;
      console.log(data);
      props.setLoggedIn(success);
      if (success) {
        localStorage.setItem("loggedIn", true);
        localStorage.setItem("isAdmin", isAdmin);
        props.setUsername(username);
        props.setIsAdmin(isAdmin);
      } else {
        alert("Wrong passcode");
        localStorage.setItem("loggedIn", false);
        localStorage.setItem("isAdmin", false);
      }
    });
  }, []);
  const onFinish = (values) => {
    console.log(values);
    socket.emit("pincode", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className="pinForm">
      <h1 className="app-header">Companion</h1>
      <Form
        {...layout}
        name="basic"
        initialValues={{
          remember: true
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: "Please pick a username!"
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Passcode"
          name="pin"
          rules={[
            {
              required: true,
              message: "Please input your provided passcode!"
            }
          ]}
          type="password"
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
