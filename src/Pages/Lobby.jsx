import React from 'react'
import { useNavigate } from "react-router-dom";
import { Button, Typography } from 'antd'
import styled from 'styled-components';
const { Title } = Typography;

const ButtonDiv = styled.div`
display: flex;
justify-content: space-evenly;
`

const Lobby = () => {
  let navigate = useNavigate();
  const onCreate = () => {
    navigate('/create')
  }
  const onJoin = () => {
    navigate('/join')
  }
  return (
    <div>
      <Title>
        Lobby
      </Title>
      <ButtonDiv>
        <Button type="primary" shape="round" size='large' onClick={onJoin}>
          Join Existing Game
        </Button>
        <Button type="primary" shape="round" size='large' onClick={onCreate}>
          Create New Game
        </Button>
      </ButtonDiv>
    </div>
  )
}

export default Lobby