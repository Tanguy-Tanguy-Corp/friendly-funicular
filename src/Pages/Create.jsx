import React, { useCallback, useState, useEffect } from 'react';
import { Button, Form, Input, Radio, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import API from '../services/API';
import '../css/Create.css';

const { Title } = Typography;

const Create = () => {
  let navigate = useNavigate();
  const [gameLoading, setGameLoading] = useState(false);
  const [cookies, setCookie] = useCookies(['gameId', 'playerId']);

  // Redirect to home, if player is undefined
  useEffect(() => {
    if (!cookies.playerId) navigate('/');
  }, [cookies.playerId, navigate]);

  const createGame = useCallback(async (values) => {
    console.log('gameCreate');
    setGameLoading(true);
    API.post('game', { creatorID: cookies.playerId, name: values.name, nbPlayers: parseInt(values.nbPlayers) })
    .then(res => {
      const game = res.data
      setCookie('gameId', game.id, { path: '/' });
      navigate('/lobby');
    })
    .catch(err => console.log(err))
    .finally(() => setGameLoading(false));
  }, [cookies.playerId, navigate, setCookie]);

  return (
    <div>
      <Title>Créer une nouvelle partie</Title>
      {/* {cookies.gameId && <Link href={'/game'} strong type='warning'>{`Attention vous êtes déja dans une partie en cours (game ID: ${cookies.gameId})`}</Link>} */}
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