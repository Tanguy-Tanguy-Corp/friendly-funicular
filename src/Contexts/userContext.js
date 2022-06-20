import { createContext } from 'react';

const UserContext = createContext({
  userID: null,
  userName: null,
  userGameIDs: null,
  userIsLoading: null
});

export { UserContext };