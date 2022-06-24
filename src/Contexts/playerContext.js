import { createContext } from 'react';

const PlayerContext = createContext({
  ID: null,
  pseudo: null,
  isLoading: null
});

export { PlayerContext };