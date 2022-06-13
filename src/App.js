import React, { useState, useEffect } from "react";
import Grid from "./Components/Grid";
import Rack from "./Components/Rack";
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

const Title = styled.div`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`;

const initialTiles = [
  {letter: 'A', isSelected: false, id: uuidv4(), isLocked: false, location: { place: 'rack', coords: 0}},
  {letter: 'B', isSelected: false, id: uuidv4(), isLocked: false, location: { place: 'rack', coords: 1}},
  {letter: 'C', isSelected: false, id: uuidv4(), isLocked: false, location: { place: 'rack', coords: 2}},
  {letter: 'D', isSelected: false, id: uuidv4(), isLocked: false, location: { place: 'rack', coords: 3}},
  {letter: 'E', isSelected: false, id: uuidv4(), isLocked: false, location: { place: 'rack', coords: 4}},
  {letter: 'F', isSelected: false, id: uuidv4(), isLocked: false, location: { place: 'rack', coords: 5}},
  {letter: 'G', isSelected: false, id: uuidv4(), isLocked: false, location: { place: 'rack', coords: 6}}
];

const GRIDSIZE = 8;
const RACKSIZE = 7;

function App() {

  const [tiles, setTiles] = useState(initialTiles);
  const [selectedTile, setSelectedTile] = useState(null);

  const [rackTiles, setRackTiles] = useState([]);
  const [boardTiles, setBoardTiles] = useState([]);

  // Separate rack and board tiles
  useEffect(() => {
    setRackTiles(
      tiles.filter(tile => {
        if (tile.location.place === 'rack') {
          return true;
        } else {
          return false;
        };
      })
    );
    setBoardTiles(
      tiles.filter(tile => {
        if (tile.location.place === 'board') {
          return true;
        } else {
          return false;
        };
      })
    );
  }, [tiles])

  // Tiles changes handling
  useEffect(() => {

    const clickTile = event => {
      // Avoid propagation to parent target
      event.stopPropagation();
      console.log("clickTile: " + event.target.id);
      const tileId = event.target.id;

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
      const cellTileId = event.target.dataset.tileid

      const location = place === 'rack' ? {place:'rack', coords: pos} : {place: 'board', coords: [cellX, cellY]}

      if (selectedTile === null) {
        console.log('no tile selected');
        return;
      } 

      if (cellTileId == null) {
        setTiles(moveTile(location))
      } else {
        setTiles(switchTile(location, cellTileId))
      }
      setSelectedTile(null)

    };

    const moveTile = (location) => {
      console.log('moveTile')
      const newTiles = tiles.map(tile => {
        if (tile.id === selectedTile.id) {
          return { ...tile, isSelected: false, location: location}
        }
        return tile
      })
      return newTiles
    }

    const switchTile = (location, cellTileId) => {
      console.log('switchTile')
      const newTiles = tiles.map(tile => {
        if (tile.id === selectedTile.id) {
          return { ...tile, isSelected: false, location: location}
        }
        if (tile.id === cellTileId) {
          return { ...tile, isSelected: false, location: selectedTile.location}
        }
        return tile
      })
      return newTiles
    }

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

  return (
    <div className="App">
      <Title>
        Scrabble Gameboard
      </Title>
      <div className="gamearea">
        <Grid size={GRIDSIZE} tiles={boardTiles}/>
        <Rack size={RACKSIZE} tiles={rackTiles}/>
      </div>
    </div>
  );
}

export default App;
