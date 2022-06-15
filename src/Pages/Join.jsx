import React from 'react'
import { Button, Input, Form, Typography } from 'antd';
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';

const { Title } = Typography;

const Join = () => {
  let navigate = useNavigate()
  const [cookies, setCookie] = useCookies(['gameid']);

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
      <div>Game Test ID: eb90f21f-8ccb-44a7-a1db-f603f33a168a</div>
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