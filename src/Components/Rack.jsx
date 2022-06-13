import React from 'react';
import styled from 'styled-components';
import Cell from './Cell';

const RackWrapper = styled.div`
margin: 1em;
padding: 4em;
border-style: solid;
border-width: 5px;
border-radius: 20px;
background: white;
display: flex;
`

const Rack = ({ tiles, size, onReset, onSubmit }) => {

  const rackCells = new Array(size**2);
  for (var i=0; i < size; i++) {
    rackCells[i] = { pos: i };
  };

  return (
    <RackWrapper className='rack'>
      {
        rackCells.map((cell,i) => {
          const tile = tiles.find(tile => 
            tile.location.coords === cell.pos
          )
          return (
          <Cell place={'rack'} pos={cell.pos} key={i} tile={tile}/>
          )
        })
      }
      <button onClick={onSubmit}>Submit</button>
      <button onClick={onReset}>Reset</button>
    </RackWrapper>
  )
}

export default Rack