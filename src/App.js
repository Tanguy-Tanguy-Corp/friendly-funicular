import React, { useEffect, useState } from 'react';
import { Home, Game, Create, Lobby, Select, SocketIOTest } from './Pages';
import MainLayout from './Layouts/MainLayout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SocketContext, socket } from './Contexts/socketIOContext'
import { PlayerContext } from './Contexts/playerContext';
import { useCookies } from 'react-cookie';
import API from './services/API';
import './css/App.css'

function App() {
  const [cookies] = useCookies(['playerId']);
  const [player, setPlayer] = useState(null);
  const [playerIsLoading, setPlayerIsLoading] = useState(false);

  useEffect(() => {
    if (cookies.playerId) {
      console.log('Player context updating');
      setPlayerIsLoading(true);
      API.get(`player/${cookies.playerId}`)
      .then(res => {
        const player = res.data;
        setPlayer(player);
      })
      .catch(err => console.log(err))
      .finally(() => setPlayerIsLoading(false));
    } else {
      console.log('Player context emptying');
      setPlayer(null);
    }
  }, [cookies.playerId]);

  return (
    <SocketContext.Provider value={ socket }>
      <PlayerContext.Provider value={{ ID: player?.id, pseudo: player?.pseudo, isLoading: playerIsLoading }}>
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route exact path='/' element={<Home />} />
            <Route exact path='lobby' element={<Lobby />} />
            <Route exact path='select' element={<Select />} />
            <Route exact path='game' element={<Game />} />
            <Route exact path='create' element={<Create />} />
            <Route exact path='socket' element={<SocketIOTest />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
      </PlayerContext.Provider>
    </SocketContext.Provider>
  );
};

export default App;
