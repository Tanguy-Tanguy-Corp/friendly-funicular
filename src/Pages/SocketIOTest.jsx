import React, { useContext, useState } from 'react';
import { SocketContext } from '../Contexts/socketIOContext';
import { Button, Input, Form, Typography, Space } from 'antd';
import { useEffect } from 'react';
import { useCallback } from 'react';

const { Title, Text } = Typography;

const SocketIOTest = () => {
  const socket = useContext(SocketContext);
  const [responses, setResponses] = useState([]);
  const [submitEvent, setSubmitEvent] = useState('')
  const [connectedRooms, setConnectedRooms] = useState([])
  //const [socketPingArr, setSocketPingArr] = useState([0])
  const [socketPing, setSocketPing] = useState(0)
  const [startPingTime, setStartPingTime] = useState((new Date()).getTime())

  const handleConnect = useCallback(() => {
    console.log('handleConnect')
    socket.emit('my_event', {data: "I'm connected!, " + socket.id});
  }, [socket]);

  const handlePong = useCallback(() => {
    console.log('handlePong')
    const latency = (new Date()).getTime() - startPingTime;
    //setSocketPingArr(oldArr => [...oldArr, latency])
    //setSocketPingArr(oldArr => oldArr.slice(-5))
    //let sum = 0;
    //for (let i=0; i< socketPingArr.length; i++) {
    //  sum += socketPingArr[i];
    //};
    setSocketPing(latency)
  }, [startPingTime]);

  const handleResponses = useCallback((msg, cb) => {
    console.log('handleResponses')
    setResponses(oldArray => [...oldArray, `Received #${msg.count}, ${msg.time}: ${msg.data}`]);
    if (cb) {cb()};
  }, []);

  const handleMyRooms = useCallback((data) => {
    console.log('handleMyRooms')
    setConnectedRooms(data.data);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setStartPingTime((new Date()).getTime())
      console.log(startPingTime)
      socket.emit('my_ping')
    }, 1000)
    return () => clearInterval(interval)
  }, [socket, startPingTime])

  useEffect(() => {
    socket.on('my_pong', handlePong);

    return(() => {
      socket.off('my_pong')
    })
  }, [handlePong, socket])

  useEffect(() => {
    console.log('init')
    socket.on('connect', handleConnect);
    socket.on('my_response', handleResponses);
    socket.on('my_rooms', handleMyRooms);
    //socket.emit('what_are_my_rooms');

    return (() => {
      socket.off('connect');
      socket.off('my_response');
      socket.off('my_rooms');
    })
  }, [socket, handleConnect, handleResponses, handleMyRooms])


  const onSubmit = (values) => {
    console.log(values);
    socket.emit(submitEvent, {data: values.message});
    console.log(socket);
  }

  const onRoom = (values) => {
    console.log(values)
    socket.emit(submitEvent, {room: values.roomName});
    socket.emit('what_are_my_rooms')
    console.log(socket);
  }

  return (
    <>
      <Title>SocketIO Test</Title>
      <Title level={5}>SocketIO Ping</Title>
      <Text>{socketPing + 'ms'}</Text>
      <Title level={3}>Actions</Title>
      <Title level={4}>Envoyer message</Title>
      <Form name='emit-form' labelCol={{ span: 4 }} wrapperCol={{ span: 4 }} onFinish={onSubmit}>
        <Form.Item  label='Message' name='message' rules={[{ required: true, message: 'Le message est vide!'}]}>
          <Input/>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 4, span: 4 }}>
          <Space>
            <Button name='emitSub' type="primary" htmlType="submit" onClick={() => setSubmitEvent('my_event')}>
              Emit
            </Button>
            <Button name='broadcastSub' type="primary" htmlType="submit" onClick={() => setSubmitEvent('my_broadcast_event')}>
              Broadcast
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <Title level={4}>Rejoindre/Quitter une room</Title>
      <Text>{connectedRooms.toString()}</Text>
      <Form name='room-form' labelCol={{ span: 4 }} wrapperCol={{ span: 4 }} onFinish={onRoom}>
        <Form.Item  label='Room' name='roomName' rules={[{ required: true, message: 'Veuillez indiquer un nom de room'}]}>
          <Input/>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 4, span: 4 }}>
          <Space>
            <Button name='joinSub' type="primary" htmlType="submit" onClick={() => setSubmitEvent('join')}>
              Rejoindre
            </Button>
            <Button name='leaveSub' type="primary" htmlType="submit" onClick={() => setSubmitEvent('leave')}>
              Quitter
            </Button>
          </Space>
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