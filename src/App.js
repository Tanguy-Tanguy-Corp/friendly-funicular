import React from 'react';
import { Home, Game, Create, Lobby, Join, SocketIOTest } from './Pages';
import MainLayout from './Layouts/MainLayout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import { SocketContext, socket } from './Contexts/socketIOContext'

function App() {
  return (
    <SocketContext.Provider value={ socket }>
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
    </SocketContext.Provider>
  )
}

export default App;
