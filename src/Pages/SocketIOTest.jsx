import React, { useContext, useState } from 'react';
import { SocketContext } from '../Contexts/socketIOContext';
import { Button, Input, Form, Typography } from 'antd';
import { useEffect } from 'react';

const { Title, Text } = Typography;

const SocketIOTest = () => {
  const socket = useContext(SocketContext);
  const [responses, setResponses] = useState(['test','prout1']);

  useEffect(() => {
    const response_listener = (msg, cb) => {
      setResponses(oldArray => [...oldArray, `Received #${msg.count}: ${msg.data}`])
      console.log(responses)
      if (cb) {cb()};
    };
    const connect_listener = () => {
      socket.emit('my_event', {data: "I'm connected!"})
    };

    socket.on('connect', connect_listener);
    socket.on('my_response', response_listener);

    return (() => {
      socket.off('my_response', response_listener);
      socket.off('connect', connect_listener);
    })
  }, [responses, socket])

  const emit = (values) => {
    console.log(values)
    socket.emit('my_event', {data: values.messageEmit});
  }

  const broadcast = (values) => {
    console.log(values)
    socket.emit('my_broadcast_event', {data: values.messageBroadcast});
  }

  return (
    <>
      <Title>SocketIO Test</Title>
      <Title level={3}>Actions</Title>
      <Form name='emit-form' labelCol={{ span: 4 }} wrapperCol={{ span: 4 }} onFinish={emit}>
        <Form.Item  label='Message to emit' name='messageEmit'>
          <Input/>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Emit
          </Button>
        </Form.Item>
      </Form>
      <Form name='broadcast-form' labelCol={{ span: 4 }} wrapperCol={{ span: 4 }} onFinish={broadcast}>
        <Form.Item  label='Message to broadcast' name='messageBroadcast'>
          <Input/>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Broadcast
          </Button>
        </Form.Item>
      </Form>
      <div className='responses'>
        <Title level={3}>Message Log</Title>
        {responses.map((response,key) => {
          return(
            <div key={key}>
            <Text key={key}>
              {response}
            </Text>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default SocketIOTest