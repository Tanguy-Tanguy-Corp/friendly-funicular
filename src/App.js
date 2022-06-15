import React from 'react';
import { Home, Game, Create, Lobby, Join } from './Pages';
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
          <Route exact path='join' element={<Join />} />
          <Route exact path='game' element={<Game />} />
          <Route exact path='create' element={<Create />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  )
}

export default App;
