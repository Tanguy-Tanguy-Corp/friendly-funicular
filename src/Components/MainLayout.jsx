import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Typography } from 'antd';

import {
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
  UserAddOutlined,
  DashboardOutlined,
  PlayCircleOutlined,
  CommentOutlined
} from '@ant-design/icons';

const { Header, Footer, Sider, Content } = Layout;
const { Title } = Typography;

const MainLayout = ({ children }) => {

  return (
    <>
      <Layout style={{ minHeight: '100vh' }}>
        <Header className="site-layout-background" style={{ padding: 0, textAlign: 'center' }}>
          <Title level={2} type='warning'>Web App Scrabble</Title>
        </Header>
        <Layout className="site-layout">
          <Content style={{ margin: '16px' }}>
            {children}
          </Content>
          <Sider>
              <SiderMenu />
          </Sider>
        </Layout>
        <Footer style={{ textAlign: 'center', backgroundColor: 'gray' }}>Web App Scrabble</Footer>
      </Layout>
    </>
  )
}

const SiderMenu = () => {

  return (
    <>
      <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
        <Menu.Item key="home" icon={<HomeOutlined />}>
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="lobby" icon={<UserAddOutlined />}>
          <Link to="lobby">Lobby</Link>
        </Menu.Item>
      </Menu>
    </>
  )
}

export default MainLayout
