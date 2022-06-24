import React, { useCallback, useState, useEffect } from 'react';
import { Button, Form, Input, Radio, Typography } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import API from '../services/API';
import './Create.css';

const { Title, Link } = Typography;

const Create = () => {
  let navigate = useNavigate()
  const [gameLoading, setGameLoading] = useState(false)
  const [cookies, setCookie] = useCookies(['gameid', 'player']);

  // Redirect to home, if necessary cookies are missing
  useEffect(() => {
    if (!cookies.player) {
      navigate('/');
      return;
    }
  }, [cookies, navigate])

  const createGame = useCallback(async (values) => {
    const gameID =  uuidv4()
    setGameLoading(true)
    API.post('games', { Document:{ gameID, creatorID: cookies.player, gamename: values.name, nbPlayers: values.nbPlayers }}).then(() => {
      console.log('gameCreate')
      setGameLoading(false)
      setCookie('gameid', gameID, { path: '/' });
      navigate('/lobby')
    })
  }, [cookies.player, navigate, setCookie])

  return (
    <div>
      <Title>Créer une nouvelle partie</Title>
      {cookies.gameid && <Link href={'/game'} strong type='warning'>{`Attention vous êtes déja dans une partie en cours (game ID: ${cookies.gameid})`}</Link>}
        <Form name="basic" labelCol={{ span: 4 }} wrapperCol={{ span: 4 }} initialValues={{ remember: true }} onFinish={createGame}  autoComplete="off">
          <Form.Item label="Nom de la partie" name="name" rules={ [{ required: true, message: 'Merci de fournir un nom de partie!' }] }>
            <Input />
          </Form.Item>
          <Form.Item label="Nombre de joueurs" name="nbPlayers" rules={[{ required: true, message: 'Merci de fournir un nombre de joueurs'}]}>
            <Radio.Group>
              <Radio.Button value="2">2</Radio.Button>
              <Radio.Button value="3">3</Radio.Button>
              <Radio.Button value="4">4</Radio.Button>
          </Radio.Group>
          </Form.Item>
          {/* <Form.Item label='Private' name="isPrivate" valuePropName="checked" wrapperCol={{ offset: 0, span: 16 }}>
            <Switch disabled onChange={onPrivateChange}/>
          </Form.Item>
          {isPrivate && <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input a game password!' }]}>
            <Input.Password/>
          </Form.Item>} */}
        <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
          <Button type="primary" htmlType="submit" loading={gameLoading}>
            Créer
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Create;