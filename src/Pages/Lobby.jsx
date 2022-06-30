import React, { useEffect, useContext, useState, useCallback } from "react";
import { SocketContext } from "../Contexts/socketIOContext";
import { PlayerCardView } from "../Components";
import { useNavigate } from "react-router-dom";
import { Button, Spin, Typography } from 'antd'
import { useCookies } from 'react-cookie';
import styled from "styled-components";
import API from "../services/API";
import { playerJoinMsg, playerLeaveMsg, errorMsg } from '../Helpers/lobbyMessages'
const { Title } = Typography;

const CardsDiv = styled.div`
  display: flex;
  justify-content: space-evenly;
`

const Lobby = () => {
  const socket = useContext(SocketContext)
  const [cookies] = useCookies(['gameId', 'playerId']);
  const [infos, setInfos] = useState(null)
  const [infosLoading, setInfosLoading] = useState(false)
  const [joinLoading, setJoinLoading] = useState(false)
  const [leaveLoading, setLeaveLoading] = useState(false)
  const [startLoading, setStartLoading] = useState(false)

  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const trigger = () => {setRefetchTrigger(oldCount => oldCount + 1)}
  const [isIn, setIsIn] = useState(false)
  let navigate = useNavigate();


  
  // Redirect to home, if necessary cookies are missing
  useEffect(() => {
    if (!cookies.playerId || !cookies.gameId) {
      navigate('/');
      return;
    }
  }, [cookies, navigate])

  // Fetch game info (refetch on infoUdate socket event)
  useEffect(() => {
    setInfosLoading(true)
    API.get(`game/${cookies.gameId}`)
      .then(res => {
        console.log('lobby infoDoc')
        console.log(res)
        setInfos(res.data)
        const playerIDs = res.data.players.map(player => player.id)
        setIsIn(playerIDs.includes(cookies.playerId))
        console.log(playerIDs)
      })
      .catch((err) => {
        errorMsg(err);
      })
      .finally(() => setInfosLoading(false))
  }, [cookies.gameId, cookies.playerId, refetchTrigger])

  const joinGame = async () => {
    setJoinLoading(true);
    API.put(`player/join`, { playerID: cookies.playerId, gameID: cookies.gameId })
      .then(() => {
        socket.emit('playerJoinEvent', {room: `lobby-${cookies.gameId}`, playerID: cookies.playerId})
      })
      .catch((err) => errorMsg(err))
      .finally(() => setJoinLoading(false))
  }


  const leaveGame = () => {
    setLeaveLoading(true);
    API.put(`player/leave`, { playerID: cookies.playerId, gameID: cookies.gameId })
      .then(() => {
        socket.emit('playerLeaveEvent', {room: `lobby-${cookies.gameId}`, playerID: cookies.playerId})
      })
      .catch((err) => errorMsg(err))
      .finally(() => setLeaveLoading(false))
  }


  const startGame = () => {
    // Emit a gameStart socket event to provoke the starting of the game
    setStartLoading(true)
    API.post('play/start', { gameID: cookies.gameId, playerID: cookies.playerId })
    .then(() => {
      socket.emit('gameStartEvent', {room: `lobby-${cookies.gameId}`})
      navigate('/game')
    })
    .catch((err) => errorMsg(err))
    .finally(() => setStartLoading(false))
  }

  // On infoUpdate event, show informational message, and provoke gameInfo refetch
  const handleInfoUpdate = useCallback((message) => {
    console.log('infoUpdate');
    if (message.event === 'playerJoin') {playerJoinMsg()};
    if (message.event === 'playerLeave') {playerLeaveMsg()};
    if (message.event === 'gameStart') {navigate('/game')};
    // Increment the refetch counter to provoke a game info refetch
    trigger()
  }, [navigate])

  // Subscribe to infoUpdate socket event, and join socket lobby room
  useEffect(() => {
    socket.emit('join', {room: `lobby-${cookies.gameId}`});
    socket.on('infoUpdate', handleInfoUpdate);
    return(() => {
      socket.emit('leave', {room: `lobby-${cookies.gameId}`});
      socket.off('infoUpdate', handleInfoUpdate);
    })
  }, [cookies.gameId, cookies.playerId, handleInfoUpdate, socket])

  // TODO: implement kick function for game creator
  const kick = () => {
    console.log('kick feature not implemented')
  }

  return (
    <div>
      <Title>
        Lobby
      </Title>
      <div>
        <Title level={5}>
          {'Nom de la partie: '}{infosLoading ? <Spin /> : infos?.name}
        </Title>
        <Title level={5}>
          {'Nombre de places: '}{infosLoading ? <Spin /> : infos?.players.length+"/"+infos?.nbPlayers}
        </Title>
      </div>
      <CardsDiv>
          {!infosLoading && infos?.players?.map((player, index) => {
            return (<PlayerCardView isLoading={leaveLoading} key={index} player={player} kick={kick}/>)
          })}
      </CardsDiv>
      <div>
        {
          !isIn
          ?
          <Button type="primary" shape="round" size='large' loading={joinLoading} onClick={joinGame}>
            Rejoinre la partie
          </Button>
          :
          <Button type="primary" shape="round" size='large' loading={leaveLoading} onClick={leaveGame}>
            Quitter la partie
          </Button>
        }
        <Button type="primary" shape="round" size='large' disabled={infos?.creatorID !== cookies.playerId} loading={startLoading} onClick={startGame}>
          Démarrer la partie
        </Button>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div>
          {'ID: '}{!infosLoading && infos?.id}
        </div>
        <div>
          {'creatorID: '}{!infosLoading && infos?.creatorID}
        </div>
      </div>
      <Button onClick={trigger}>Refresh</Button>
    </div>
  )
}

export default Lobby