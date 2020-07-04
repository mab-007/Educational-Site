import React, { useState, useEffect } from "react";
import {Redirect, NavLink} from 'react-router-dom';
import { Menu, Layout } from "antd";
import {
  SettingOutlined,
  FileTextOutlined,
  WechatOutlined,
  HomeOutlined,
  UserOutlined,
  EditOutlined,
  RiseOutlined,
  OrderedListOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import s from "./App.module.css";

const { Content, Sider } = Layout;


function SideBar() {
  const [collapsed, setCollapse] = React.useState(true);
  const [activeItem, setActiveItem] = useState("1");

  useEffect(() => {
    const path = window.location.pathname;
    console.log(path);
    switch (path) {
      case "/dashboard":
        setActiveItem("2");
        break;
      case "/article":
          setActiveItem("2");
          break;
      case "/mystudyplans":
        setActiveItem("4")
        break;
      case "/view":
        setActiveItem("2");
        break;
      case "/edit":
        setActiveItem("6");
        break;
      case "/forum":
        setActiveItem("3");
        break;
      case "/contest":
        setActiveItem("7");
        break;
      case "/leaderboard":
        setActiveItem("5");
        break;
    }
  },[window.location.pathname])
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={state => setCollapse(state)}
      width={200}
      className="site-layout-background"
    >
      <Menu
        defaultSelectedKeys={[activeItem]}
        selectedKeys={[activeItem]}
        mode="inline"
        style={{ height: "100%", borderRight: 0 }}
      ><div className={s.logo}>CATALOG</div>
        <Menu.Item key="2" onClick={e=>window.location="/dashboard"}>
          <FileTextOutlined />
          <span>Dashboard</span>
        </Menu.Item>
        <Menu.Item key="3" onClick={e=>window.location="/forum"}>
          <WechatOutlined />
          <span>Forum</span>
        </Menu.Item>
        <Menu.Item key="4" onClick={e=>window.location="/mystudyplans"}>
          <OrderedListOutlined />
          <span>Study Planner</span>
        </Menu.Item>
        <Menu.Item key="5" onClick={e=>window.location="/leaderboard"}>
          <RiseOutlined />
          <span>Leaderboard</span>
        </Menu.Item>
        <Menu.Item key="6" onClick={e=>window.location="/edit"}>
          <EditOutlined />
          <span>Create</span>
        </Menu.Item>
        <Menu.Item key="7" onClick={e=>window.location="/contest"}>
          <CrownOutlined />
          <span>Contest</span>
        </Menu.Item>
      </Menu>
    </Sider>
  )
}
export default SideBar;