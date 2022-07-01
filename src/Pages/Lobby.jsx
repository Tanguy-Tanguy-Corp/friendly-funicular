import React, { useEffect, useContext, useState, useCallback } from 'react';
import { SocketContext } from '../Contexts/socketIOContext';
import { PlayerCardView } from '../Components';
import { useNavigate } from 'react-router-dom';
import { Button, Spin, Typography } from 'antd';
import { useCookies } from 'react-cookie';
import styled from 'styled-components';
import API from '../services/API';
import { playerJoinMsg, playerLeaveMsg, errorMsg } from '../Helpers/lobbyMessages';
const { Title } = Typography;


// TODO: Create a components PlayersView
const CardsDiv = styled.div`
  display: flex;
  justify-content: space-evenly;
`

const Lobby = () => {
  const socket = useContext(SocketContext);
  let navigate = useNavigate();
  const [cookies] = useCookies(['gameId', 'playerId']);
  const [lobbyData, setLobbyData] = useState({})

  const [infos, setInfos] = useState(null);
  const [infosLoading, setInfosLoading] = useState(false);
  const [lobbyLoading, setLobbyLoading] = useState(false);
  const [startLoading, setStartLoading] = useState(false);
  const [isIn, setIsIn] = useState(false);
  const [refetchCounter, setRefetchCounter] = useState(0);


  // Refetch trigger, when called increment a state counter linked with useEffect dependencies to trigger a re-running
  const triggerRefetch = () => setRefetchCounter(oldCount => oldCount + 1);
  
  // Redirect to home, if game or player is undefined
  useEffect(() => {
    if (!cookies.playerId || !cookies.gameId) navigate('/');
    setLobbyData({ playerId: cookies.playerId, gameId: cookies.gameId })
  }, [cookies.playerId, cookies.gameId, navigate]);

  // Infos fetching
  useEffect(() => {
    setInfosLoading(true);
    API.get(`game/${cookies.gameId}`)
      .then(res => {
        const infos = res.data;
        const playerIds = infos.players.map(player => player.id);
        setInfos(infos);
        setIsIn(playerIds.includes(cookies.playerId));
      })
      .catch(err => errorMsg(err))
      .finally(() => setInfosLoading(false));
  }, [cookies.gameId, cookies.playerId, refetchCounter]);

  const joinGame = async () => {
    setLobbyLoading(true);
    API.put(`player/join`, lobbyData)
      .then(() => socket.emit('playerJoinEvent', lobbyData))
      .catch(err => errorMsg(err))
      .finally(() => setLobbyLoading(false));
  };

  const leaveGame = () => {
    setLobbyLoading(true);
    API.put(`player/leave`, lobbyData)
      .then(() => socket.emit('playerLeaveEvent', lobbyData))
      .catch(err => errorMsg(err))
      .finally(() => setLobbyLoading(false));
  };

  const startGame = () => {
    setStartLoading(true)
    API.post('play/start', lobbyData)
    .then(() => socket.emit('gameStartEvent', lobbyData))
    .catch(err => errorMsg(err))
    .finally(() => setStartLoading(false));
  };
  
  // TODO: implement kick function for game creator
  const kick = () => console.log('kick feature not implemented');

  // TODO: Dirty refactor, no function returns useCallback useful??? And handle player pseudo to show it on messages
  // On infoUpdate event, show informational message, and provoke gameInfo refetch
  const handleInfoUpdate = useCallback((message) => {
    console.log('infoUpdate SocketIO event', message);
    if (message.event === 'playerJoin') playerJoinMsg();
    if (message.event === 'playerLeave') playerLeaveMsg();
    if (message.event === 'gameStart') navigate('/game');
    triggerRefetch();
  }, [navigate]);

  // Subscribe to infoUpdate socket event, and join socket lobby room
  useEffect(() => {
    socket.emit('join', {room: `lobby-${cookies.gameId}`});
    socket.on('infoUpdate', handleInfoUpdate);
    return(() => {
      socket.emit('leave', {room: `lobby-${cookies.gameId}`});
      socket.off('infoUpdate', handleInfoUpdate);
    });
  }, [cookies.gameId, handleInfoUpdate, socket]);

  return (
    <div>
      <Title>
        Lobby {infosLoading && <Spin />}
      </Title>
      <div>
        <Title level={5}>
          {'Nom de la partie: '}{infos?.name}
        </Title>
        <Title level={5}>
          {'Nombre de places: '}{infos?.players?.length+'/'+infos?.nbPlayers}
        </Title>
      </div>
      <CardsDiv>
          {infos?.players?.map((player, index) => {
            return (<PlayerCardView isLoading={lobbyLoading} key={index} player={player} kick={kick}/>)
          })}
      </CardsDiv>
      <div>
        {
          !isIn
          ?
          <Button type='primary' shape='round' size='large' loading={lobbyLoading} onClick={joinGame}>
            Rejoinre la partie
          </Button>
          :
          <Button type='primary' shape='round' danger size='large' loading={lobbyLoading} onClick={leaveGame}>
            Quitter la partie
          </Button>
        }
        <Button type='primary' shape='round' size='large' disabled={infos?.creatorID !== cookies.playerId} loading={startLoading} onClick={startGame}>
          Démarrer la partie
        </Button>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div>
          {'ID: '}{infos?.id}
        </div>
        <div>
          {'creatorID: '}{infos?.creatorID}
        </div>
      </div>
    </div>
  )
}

export default Lobby