import React, { useState, useEffect } from "react";
import Grid from "../Components/Grid";
import Rack from "../Components/Rack";
import GameInfo from "../Components/GameInfo";
import { useCookies } from 'react-cookie';

const GRIDSIZE = 8;
const RACKSIZE = 7;

const backendURL = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_DEV_BACKEND_URL : process.env.REACT_APP_PROD_BACKEND_URL
console.log(`l'url backend utilisé est: ${backendURL}`)
const databaseName = process.env.NODE_ENV === 'development' ? 'Development' : 'Production'
console.log(`la base de données utilisé est: ${databaseName}`)

const Game = () => {
  const [cookies] = useCookies(['gameid']);

  const [tiles, setTiles] = useState(null);
  const [oldTiles, setOldTiles] = useState(null);
  const [selectedTile, setSelectedTile] = useState(null);

  const [rackTiles, setRackTiles] = useState([]);
  const [boardTiles, setBoardTiles] = useState([]);

  // Get the intital tiles from the database
  useEffect(() => {
    const fetchTile = async () => {
      const response = await fetch(
        `${backendURL}/games/get`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({database: databaseName, collection: 'games', Filter: {gameID: cookies.gameid}})
        }
      )
      const game = await response.json()
      console.log(game)
      return game
    }
    fetchTile().then(game => {
      setTiles(game.tiles);
      setOldTiles(game.tiles);
    })
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

    const clickTile = event => {
      // Avoid propagation to parent target
      event.stopPropagation();
      console.log("clickTile: " + event.target.id);
      const tileId = event.target.id;

      const tile = tiles.find(tile => tile.id === tileId);
      
      if (tile.isLocked === true) {
        console.log('tile locked');
        return;
      };

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
    
    const DOMtiles = document.querySelectorAll('.tile');
    DOMtiles.forEach(DOMtile => {
      DOMtile.addEventListener('click', clickTile);
    });
    // Avoid event listeners duplication
    return(() => {
      DOMtiles.forEach(DOMtile => {
        DOMtile.removeEventListener('click', clickTile);
      });
    });

  },[tiles, selectedTile, rackTiles, boardTiles]);


  // Cells changes handling
  useEffect(() => {

    const clickCell = event => {
      // Avoid propagation to parent target
      event.stopPropagation();
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

    const DOMcells = document.querySelectorAll('.cell');

    DOMcells.forEach(DOMcell => {
      DOMcell.addEventListener('click', clickCell);
    });
    
    // Avoid event listeners duplication
    return(() => {
      DOMcells.forEach(DOMcell => {
        DOMcell.removeEventListener('click', clickCell);
      });
    });
    
  },[selectedTile, tiles]);

  const onReset = () => {
    setTiles(oldTiles);
  };

  
  const onSubmit = () => {
  
    const newTiles = tiles.map(tile => {
      if (tile.location.place === 'board' && tile.isLocked === false) {
        return { ...tile, isLocked: true };
      }
      return tile;
    })
    // Updating the tiles in the database
    fetch(
      `${backendURL}/mongodb`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          database: databaseName,
          collection :'games',
          Filter: { gameID: cookies.gameid },
          DataToBeUpdated: { tiles: newTiles }
        })
      }
    )

    setTiles(newTiles);
    setOldTiles(newTiles);
  };

  return (
    <div className="Game">
      <div>{cookies.gameid}</div>
      <div className="gamearea">
        <GameInfo />
        <Grid size={GRIDSIZE} tiles={boardTiles}/>
        <Rack size={RACKSIZE} tiles={rackTiles} onReset={onReset} onSubmit={onSubmit} />
      </div>
    </div>
  );
}

export default Game;