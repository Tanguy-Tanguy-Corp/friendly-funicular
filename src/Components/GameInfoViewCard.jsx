import React from 'react'
import { Button, Card, Spin } from 'antd'
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
const GameInfoViewCard = ({ gameInfo, isLoading }) => {
  let navigate = useNavigate();
  const [, setCookie] = useCookies(['gameId', 'playerId']);

  const joinGameLobby = () => {
    setCookie('gameId', gameInfo.id, { path: '/' });
    navigate('/lobby')
  }


  return (
    <>
      <Card title={gameInfo.name} loading={isLoading}>
        {
          isLoading
          ?
          <Spin />
          :
          <div>
            <p>
              {"Nom: "}{gameInfo.name}
            </p>
            <p>
              {"Nombre de places: "}{gameInfo.players.length + "/" + gameInfo.nbPlayers}
            </p>
            <Button onClick={joinGameLobby}>Rejoindre Lobby</Button>
          </div>
        }
      </Card>
    </>
  )
}

export default GameInfoViewCard