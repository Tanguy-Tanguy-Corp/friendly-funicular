import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Menu, Typography } from 'antd';
import { useCookies } from 'react-cookie';
import { NoBackEndModal } from '../Components';

import {
  HomeOutlined,
} from '@ant-design/icons';

const { Header, Footer, Sider, Content } = Layout;
const { Title } = Typography;

const MainLayout = ({ children }) => {

  useEffect(() => {
    
  }, [])
  

  return (
    <>
      <NoBackEndModal/>
      <Layout style={{ minHeight: '100vh' }}>
        <Header className="site-layout-background" style={{ padding: 0, textAlign: 'center' }}>
          <Title level={2} type='warning'>Scrabbln't</Title>
        </Header>
        <Layout className="site-layout">
          <Content style={{ margin: '0em' }}>
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
  const [menuItems, setMenuItems] = useState([])
  const [cookies] = useCookies(['gameid']);
  const navigate = useNavigate();

  useEffect(() => {
    if (cookies.gameid) {
      setMenuItems([
        { label: 'Acceuil', key: '', icon: <HomeOutlined />},
        { label: 'Partie en cours', key: 'game', icon: <HomeOutlined />}
      ])
    } else {
      setMenuItems([
        { label: 'Home', key: '', icon: <HomeOutlined />}
      ])
    }
  }, [cookies.gameid])

  const onClick = (e) => {
    console.log('click', e);
    navigate(`/${e.key}`)
  }

  return (
    <>
      <Menu onClick={onClick} theme="dark" defaultSelectedKeys={['']} mode="inline" items={menuItems}/>
    </>
  );
};

export default MainLayout;