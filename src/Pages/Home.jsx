import React from 'react'
import { useNavigate } from "react-router-dom";
import { Button, Typography } from 'antd'
import { PlayerCreateCard } from '../Components';
import styled from 'styled-components';
import { useCookies } from 'react-cookie';
const { Title } = Typography;

const ButtonDiv = styled.div`
display: flex;
justify-content: space-evenly;
`

const Home = () => {

  const [cookies] = useCookies(['player'])

  let navigate = useNavigate();
  const onCreate = () => {
    navigate('/create')
  }
  const onJoin = () => {
    navigate('/join')
  }

  React.useEffect(() => {
    console.log('home')
  }, [])
  
  return (
    <div>
    <Title>Bienvenue à Scrabbln't</Title>
    <PlayerCreateCard/>
    <ButtonDiv>
      <Button type="primary" shape="round" size='large' onClick={onCreate} disabled={!cookies.player}>
        Créer une partie
      </Button>
      <Button type="primary" shape="round" size='large' onClick={onJoin} disabled={!cookies.player}>
        Rejoindre une partie
      </Button>
    </ButtonDiv>
  </div>
  )
}

export default Home