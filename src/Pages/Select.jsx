import React, { useState, useEffect } from 'react';
import { Button, Input, Form, Typography, Spin, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import API from '../services/API';
import { GameInfoViewCard } from '../Components';

const { Title, Text } = Typography;

// TODO: Create a presentation component for game info view card, with scroll feature

const Select = () => {
  let navigate = useNavigate();
  const [cookies, setCookie] = useCookies(['gameId', 'playerId']);
  const [errorMsg, setErrorMsg] = useState(null);
  const [gameInfos, setGameInfos] = useState(null);
  const [gameInfosLoading, setGameInfosLoading] = useState(false);

  // Redirect to home, if player is undefined
  useEffect(() => {
    if (!cookies.playerId) navigate('/');
  }, [cookies.playerId, navigate]);

  // Infos fetching
  useEffect(() => {
    setGameInfosLoading(true);
    API.get('game')
      .then(res => {
        const infos = res.data;
        setGameInfos(infos);
      })
      .catch(err => console.log(err))
      .finally(() => setGameInfosLoading(false));
  }, []);
  

  const onFinish = (values) => {
    const gameIDs = gameInfos.map(gameInfo => gameInfo.id);
    if (!gameIDs.includes(values.gameid)) {
      setErrorMsg('Cette partie n\'existe pas');
      return;
    };
    setCookie('gameId', values.gameId, { path: '/' });
    navigate('/lobby');
  };

  return (
    <div>
      <Title>Rejoindre une partie</Title>
      {
      gameInfosLoading
      ?
      <Spin/>
      :
      <div>
        <Space>
        {
          gameInfos?.map((gameInfo, index) => {
            return(<GameInfoViewCard  key={index} gameInfo={gameInfo} isLoading={gameInfosLoading} />)
          })
        }
        </Space>
      </div>
      }
      <Text strong type='danger'>{errorMsg}</Text>
      <Form name='join-form' onFinish={onFinish}>
        <Form.Item label='Game ID' name='gameId' rules={[{ required: true, message: 'Veuillez renseigner l\'identifiant de la partie'}]}>
          <Input/>
        </Form.Item>
        <Form.Item wrapperCol={{ span: 2 }}>
          <Button type='primary' htmlType='submit'>
            Rejoindre Lobby
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Select;