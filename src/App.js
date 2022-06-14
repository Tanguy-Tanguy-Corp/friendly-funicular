import React from 'react';
import { Home, GameBoard, GameCreation, Lobby } from './Pages';
import MainLayout from './Components/MainLayout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route exact path='lobby' element={<Lobby />} />
          <Route exact path='gameboard' element={<GameBoard />} />
          <Route exact path='creation' element={<GameCreation />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  )
}

export default App;
