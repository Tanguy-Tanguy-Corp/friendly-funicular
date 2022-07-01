import React, { useState, useEffect, useContext, useCallback } from 'react';
import { SocketContext } from '../Contexts/socketIOContext';
import { Grid, Rack, GameInfoView } from '../Components';
import { useCookies } from 'react-cookie';
import { submitMoveMsg, validMoveMsg, illegalMoveMsg, myTurnMsg, notYourTurnMsg, lockedTileMsg, noChangesMsg, unexpectedErrorMsg } from '../Helpers/gameMessages';
import { useNavigate } from 'react-router-dom';
import API from '../services/API';

// TODO: Add shuffle tiles feature
// TODO: Need to redirect to lobby if game unstarted or finished

const Game = () => {
  const socket = useContext(SocketContext);
  let navigate = useNavigate();
  const [cookies] = useCookies(['gameId', 'playerId']);

  const [tiles, setTiles] = useState([]);
  const [tilesLoading, setTilesLoading] = useState(false);
  const [infos, setInfos] = useState(null);
  const [infosLoading, setInfosLoading] = useState(false);

  const [oldTiles, setOldTiles] = useState(null);
  const [selectedTile, setSelectedTile] = useState(null);
  const [rackTiles, setRackTiles] = useState([]);
  const [boardTiles, setBoardTiles] = useState([]);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [refetchCounter, setRefetchCounter] = useState(0);

  // Refetch trigger, when called increment a state counter linked with useEffect dependencies to trigger a re-running
  const triggerRefetch = () => setRefetchCounter(oldCount => oldCount + 1);

  // Redirect to home, if game or player is undefined
  useEffect(() => {
    if (!cookies.playerId || !cookies.gameId) navigate('/');
  }, [cookies, navigate]);

  // Handle gameUpdate socketIO events
  const handleGameUpdate = useCallback((message) => {
    console.log('gameUpdate SocketIO event', message);
    triggerRefetch();
  }, []);

  // Subscribe to socketIO events, and join game room, (unsubscribe, leave, on component unmounting)
  useEffect(() => {
    socket.emit('close_room', {room: `lobby-${cookies.gameId}`});
    socket.emit('join', {room: `game-${cookies.gameId}`});
    socket.on('gameUpdate', handleGameUpdate);
    return(() => {
      socket.emit('leave', {room: `game-${cookies.gameId}`});
      socket.off('gameUpdate', handleGameUpdate);
    });
  }, [cookies.gameId, handleGameUpdate, socket]);

  // Infos Fetching
  useEffect(() => {
    setInfosLoading(true);
    API.get(`game/${cookies.gameId}`)
    .then(res => {
      const infos = res.data;
      setInfos(infos);
      if (infos.turnPlayerId === cookies.playerId) {
        setIsMyTurn(true);
        myTurnMsg();
      } else {
        setIsMyTurn(false);
      };
    })
    .catch(err => unexpectedErrorMsg(err))
    .finally(() => setInfosLoading(false));
  }, [cookies.gameId, cookies.playerId, refetchCounter]);

  // Tiles Fecthing
  useEffect(() => {
    setTilesLoading(true);
    API.get(`tile/${cookies.gameId}/${cookies.playerId}`)
    .then(res => {
      const data = res.data;
      const rack = data.rack.tiles;
      const board = data.board;
      setTiles(board.concat(rack));
      setOldTiles(board.concat(rack));
    })
    .catch(err => unexpectedErrorMsg(err))
    .finally(() => setTilesLoading(false));
  }, [cookies.gameId, cookies.playerId, refetchCounter]);

  // Separate rack and board tiles
  useEffect(() => {
    setRackTiles(tiles.filter(tile => (tile.location.place === 'rack')));
    setBoardTiles(tiles.filter(tile => (tile.location.place === 'board')));
  }, [tiles]);

  // Tiles DOM handling
  useEffect(() => {
    const clickTile = (event) => {
      // Avoid propagation to parent target
      event.stopPropagation();
      console.log('clickTile')
      // If not player turn, block any moves and notify player
      if (!isMyTurn) {
        notYourTurnMsg();
        return;
      };

      const tileId = event.target.id;
      const tile = tiles.find(tile => tile.id === tileId);

      // If tile is locked, block its selection and notify player
      if (tile.isLocked) {
        lockedTileMsg();
        return;
      };

      // TODO: Too much, refactoring probably possible
      const newTiles = tiles.map(tile => {
        if (tile.id === tileId) {
          if (!tile.isSelected) {
            setSelectedTile(tile);
            return { ...tile, isSelected: true };
          } else {
            setSelectedTile(null);
            return { ...tile, isSelected: false};
          }
        } else {
          return { ...tile, isSelected: false};
        };
      });
      setTiles(newTiles);
    };
    
    // Add event listeners to tiles
    const DOMtiles = document.querySelectorAll('.tile');
    DOMtiles.forEach(DOMtile => DOMtile.addEventListener('click', clickTile));

    // Remove event listeners on unmounting to avoid duplication
    return(() => {
      DOMtiles.forEach(DOMtile => DOMtile.removeEventListener('click', clickTile));
    });
  },[tiles, selectedTile, isMyTurn]);


  // Cells DOM handling
  useEffect(() => {
    const clickCell = (event) => {
      // Avoid propagation to parent target
      event.stopPropagation();

      // TODO: posssible to create tiny turn checking function
      // If not player turn, block any moves and notify player
      if (!isMyTurn) {
        notYourTurnMsg();
        return;
      };

      // If no tile selected, do nothing
      if (selectedTile === null) {
        console.log('no tile selected');
        return;
      };
      console.dir(event.target)
      const place = event.target.dataset.place;
      const cellX = parseInt(event.target.getAttribute('x'));
      const cellY = parseInt(event.target.getAttribute('y'));
      const pos = parseInt(event.target.dataset.pos);
      const cellTileId = event.target.dataset.tileid;
      const isCellEmpty = cellTileId == null;

      // TODO: Dirty, refactor ?
      const location = place === 'rack' ? {place:'rack', coords: pos} : {place: 'board', coords: [cellX, cellY]};

      if (isCellEmpty) {
        moveTile(location);
      } else {
        switchTile(location, cellTileId);
      };
      setSelectedTile(null);
    };

    const moveTile = (location) => {
      console.log('moveTile');
      const newTiles = tiles.map(tile => {
        if (tile.id === selectedTile.id) {
          return { ...tile, isSelected: false, location: location};
        };
        return tile;
      });
      setTiles(newTiles);
    };

    // TODO: remove case of switching tile with itself
    const switchTile = (location, cellTileId) => {
      console.log('switchTile');
      const newTiles = tiles.map(tile => {
        if (tile.id === selectedTile.id) {
          return { ...tile, isSelected: false, location: location};
        };
        if (tile.id === cellTileId) {
          return { ...tile, isSelected: false, location: selectedTile.location};
        };
        return tile;
      })
      setTiles(newTiles);
    };

    // Add event listeners to cells
    const DOMcells = document.querySelectorAll('.cell');
    DOMcells.forEach(DOMcell => DOMcell.addEventListener('click', clickCell));
    
    // Remove event listeners to avoid duplication
    return(() => DOMcells.forEach(DOMcell => DOMcell.removeEventListener('click', clickCell)));
  },[isMyTurn, selectedTile, tiles]);

  const resetMoves = () => {
    // If not player turn, block reset function and notify player
    if (!isMyTurn) {
      notYourTurnMsg();
      return;
    };

    // If no moves have been made, block reset function and notify player
    if(tiles === oldTiles) {
      noChangesMsg();
      return;
    }

    setTiles(oldTiles);
  };

  
  const submitMoves = () => {
    // If not player turn, block move submission and notify player
    if (!isMyTurn) {
      notYourTurnMsg();
      return;
    };

     // If no moves have been made, block move submission and notify player
    if(tiles === oldTiles) {
      noChangesMsg();
      return;
    }
  
    // TODO: notify move submission and validation or invalidation to any player by socketIO events
    setTilesLoading(true);
    submitMoveMsg();
    API.put('play/submit', {
      playerId: cookies.playerId,
      gameId: cookies.gameId,
      board: boardTiles,
      rack: rackTiles
    })
    .then(res => {
      console.log(res);
      socket.emit('moveSubmitEvent', {room: `game-${cookies.gameId}`, playerId: cookies.playerId});
      validMoveMsg();
    })
    .catch(err => {
      console.log(err);
      illegalMoveMsg(err.response.data?.errMsg);
    })
    .finally(() => setTilesLoading(false));
  };

  return (
    <div className='Game'>
      <div className='gamearea'>
        <GameInfoView gameInfos={infos} isLoading={infosLoading} />
        <Grid size={infos?.gridSize} tiles={boardTiles} />
        <Rack size={infos?.tilesPerRack} tiles={rackTiles} onReset={resetMoves} onSubmit={submitMoves} isLoading={tilesLoading} />
      </div>
      <div style={{ textAlign: 'right' }}>
        <div>
          {'ID: '}{!infosLoading && infos?.id}
        </div>
        <div>
          {'creatorID: '}{!infosLoading && infos?.creatorID}
        </div>
      </div>
    </div>
  );
};

export default Game;