import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Menu, Typography } from 'antd';
import { useCookies } from 'react-cookie';
import { NoBackEndModal } from '../Components';

import {
  HomeOutlined,
  CommentOutlined
} from '@ant-design/icons';

const { Header, Footer, Sider, Content } = Layout;
const { Title } = Typography;

// TODO: Add somewhere in the layout the user context

const MainLayout = ({ children }) => {
  return (
    <>
      <NoBackEndModal/>
      <Layout style={{ minHeight: '100vh' }}>
        <Header className='site-layout-background' style={{ padding: '1em', textAlign: 'center' }}>
          <Title level={2} type='warning'>Scrabbln't</Title>
        </Header>
        <Layout className='site-layout'>
          <Content style={{ margin: '2em' }}>
            {children}
          </Content>
          <Sider>
              <SiderMenu />
          </Sider>
        </Layout>
        <Footer style={{ textAlign: 'center', backgroundColor: 'gray' }}>Scrabbln't</Footer>
      </Layout>
    </>
  );
};

const SiderMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [cookies] = useCookies(['gameId', 'dev', 'playerId']);
  let navigate = useNavigate();

  useEffect(() => {
    if (cookies.gameId && cookies.playerId) {
      setMenuItems([
        { label: 'Acceuil', key: '', icon: <HomeOutlined />},
        { label: 'Partie en cours', key: 'game', icon: <HomeOutlined />}
      ]);
    } else {
      setMenuItems([
        { label: 'Acceuil', key: '', icon: <HomeOutlined />}
      ]);
    };
    if (cookies.dev === 'true') {
      setMenuItems(oldItems => [...oldItems, { label: 'SocketIO Test', key: 'socket', icon: <CommentOutlined />}]);
    };
  }, [cookies]);

  const navTo = (e) => navigate(`/${e.key}`);

  return (
    <>
      <Menu onClick={navTo} theme='dark' defaultSelectedKeys={['']} mode='inline' items={menuItems}/>
    </>
  );
};

export default MainLayout;
