import React, { useState, useEffect } from 'react'
import { Button, Input, Form, Typography, Spin, Space } from 'antd';
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import API from '../services/API';
import { GameInfoViewCard } from '../Components';

const { Title, Text } = Typography;

const Select = () => {
  let navigate = useNavigate()
  const [cookies, setCookie] = useCookies(['gameid', 'player']);
  const [errorMsg, setErrorMsg] = useState(null);
  const [gameInfos, setGameInfos] = useState(null);
  const [gameInfosLoading, setGameInfosLoading] = useState(true)

  // Redirect to home, if necessary cookies are missing
  useEffect(() => {
    if (!cookies.player) {
      navigate('/');
      return;
    }
  }, [cookies, navigate])

  useEffect(() => {
    setGameInfosLoading(true)
    API.get('game')
      .then(res => {
        setGameInfos(res.data)
        setGameInfosLoading(false)
      })
  }, [])
  

  const onFinish = (values) => {
    console.log('Success:', values.gameid);
    const gameIDs = gameInfos.map(gameInfo => gameInfo.id)
    if (!gameIDs.includes(values.gameid)) {
      setErrorMsg("Cette partie n'existe pas")
      return
    }
    setCookie('gameid', values.gameid, { path: '/' });
    navigate('/lobby')
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
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
      <Form name='join-form' onFinish={onFinish} onFinishFailed={onFinishFailed}>
        <Form.Item label='Game ID' name='gameid' rules={[{ required: true, message: "Veuillez renseigner l'identifiant de la partie"}]}>
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

export default Select