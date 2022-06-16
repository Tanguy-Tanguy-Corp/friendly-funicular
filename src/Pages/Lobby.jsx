import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { Button, Typography } from 'antd'
import { useCookies } from 'react-cookie';
const { Title, Text } = Typography;

const backendURL = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_DEV_BACKEND_URL : process.env.REACT_APP_PROD_BACKEND_URL
console.log(`l'url backend utilisé est: ${backendURL}`)
const databaseName = process.env.NODE_ENV === 'development' ? 'Development' : 'Production'
console.log(`la base de données utilisé est: ${databaseName}`)

const Lobby = () => {
  const [gameLoading, setGameLoading] = useState(false);
  const [game, setGame] = useState(null);
  const [cookies] = useCookies(['gameid']);
  let navigate = useNavigate();

  const onStart = () => {
    navigate('/game')
  }

  // Get the intital tiles from the database
  useEffect(() => {
    const fetchTile = async () => {
      setGameLoading(true)
      const response = await fetch(
        `${backendURL}/games/get`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({database: databaseName, Filter: {gameID: cookies.gameid}})
        }
      )
      const game = await response.json().then(setGameLoading(false))
      console.log(game)
      return game
    }
    fetchTile().then(game => {
      setGame(game);
    })
  }, [cookies.gameid])

  return (
    <div>
      <Title>
        Lobby
      </Title>
      <div>
      <Text>
        {`Nom de la partie: ${game && game?.gamename}`}
      </Text>
      </div>
      <div>
      <Text>
        {`Identifiant de la partie: ${game && game.gameID}`}
      </Text>
      </div>
      <div>
      <Text>
        {`Nombre de joueurs: ${game && game.nbPlayers}`}
      </Text>
      </div>
      <div>
      <Text>
        {`Noms des joueurs: ${game && game.players}`}
      </Text>
      </div>
      <Button type="primary" shape="round" size='large' onClick={onStart} loading={gameLoading}>
        Commencer la partie
      </Button>
    </div>
  )
}

export default Lobby