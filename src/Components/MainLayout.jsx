import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Typography } from 'antd';
import { useCookies } from 'react-cookie';

import {
  HomeOutlined,
  UserAddOutlined
} from '@ant-design/icons';

const { Header, Footer, Sider, Content } = Layout;
const { Title } = Typography;

const MainLayout = ({ children }) => {
  

  return (
    <>
      <Layout style={{ minHeight: '100vh' }}>
        <Header className="site-layout-background" style={{ padding: 0, textAlign: 'center' }}>
          <Title level={2} type='warning'>Scrabbln't</Title>
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
  const [cookies] = useCookies(['gameid'])

  return (
    <>
      <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
        <Menu.Item key="home" icon={<HomeOutlined />}>
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="lobby" icon={<UserAddOutlined />}>
          <Link to="lobby">Lobby</Link>
        </Menu.Item>
        {cookies.gameid&&<Menu.Item key="game" icon={<UserAddOutlined />}>
          <Link to="game">Partie en cours</Link>
        </Menu.Item>}
      </Menu>
    </>
  )
}

export default MainLayout
