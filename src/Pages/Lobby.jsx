import React, { useEffect, useContext, useState, useCallback } from "react";
import { SocketContext } from "../Contexts/socketIOContext";
import { PlayerCard } from "../Components";
import { useNavigate } from "react-router-dom";
import { Button, Spin, Typography } from 'antd'
import { useCookies } from 'react-cookie';
import styled from "styled-components";
import API from "../services/API";
import { playerJoinMsg, playerLeaveMsg, noPlaceMsg } from '../Helpers/lobbyMessages'
const { Title } = Typography;

const CardsDiv = styled.div`
  display: flex;
  justify-content: space-evenly;
`

const Lobby = () => {
  const socket = useContext(SocketContext)
  const [cookies] = useCookies(['gameid', 'player']);
  const [gameInfo, setGameInfo] = useState(null)
  const [gameInfoLoading, setGameInfoLoading] = useState(true)

  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const trigger = () => {setRefetchTrigger(oldCount => oldCount + 1)}
  //const [isIn, setIsIn] = useState(false)
  let navigate = useNavigate();


  
  // Redirect to home, if necessary cookies are missing
  useEffect(() => {
    if (!cookies.player || !cookies.gameid) {
      navigate('/');
      return;
    }
  }, [cookies, navigate])

  // Fetch game info (refetch on infoUdate socket event)
  useEffect(() => {
    setGameInfoLoading(true)
    API.get(`game/${cookies.gameid}`)
      .then(res => {
        console.log('lobby infoDoc')
        console.log(res)
        setGameInfo(res.data)
        setGameInfoLoading(false)
      })
  }, [cookies.gameid, refetchTrigger])

  const join = useCallback(() => {
    setGameInfoLoading(true);
    if (gameInfo.remainingPlaces === 0) {
      noPlaceMsg();
      return;
    };
    API.put(`player/join/`, { playerID: cookies.player, gameID: cookies.gameid })
      .then(socket.emit('playerJoin', {room: cookies.gameid}));
  },[cookies, gameInfo, socket]);

  const leave = useCallback(() => {
    setGameInfoLoading(true);
    API.put(`player/leave/`, { playerID: cookies.player, gameID: cookies.gameid })
      .then(socket.emit('playerLeave', {room: cookies.gameid}));
  },[cookies, socket]);


  const onStart = () => {
    // Emit a gameStart socket event to provoke the starting of the game
    socket.emit('gameStart', {room: cookies.gameid})
    navigate('/game')
  }

  // Log my_response events
  const handleResponses = useCallback((msg, cb) => {
    console.log(`Received #${msg.count}, ${msg.time}: ${msg.data}`)
    if (cb) {cb()};
  }, []);

  // On infoUpdate event, show informational message, and provoke gameInfo refetch
  const handleInfoUpdate = useCallback((message) => {
    console.log('infoUpdate');
    if (message.event === 'playerJoin') {playerJoinMsg()};
    if (message.event === 'playerLeave') {playerLeaveMsg()};
    // Increment the refetch counter to provoke a game info refetch
    trigger()
  }, [])

  // Subscribe to infoUpdate socket event, and join socket game room
  useEffect(() => {
    socket.emit('join', {room: `lobby-${cookies.gameid}`});
    socket.on('infoUpdate', handleInfoUpdate);
    socket.on('my_response', handleResponses);
    return(() => {
      socket.emit('leave', {room: `lobby-${cookies.gameid}`});
      socket.off('infoUpdate', handleInfoUpdate);
      socket.off('my_response', handleResponses);
    })
  }, [cookies.gameid, cookies.player, handleInfoUpdate, handleResponses, socket])

  return (
    <div>
      <Title>
        Lobby
      </Title>
      <div>
        <Title level={5}>
          {'Nom de la partie: '}{gameInfoLoading ? <Spin /> : gameInfo?.name}
        </Title>
        <Title level={5}>
          {'Nombre de Joueurs: '}{gameInfoLoading ? <Spin /> : gameInfo?.nbPlayers}
        </Title>
      </div>
      <CardsDiv>
          {!gameInfoLoading && gameInfo?.players?.map((player, index) => {
            return (<PlayerCard isLoading={gameInfoLoading} key={index} player={player} leave={leave}/>)
          })}
      </CardsDiv>
      <div>
        <Button type="primary" shape="round" size='large' loading={gameInfoLoading} onClick={join}>
          Rejoinre la partie
        </Button>
        <Button type="primary" shape="round" size='large' loading={gameInfoLoading} onClick={onStart}>
          Démarrer la partie
        </Button>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div>
          {'ID: '}{!gameInfoLoading && gameInfo?.id}
        </div>
        <div>
          {'creatorID: '}{!gameInfoLoading && gameInfo?.creatorID}
        </div>
      </div>
      <Button onClick={trigger}>Refresh</Button>
    </div>
  )
}

export default Lobby