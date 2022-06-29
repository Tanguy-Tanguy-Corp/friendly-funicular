import React, { useState, useEffect, useContext, useCallback } from "react";
import { SocketContext } from "../Contexts/socketIOContext";
import { Grid, Rack, GameInfoView } from "../Components";
import { useCookies } from 'react-cookie';
import { submitMoveMsg, validMoveMsg, illegalMoveMsg, myTurnMsg, notYourTurnMsg, lockedTileMsg, noChangesMsg, unexpectedErrorMsg } from '../Helpers/gameMessages'
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import API from "../services/API";

const Game = () => {
  const socket = useContext(SocketContext);
  let navigate = useNavigate();
  const [cookies] = useCookies(['gameid', 'player']);

  const [tiles, setTiles] = useState(null);
  const [tilesLoading, setTilesLoading] = useState(false);
  const [infos, setInfos] = useState(null);
  const [infosLoading, setInfosLoading] = useState(false);

  const [oldTiles, setOldTiles] = useState(null);
  const [selectedTile, setSelectedTile] = useState(null);
  const [playerTiles, setPlayerTiles] = useState([]);
  const [boardTiles, setBoardTiles] = useState([]);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const trigger = () => {setRefetchTrigger(oldCount => oldCount + 1)};

  // Redirect to home, if necessary cookies are missing
  useEffect(() => {
    if (!cookies.player || !cookies.gameid) {
      navigate('/');
    };
  }, [cookies, navigate]);

  const handleGameUpdate = useCallback((message) => {
    console.log(message.playerID)
    trigger();
  }, []);

  // Subscribe to socket events, and join game room
  useEffect(() => {
    socket.emit('close_room', {room: `lobby-${cookies.gameid}`});
    socket.emit('join', {room: `game-${cookies.gameid}`});
    socket.on('gameUpdate', handleGameUpdate);
    return(() => {
      socket.emit('leave', {room: `game-${cookies.gameid}`});
      socket.off('gameUpdate', handleGameUpdate);
    });
  }, [cookies.gameid, handleGameUpdate, socket]);

  // Infos Fetching
  useEffect(() => {
    setInfosLoading(true);
    API.get(`game/${cookies.gameid}`)
    .then(res => {
      const infos = res.data
      setInfos(infos)
      if (infos.turnPlayerId === cookies.player) {
        setIsMyTurn(true)
        myTurnMsg()
      } else {
        setIsMyTurn(false)
      }
    }).catch(err => {
      unexpectedErrorMsg(err);
    }).finally(() => {
      setInfosLoading(false)
    })
  }, [cookies.gameid, cookies.player, refetchTrigger]);

  // Tiles Fecthing
  useEffect(() => {
    setTilesLoading(true)
    API.get(`tile/${cookies.gameid}/${cookies.player}`).then(res => {
      const data = res.data;
      const rack = data.rack.tiles
      const board = data.board
      const tiles = board.concat(rack)
      setTiles(tiles)
      setOldTiles(tiles)
    }).catch(err => {
      unexpectedErrorMsg(err)
    }).finally(() => {
      setTilesLoading(false)
    })
  }, [cookies.gameid, cookies.player, refetchTrigger]);

  // Separate rack and board tiles
  useEffect(() => {
    setPlayerTiles(
      tiles?.filter(tile => (tile.location.place === 'rack'))
    );
    setBoardTiles(
      tiles?.filter(tile => (tile.location.place === 'board'))
    );
  }, [tiles]);

  // Tiles DOM handling
  useEffect(() => {

    const clickTile = (event) => {
      // Avoid propagation to parent target
      event.stopPropagation();

      // Block move if not your turn
      if (!isMyTurn) {
        notYourTurnMsg();
        return;
      };

      const tileId = event.target.id;
      const tile = tiles.find(tile => tile.id === tileId);

      // Reject if tile is locked
      if (tile.isLocked) {
        lockedTileMsg();
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

  },[tiles, selectedTile, playerTiles, boardTiles, isMyTurn]);


  // Cells DOM handling
  useEffect(() => {

    const clickCell = (event) => {
      // Avoid propagation to parent target
      event.stopPropagation();

      // Block move if not your turn
      if (!isMyTurn) {
        notYourTurnMsg();
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
      notYourTurnMsg();
      return;
    };

    // Block reset if nothing changes
    if(tiles === oldTiles) {
      noChangesMsg();
      return;
    }

    setTiles(oldTiles);
  };

  
  const onSubmit = () => {
    // Block move if not your turn
    if (!isMyTurn) {
      notYourTurnMsg();
      return;
    };

    // Block submit if nothing changes
    if(tiles === oldTiles) {
      noChangesMsg();
      return;
    }
  
    setTilesLoading(true)
    submitMoveMsg()
    API.put('play/submit', {
      playerID: cookies.player,
      gameID: cookies.gameid,
      board: boardTiles,
      rack: playerTiles
    })
    .then(res => {
      console.log(res)
      socket.emit('moveSubmitEvent', {room: `game-${cookies.gameid}`, playerID: cookies.player})
      validMoveMsg()
    })
    .catch(err => {
      console.log(err)
      illegalMoveMsg(err.response.data?.errMsg)
    })
    .finally(() => {
      setTilesLoading(false)
    })

  };

  return (
    <div className="Game">
      <div className="gamearea">
        <GameInfoView gameInfos={infos} isLoading={infosLoading} />
        <Grid size={infos?.gridSize} tiles={boardTiles} />
        <Rack size={infos?.tilesPerRack} tiles={playerTiles} onReset={onReset} onSubmit={onSubmit} isLoading={tilesLoading} />
      </div>
      <div style={{ textAlign: 'right' }}>
        <div>
          {'ID: '}{!infosLoading && infos?.id}
        </div>
        <div>
          {'creatorID: '}{!infosLoading && infos?.creatorID}
        </div>
      </div>
      <Button onClick={trigger}>Refresh</Button>
    </div>
  );
};

export default Game;