import React from 'react'
import { Button, Input, Form, Typography } from 'antd';
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { useState } from 'react';
import { useEffect } from 'react';

const { Title } = Typography;

const backendURL = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_DEV_BACKEND_URL : process.env.REACT_APP_PROD_BACKEND_URL
console.log(`l'url backend utilisé est: ${backendURL}`)
const databaseName = process.env.NODE_ENV === 'development' ? 'Development' : 'Production'
console.log(`la base de données utilisé est: ${databaseName}`)

const Join = () => {
  let navigate = useNavigate()
  const [cookies, setCookie] = useCookies(['gameid']);
  const [gameIDs, setGameIDs] = useState(['Loading game IDs'])

  useEffect(() => {
    const fetchGames = async () => {
      const response = await fetch(
        `${backendURL}/games/all`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({database: databaseName, collection: 'games'})
        }
      )
      const games = await response.json()
      console.log(games)
      return games
    }
    fetchGames().then(games => {
      const newGameIDS = games.map(game => JSON.stringify({gameID: game.gameID, gamename: game.gamename, players: game.nbPlayers}))
      setGameIDs(newGameIDS);
    })
  }, [])

  const onFinish = (values) => {
    console.log('Success:', values.gameid);
    setCookie('gameid', values.gameid, { path: '/' });
    navigate('/game')
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div>
      <Title>Join an existing game</Title>
      <div>{gameIDs?.map((id,i) => {return(<div key={i}>{id}</div>)})}</div>
      <Form name='join-form' onFinish={onFinish} onFinishFailed={onFinishFailed}>
        <Form.Item label='Game ID' name='gameid' rules={[{ required: true, message: 'Please enter the ID of the game'}]}>
          <Input/>
        </Form.Item>
        <Form.Item wrapperCol={{ span: 2 }}>
          <Button type="primary" htmlType="submit">
            Join
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Join