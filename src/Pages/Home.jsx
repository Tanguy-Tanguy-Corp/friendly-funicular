import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography } from 'antd';
import { PlayerCreateCard } from '../Components';
import styled from 'styled-components';
import { useCookies } from 'react-cookie';
const { Title } = Typography;

const ButtonDiv = styled.div`
display: flex;
justify-content: space-evenly;
`

const Home = () => {

  const [cookies] = useCookies(['playerId']);

  let navigate = useNavigate();
  const navCreate = () => navigate('/create');
  const navJoin = () => navigate('/select');
  
  return (
    <>
    <Title>Bienvenue à Scrabbln't</Title>
    <PlayerCreateCard/>
    <ButtonDiv>
      <Button type='primary' shape='round' size='large' onClick={navCreate} disabled={!cookies.playerId}>
        Créer une partie
      </Button>
      <Button type='primary' shape='round' size='large' onClick={navJoin} disabled={!cookies.playerId}>
        Rejoindre une partie
      </Button>
    </ButtonDiv>
  </>
  );
};

export default Home;