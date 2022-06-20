import React, { useEffect, useState } from 'react';
import { Home, Game, Create, Lobby, Join, SocketIOTest } from './Pages';
import MainLayout from './Layouts/MainLayout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import { SocketContext, socket } from './Contexts/socketIOContext'
import { UserContext } from './Contexts/userContext';
import { useCookies } from 'react-cookie';
import { v4 as uuidv4 } from 'uuid';

const backendURL = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_DEV_BACKEND_URL : process.env.REACT_APP_PROD_BACKEND_URL;
const databaseName = process.env.NODE_ENV === 'development' ? 'Development' : 'Production';

function App() {
  const [cookies, setCookies] = useCookies(['user'])
  const [userID, setUserID] = useState(null)
  const [userName, setUserName] = useState(null)
  const [userGameIDs, setUserGameIDs] = useState(null)
  const [userIsLoading, setUserIsLoading] = useState(false)

  useEffect(() => {
    const fetchUser = async (userID) => {
      setUserIsLoading(true)
      const response = await fetch(
        `${backendURL}/users/get`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({database: databaseName, Filter: {userID: userID}})
        }
      )
      const user = await response.json().then(setUserIsLoading(false))
      console.log('fetchUser' + user)
      console.log(user)
      return user
    }

    const createUser = async () => {
      setUserIsLoading(true)
      const userID = uuidv4()
      const response = await fetch(
        `${backendURL}/users/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({database: databaseName, Document:{ userID }})
        }
      )
      const user = await response.json().then(setUserIsLoading(false))
      console.log('createUser' + user)
      console.log(user)
      return userID
    }

    if (cookies.user) {
      fetchUser(cookies.user).then(user => {
        setUserID(cookies.user)
        setUserName(user.userName)
        setUserGameIDs(user.userGameIDs)
      })
    } else {
      createUser().then(userID => {
        setUserID(userID)
        setCookies('user', userID, { path: '/' });
      })
    }
  }, [cookies.user, setCookies])

  return (
    <SocketContext.Provider value={ socket }>
      <UserContext.Provider value={{ userID, userName, userGameIDs, userIsLoading }}>
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
      </UserContext.Provider>
    </SocketContext.Provider>
  )
}

export default App;
