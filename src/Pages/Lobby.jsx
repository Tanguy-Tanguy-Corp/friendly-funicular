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
  const [cookies] = useCookies(['gameid', 'player']);
  const [gameInfo, setGameInfo] = useState(null)
  const [gameInfoLoading, setGameInfoLoading] = useState(false)
  const [joinLoading, setJoinLoading] = useState(false)
  const [leaveLoading, setLeaveLoading] = useState(false)
  const [startLoading, setStartLoading] = useState(false)

  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const trigger = () => {setRefetchTrigger(oldCount => oldCount + 1)}
  const [isIn, setIsIn] = useState(false)
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
        const playerIDs = res.data.players.map(player => player.id)
        setIsIn(playerIDs.includes(cookies.player))
        console.log(playerIDs)
      })
      .catch((err) => {
        errorMsg(err);
      })
      .finally(() => setGameInfoLoading(false))
  }, [cookies.gameid, cookies.player, refetchTrigger])

  const joinGame = async () => {
    setJoinLoading(true);
    API.put(`player/join`, { playerID: cookies.player, gameID: cookies.gameid })
      .then(() => {
        socket.emit('playerJoinEvent', {room: `lobby-${cookies.gameid}`, playerID: cookies.player})
      })
      .catch((err) => {
        errorMsg(err);
      })
      .finally(() => setJoinLoading(false))
  }

  const leaveGame =() => {
    setLeaveLoading(true);
    API.put(`player/leave`, { playerID: cookies.player, gameID: cookies.gameid })
      .then(() => {
        socket.emit('playerLeaveEvent', {room: `lobby-${cookies.gameid}`, playerID: cookies.player})
      })
      .catch((err) => {
        errorMsg(err);
      })
      .finally(() => setLeaveLoading(false))
  }


  const startGame = () => {
    // Emit a gameStart socket event to provoke the starting of the game
    setStartLoading(true)
    API.post('play/start', { gameID: cookies.gameid, playerID: cookies.player })
    .then(() => {
      socket.emit('gameStartEvent', {room: `lobby-${cookies.gameid}`})
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
    socket.emit('join', {room: `lobby-${cookies.gameid}`});
    socket.on('infoUpdate', handleInfoUpdate);
    return(() => {
      socket.emit('leave', {room: `lobby-${cookies.gameid}`});
      socket.off('infoUpdate', handleInfoUpdate);
    })
  }, [cookies.gameid, cookies.player, handleInfoUpdate, socket])

  // TODO: implement kick function
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
          {'Nom de la partie: '}{gameInfoLoading ? <Spin /> : gameInfo?.name}
        </Title>
        <Title level={5}>
          {'Nombre de Joueurs: '}{gameInfoLoading ? <Spin /> : gameInfo?.nbPlayers}
        </Title>
      </div>
      <CardsDiv>
          {!gameInfoLoading && gameInfo?.players?.map((player, index) => {
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
        <Button type="primary" shape="round" size='large' disabled={gameInfo?.creatorID !== cookies.player} loading={startLoading} onClick={startGame}>
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