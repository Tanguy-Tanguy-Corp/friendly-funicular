import React, { useCallback, useState } from 'react';
import { Button, Switch, Form, Input, Radio } from 'antd';

const backend_url = process.env.BACKEND_URL
console.log(backend_url)

const GameCreation = () => {

  const subToBackEnd = useCallback(async (gamename, nbPlayers, isPrivate, password) => {
    const resp = await fetch(
      `https://automatic-waffle.herokuapp.com/mongodb`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ database: 'ScrabbleClone', collection: 'games',Document:{ gamename, nbPlayers, isPrivate, password }})
      }
    )
    if (!resp.ok) {
      return setRepStatus(resp.status);
    }
    setRepStatus(resp.status)
  }, [])

  const onFinish = (values) => {
    console.log('Success:', values.name);
    subToBackEnd(values.name, values.nbPlayers, values.isPrivate, values.password)
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
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default GameCreation;