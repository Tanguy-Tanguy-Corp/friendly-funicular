import React, { useEffect, useState } from 'react'
import { Button, Input, Form, Typography } from 'antd';
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import useFetch from '../Hooks/useFetch';

const { Title, Text } = Typography;

const backendURL = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_DEV_BACKEND_URL : process.env.REACT_APP_PROD_BACKEND_URL
console.log(`l'url backend utilisé est: ${backendURL}`)
const databaseName = process.env.NODE_ENV === 'development' ? 'Development' : 'Production'
console.log(`la base de données utilisé est: ${databaseName}`)

const Join = () => {
  let navigate = useNavigate()
  const [cookies, setCookie] = useCookies(['gameid']);
  const [errorMsg, setErrorMsg] = useState(null);

  const { data: games, error: gamesError, isloading: gamesIsLoading } = useFetch(
    `${backendURL}/games/all`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({database: databaseName, collection: 'games'})
    }
  )

  const onFinish = (values) => {
    console.log('Success:', values.gameid);
    const gameIDs = games.map(game => game.gameID)
    if (!gameIDs.includes(values.gameid)) {
      setErrorMsg("Cette partie n'existe pas")
      return
    }
    setCookie('gameid', values.gameid, { path: '/' });
    navigate('/game')
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div>
      <Title>Rejoindre une partie</Title>
      {gamesIsLoading ?? <div>{games?.map((game, key) => {return <div key={key}>{JSON.stringify({gameID: game.gameID, name: game.gamename})}</div>})}</div>}
      <Text strong type='warning'>{errorMsg}</Text>
      <Form name='join-form' onFinish={onFinish} onFinishFailed={onFinishFailed}>
        <Form.Item label='Game ID' name='gameid' rules={[{ required: true, message: 'Please enter the ID of the game'}]}>
          <Input/>
        </Form.Item>
        <Form.Item wrapperCol={{ span: 2 }}>
          <Button type="primary" htmlType="submit">
            Rejoindre
          </Button>
        </Form.Item>
        <Form.Item>
          <Button disabled type='primary'>
            Regarder
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Join