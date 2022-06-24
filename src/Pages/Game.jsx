import React, { useState, useEffect, useContext } from "react";
import { SocketContext } from "../Contexts/socketIOContext";
import { Grid, Rack } from "../Components";
import GameInfo from "../Components/GameInfo";
import { useCookies } from 'react-cookie';
import { submitMove, validMove, illegalMove, yourTurn, notYourTurn, lockedTile, noChanges } from '../Helpers/gameMessages'
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/API";



const GRIDSIZE = 8;
const RACKSIZE = 7;

const Game = () => {

  const socket = useContext(SocketContext);
  let navigate = useNavigate();
  
  const [cookies] = useCookies(['gameid', 'player']);

  // Redirect to home, if necessary cookies are missing
  useEffect(() => {
    if (!cookies.player || !cookies.gameid) {
      navigate('/')
    }
  }, [cookies, navigate])

  const [isLoading, setIsLoading] = useState(false)
  const [tiles, setTiles] = useState(null);
  const [oldTiles, setOldTiles] = useState(null);
  const [selectedTile, setSelectedTile] = useState(null);
  const [rackTiles, setRackTiles] = useState([]);
  const [boardTiles, setBoardTiles] = useState([]);
  const [isMyTurn, setIsMyTurn] = useState(true)

  const handleMyTurn = useCallback((data) => {
    setIsMyTurn(data.isMyTurn);
    yourTurn();
  }, [])

  useEffect(() => {
    socket.on('gameUpdate', handleMyTurn);
    return(() => {
      socket.off('gameUpdate');
    });
  }, [handleMyTurn, socket]);

  //Handle socket room
  useEffect(() => {
    // Join room (gameID)
    socket.emit('join', {room: cookies.gameid})

    // Leave room when lobby unmount
    return(() => {
      socket.emit('leave', {room: cookies.gameid})
    })
  }, [cookies.gameid, socket])

  // Get the intital tiles from the database
  useEffect(() => {
    setIsLoading(true)
    API.get(`games/${cookies.gameid}`).then(res => {
      const game = res.data;
      setTiles(game.tiles)
      setOldTiles(game.tiles)
      setIsLoading(false)
    });
  }, [cookies.gameid])

  // Separate rack and board tiles
  useEffect(() => {
    setRackTiles(
      tiles?.filter(tile => {
        if (tile.location.place === 'rack') {
          return true;
        } else {
          return false;
        };
      })
    );
    setBoardTiles(
      tiles?.filter(tile => {
        if (tile.location.place === 'board') {
          return true;
        } else {
          return false;
        };
      })
    );
  }, [tiles]);

  // Tiles changes handling
  useEffect(() => {

    const clickTile = (event) => {
      // Avoid propagation to parent target
      event.stopPropagation();

      // Block move if not your turn
      if (!isMyTurn) {
        notYourTurn();
        return;
      };

      const tileId = event.target.id;
      const tile = tiles.find(tile => tile.id === tileId);

      // Reject if tile is locked
      if (tile.isLocked) {
        lockedTile();
        return;
      };

      // TODO Too much computing, arr.filter ???
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
    DOMtiles.forEach(DOMtile => {
      DOMtile.addEventListener('click', clickTile);
    });

    // Remove event listeners to avoid duplication
    return(() => {
      DOMtiles.forEach(DOMtile => {
        DOMtile.removeEventListener('click', clickTile);
      });
    });

  },[tiles, selectedTile, rackTiles, boardTiles, isMyTurn]);


  // Cells changes handling
  useEffect(() => {

    const clickCell = (event) => {
      // Avoid propagation to parent target
      event.stopPropagation();

      // Block move if not your turn
      if (!isMyTurn) {
        notYourTurn();
        return;
      };

      const place = event.target.dataset.place;
      const cellX = parseInt(event.target.getAttribute('x'));
      const cellY = parseInt(event.target.getAttribute('y'));
      const pos = parseInt(event.target.dataset.pos);
      const cellTileId = event.target.dataset.tileid;

      const location = place === 'rack' ? {place:'rack', coords: pos} : {place: 'board', coords: [cellX, cellY]};


      if (selectedTile === null) {
        console.log('no tile selected');
        return;
      } ;

      if (cellTileId == null) {
        setTiles(moveTile(location));
      } else {
        setTiles(switchTile(location, cellTileId));
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
      return newTiles;
    };

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
      return newTiles;
    };

    // Add event listeners to cells
    const DOMcells = document.querySelectorAll('.cell');
    DOMcells.forEach(DOMcell => {
      DOMcell.addEventListener('click', clickCell);
    });
    
    // Remove event listeners to avoid duplication
    return(() => {
      DOMcells.forEach(DOMcell => {
        DOMcell.removeEventListener('click', clickCell);
      });
    });
    
  },[isMyTurn, selectedTile, tiles]);

  const onReset = () => {
    // Block reset if not your turn
    if (!isMyTurn) {
      notYourTurn();
      return;
    };

    // Block reset if nothing changes
    if(tiles === oldTiles) {
      noChanges();
      return;
    }

    setTiles(oldTiles);
  };

  
  const onSubmit = async () => {
    // Block move if not your turn
    if (!isMyTurn) {
      notYourTurn();
      return;
    };

    // Block submit if nothing changes
    if(tiles === oldTiles) {
      noChanges();
      return;
    }
  
    // Unselect tile, and lock tiles on board
    const newTiles = tiles.map(tile => {
      if (tile.location.place === 'board' && tile.isLocked === false) {
        return { ...tile, isLocked: true, isSelected: false };
      }
      return {...tile, isSelected: false };
    })
    setSelectedTile(null);

    // Updating the tiles in the database
    submitMove()
    setIsLoading(true)
    API.put(`games/${cookies.gameid}`, { DataToBeUpdated: { tiles: newTiles } }).then(res => {
      setIsLoading(false)
      validMove()
      setIsMyTurn(false);
      setTiles(newTiles);
      setOldTiles(newTiles);
    })
  };

  return (
    <div className="Game">
      <div className="gamearea">
        <GameInfo />
        <Grid size={GRIDSIZE} tiles={boardTiles}/>
        <Rack size={RACKSIZE} tiles={rackTiles} onReset={onReset} onSubmit={onSubmit} isLoading={isLoading}/>
      </div>
      <div>{`ID: ${cookies.gameid}`}</div>
    </div>
  );
}

export default Game;