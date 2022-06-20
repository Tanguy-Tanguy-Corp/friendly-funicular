import React , { useContext }from 'react'
import { useNavigate } from "react-router-dom";
import { Button, Typography } from 'antd'
import styled from 'styled-components';
import { UserContext } from '../Contexts/userContext';
const { Title } = Typography;

const ButtonDiv = styled.div`
display: flex;
justify-content: space-evenly;
`

const Home = () => {

  const user = useContext(UserContext)

  let navigate = useNavigate();
  const onCreate = () => {
    navigate('/create')
  }
  const onJoin = () => {
    navigate('/join')
  }
  return (
    <div>
    <Title>Bienvenue à Scrabbln't</Title>
    <Title>{user.userName}</Title>
    <ButtonDiv>
      <Button type="primary" shape="round" size='large' onClick={onCreate}>
        Créer une partie
      </Button>
      <Button type="primary" shape="round" size='large' onClick={onJoin}>
        Rejoindre une partie
      </Button>
    </ButtonDiv>
  </div>
  )
}

export default Home