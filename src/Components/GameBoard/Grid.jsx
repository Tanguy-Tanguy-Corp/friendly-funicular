import React from 'react';
import styled from 'styled-components';
import Cell from './Cell';

const BoardWrapper = styled.div`
margin: 1em;
padding: 1em;
border-style: solid;
border-width: 5px;
border-radius: 20px;
background: white;
display: grid;
grid-template-columns: repeat(${props => props.size}, 50px);
gap: 0px;
justify-content: center;
`


const Grid = ({ tiles, size }) => {
  const cells = []
  for (var x=0; x < size; x++) {
    for (var y=0; y < size; y++) {
      cells.push({ x: x, y: y });
    };
  };

  return (
    <BoardWrapper className='grid' size={size}>
      {
        cells.map((cell,i) => {
          const tile = tiles?.find(tile => 
            tile.location.coords[0] === cell.x && tile.location.coords[1] === cell.y
          )
          return (
          <Cell place={'grid'} x={cell.x} y={cell.y} key={i} tile={tile}/>
          )
        })
      }
    </BoardWrapper>
  )
}

export default Grid