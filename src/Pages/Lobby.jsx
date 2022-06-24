import React, { useEffect, useContext, useState } from "react";
import { SocketContext } from "../Contexts/socketIOContext";
import { PlayerCard } from "../Components";
import { useNavigate } from "react-router-dom";
import { Button, Spin, Typography, message } from 'antd'
import { useCookies } from 'react-cookie';
import styled from "styled-components";
import { useCallback } from "react";
import API from "../services/API";
const { Title } = Typography;

const CardDiv = styled.div`
  display: flex;
  justify-content: space-evenly;
`

const noPlaceWarning = () => {
  message.success('Coup validé')
}

const Lobby = () => {
  const socket = useContext(SocketContext)
  const [cookies] = useCookies(['gameid', 'player']);
  const [info, setInfo] = useState(null)
  const [infoLoading, setInfoLoading] = useState(true)
  const [refetchCount, setRefetchCount] = useState(0)
  let navigate = useNavigate();
  
  // Redirect to home, if necessary cookies are missing
  useEffect(() => {
    if (!cookies.player || !cookies.gameid) {
      navigate('/');
      return;
    }
  }, [cookies, navigate])

  const refetchInfo = () => {setRefetchCount(oldCount => oldCount + 1)}

  // Fetch game info
  useEffect(() => {
    API.get(`games/info/${cookies.gameid}`)
      .then(res => {
        setInfo(res.data)
        setInfoLoading(false)
      })
  }, [cookies.gameid, refetchCount])

  const playerJoin = useCallback(() => {
    setInfoLoading(true);
    if (info.remainingPlaces === 0) {
      noPlaceWarning();
      return;
    };
    API.put(`games/info/${cookies.gameid}`, {data: cookies.player})
      .then(res => {
        setInfo(res.data)
        setInfoLoading(false)
        socket.emit('playerJoin', {room: cookies.gameid})
      });
  },[cookies, info, socket]);

  const playerLeave = useCallback(() => {
    setInfoLoading(true);
    if (info.remainingPlaces === 0) {
      noPlaceWarning();
      return;
    };
    API.put(`games/info/${cookies.gameid}`, {data: cookies.player})
      .then(res => {
        setInfo(res.data)
        setInfoLoading(false)
        socket.emit('playerLeave', {room: cookies.gameid})
      });
  },[cookies, info, socket]);


  const onStart = () => {
    navigate('/game')
  }

  //Handle socket room
  useEffect(() => {
    // Join room (gameID)
    socket.emit('join', {room: cookies.gameid})

    // Leave room when lobby unmount
    return(() => {
      socket.emit('leave', {room: cookies.gameid})
    })
  }, [cookies.gameid, socket])

  const handleInfoUpdate = useCallback(() => {
    refetchInfo()
  }, [])

  // Subscribe to infoUpdate socket event
  useEffect(() => {
    socket.on('infoUpdate', handleInfoUpdate);
    return(() => {
      socket.off('infoUpdate', handleInfoUpdate)
    })
  }, [cookies.gameid, cookies.player, handleInfoUpdate, socket])

  return (
    <div>
      <Title>
        Lobby
      </Title>
      <div>
        <Title level={5}>
          {'Nom de la partie: '}{infoLoading ? <Spin /> : info?.gameName}
        </Title>
        <Title level={5}>
          {'Nombre de Joueurs: '}{infoLoading ? <Spin /> : info?.nbPlayers}
        </Title>
      </div>
      <CardDiv>
          {!infoLoading && info?.players?.map((player, index) => {
            return (<PlayerCard key={index} player={player} leave={playerLeave}/>)
          })}
      </CardDiv>
      <div>
        <Button type="primary" shape="round" size='large' loading={infoLoading} onClick={playerJoin}>
          Rejoinre la partie
        </Button>
        <Button type="primary" shape="round" size='large' loading={infoLoading} onClick={onStart}>
          Démarrer la partie
        </Button>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div>
          {'ID: '}{!infoLoading && info?.gameID}
        </div>
        <div>
          {'creatorID: '}{!infoLoading && info?.creatorID}
        </div>
      </div>
    </div>
  )
}

export default Lobby