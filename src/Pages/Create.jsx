import React, { useCallback, useState } from 'react';
import { Button, Switch, Form, Input, Radio, Typography } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

const formItemLayout = {labelCol: { xs: { span: 24 }, sm: { span: 4 }},wrapperCol: { xs: { span: 24 }, sm: { span: 20 }}};
const formItemLayoutWithOutLabel = {wrapperCol: {xs: {span: 24, offset: 0}, sm: {span: 20, offset: 4}}};

const backendURL = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_DEV_BACKEND_URL : process.env.REACT_APP_PROD_BACKEND_URL
console.log(`l'url backend utilisé est: ${backendURL}`)
const databaseName = process.env.NODE_ENV === 'development' ? 'Development' : 'Production'
console.log(`la base de données utilisé est: ${databaseName}`)

const Create = () => {
  let navigate = useNavigate()
  const [cookies, setCookie] = useCookies(['gameid']);

  const subToBackEnd = useCallback(async (gamename, nbPlayers, isPrivate, password) => {
    const gameID =  uuidv4()
    const resp = await fetch(
      `${backendURL}/games/create`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ database: databaseName, collection: 'games', Document:{ gameID, gamename, nbPlayers, isPrivate, password }})
      }
    )
    if (!resp.ok) {
      return setRepStatus(`Error ${resp.status}, Game creation failed`);
    }
    setRepStatus(`Game creation succeed, gameID: ${gameID}`)
    return gameID
  }, [])

  const onFinish = async (values) => {
    console.log('Success:', values.name);
    const gameID = await subToBackEnd(values.name, values.nbPlayers, values.isPrivate, values.password)
    setCookie('gameid', gameID, { path: '/' });
    navigate('/game')
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const [isPrivate, setIsPrivate] = useState(false)
  const [repStatus, setRepStatus] = useState('waiting for submission')

  const onPrivateChange = (checked) => {
    setIsPrivate(checked)
  }

  return (
    <div>
      <Title>Créer une nouvelle partie</Title>
      <div>{repStatus}</div>
        <Form name="basic" labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} initialValues={{ remember: true }} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
          <Form.Item label="Game Name" name="name" rules={ [{ required: true, message: 'Please input a game name!' }] }>
            <Input />
          </Form.Item>
          <Form.Item label="Number of players" name="nbPlayers" rules={[{ required: true, message: 'Please select a number of players'}]}>
            <Radio.Group>
              <Radio.Button value="2">2</Radio.Button>
              <Radio.Button value="3">3</Radio.Button>
              <Radio.Button value="4">4</Radio.Button>
          </Radio.Group>
          </Form.Item>
          <Form.Item label='Private' name="isPrivate" valuePropName="checked" wrapperCol={{ offset: 0, span: 16 }}>
            <Switch onChange={onPrivateChange}/>
          </Form.Item>
          {isPrivate && <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input a game password!' }]}>
            <Input.Password/>
          </Form.Item>}
        <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Créer
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Create;