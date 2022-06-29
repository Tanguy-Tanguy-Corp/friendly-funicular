import React, { useState, useCallback } from 'react';
import { Button, Card, Form, Input, Spin } from 'antd';
import styled from 'styled-components';
import { useCookies } from 'react-cookie';
import { useEffect } from 'react';
import API from '../services/API';

const CardDiv = styled.div`
display: flex;
justify-content: space-evenly;
`
const PlayerCreateCard = () => {

  const [playerLoading, setPlayerLoading] = useState(false)
  const [player, setPlayer] = useState(null)
  const [cookies, setCookie, removeCookie] = useCookies(['player'])

  const createDeletePlayer = useCallback(async(values) => {
    setPlayerLoading(true)
    if (cookies.player) {
      API.delete(`player/${cookies.player}`)
      .then(() => {
        console.log('deletePlayer');
        removeCookie('player', { path: '/' });
        setPlayer(null);
      })
      .catch((err) => console.log(err))
      .finally(() => setPlayerLoading(false))
    } else {
      API.post(`player`, { pseudo: values.pseudo }).then(res => {
        console.log('createPlayer');
        setPlayer(res.data);
        setCookie('player', res.data.id, { path: '/' });
      })
      .catch((err) => console.log(err))
      .finally(() => setPlayerLoading(false))
    };
  }, [cookies.player, removeCookie, setCookie]);

  // If player already exists, fetch it
  useEffect(() => {
    if (cookies.player) {
      setPlayerLoading(true)
      API.get(`player/${cookies.player}`).then(res => {
        console.log('get player')
        setPlayer(res.data)
      })
      .catch((err) => console.log(err))
      .finally(() => setPlayerLoading(false))
    }
  // No need to re-render when player has been created => no dependency
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <CardDiv>
      <Card style={{ width: 300 }}>
        <Form onFinish={createDeletePlayer}>
          {
            !cookies.player
            ?
            <Form.Item label='Pseudo' name='pseudo' rules={[{ required: true, message: 'Veuillez entrer votre pseudo'}]}>
              <Input/>
            </Form.Item>
            :
            <>
              <div>
                {'Pseudo: '}{playerLoading ? <Spin /> : player?.pseudo}
              </div>
              <div>
                {'ID: '}{playerLoading ? <Spin /> : player?.id}
              </div>
            </>
          }
          <Button type="primary" danger={cookies.player} loading={playerLoading} htmlType="submit">
            {cookies.player ? 'Supprimer Pseudo' : 'Creér Pseudo'}
          </Button>
        </Form>
      </Card>
    </CardDiv>
  )
}

export default PlayerCreateCard