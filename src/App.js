import React, { useCallback, useEffect, useState } from 'react';
import { Home, Game, Create, Lobby, Join, SocketIOTest } from './Pages';
import MainLayout from './Layouts/MainLayout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import { SocketContext, socket } from './Contexts/socketIOContext'
import { PlayerContext } from './Contexts/playerContext';
import { useCookies } from 'react-cookie';

const backendURL = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_DEV_BACKEND_URL : process.env.REACT_APP_PROD_BACKEND_URL;

function App() {
  const [cookies] = useCookies(['player'])
  const [playerID, setPlayerID] = useState(null)
  const [pseudo, setPseudo] = useState(null)
  const [playerIsLoading, setPlayerIsLoading] = useState(false)

  const fetchUser = useCallback(async(playerID) => {
    setPlayerIsLoading(true)
      const response = await fetch(`${backendURL}/players/${playerID}`)
      const player = await response.json().then(setPlayerIsLoading(false))
      console.log('fetchUser')
      console.log(player)
      return player
  }, [])

  useEffect(() => {
    if (cookies.player) {
      console.log('update user context')
      fetchUser(cookies.player).then(player => {
        setPlayerID(player.ID)
        setPseudo(player.pseudo)
      })
    } else {
      console.log('remove user context')
      setPlayerID(null)
      setPseudo(null)
    }
  }, [cookies.player, fetchUser])

  return (
    <SocketContext.Provider value={ socket }>
      <PlayerContext.Provider value={{ ID: playerID, pseudo: pseudo, isLoading: playerIsLoading }}>
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route exact path='/' element={<Home />} />
            <Route exact path='lobby' element={<Lobby />} />
            <Route exact path='join' element={<Join />} />
            <Route exact path='game' element={<Game />} />
            <Route exact path='create' element={<Create />} />
            <Route exact path='socket' element={<SocketIOTest />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
      </PlayerContext.Provider>
    </SocketContext.Provider>
  )
}

export default App;
