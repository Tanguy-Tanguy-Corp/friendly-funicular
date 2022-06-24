import React, { useState, useCallback, useEffect } from 'react'
import { Button, Input, Form, Typography, Spin, Space } from 'antd';
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import API from '../services/API';

const { Title, Text } = Typography;


const Join = () => {
  let navigate = useNavigate()
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookie] = useCookies(['gameid', 'player']);
  const [errorMsg, setErrorMsg] = useState(null);
  const [infos, setInfos] = useState(null);
  const [infosLoading, setInfosLoading] = useState(true)

  // Redirect to home, if necessary cookies are missing
  useEffect(() => {
    if (!cookies.player) {
      navigate('/');
      return;
    }
  }, [cookies, navigate])

  const fetchGameInfos = useCallback(() => {
    setInfosLoading(true)
    API.get('games/info')
      .then(res => {
        setInfos(res.data)
        setInfosLoading(false)
      })
  }, [])

  useEffect(() => {
    fetchGameInfos()
  }, [fetchGameInfos])
  

  const onFinish = (values) => {
    console.log('Success:', values.gameid);
    const gameIDs = infos.map(gameInfo => gameInfo.gameID)
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

  const onClickGame = (e) => {
    let gameID = ''
    if (e.target.tagName === 'SPAN') {
      gameID = e.target.parentElement.id
      console.log(gameID)
    } else {
      gameID = e.target.id
      console.log(gameID)
    }
    setCookie('gameid', gameID, { path: '/' });
    navigate('/lobby')
  }

  return (
    <div>
      <Title>Rejoindre une partie</Title>
      {
      infosLoading
      ?
      <Spin/>
      :
      <div>
        <Space>
        {
          infos?.map((info, index) => {
            return(<Button key={index} id={info?.gameID} onClick={onClickGame}>{info?.gameName}</Button>)
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

export default Join