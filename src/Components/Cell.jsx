import React from 'react';
import styled from 'styled-components';
import Tile from './Tile';

const CellWrapper = styled.div`
height: 80px;
width: 80px;
text-align: center;
padding: 0;
margin: 0;
border-style: solid;
border-width: 1px;
background: lightgrey;
`

const Cell = (props) => {
  return (
    <CellWrapper className='cell' data-place={props.place} data-pos={props.pos} data-tileid={props.tile ? props.tile.id : null} x={props.x} y={props.y}>
      {
        props.tile && <Tile letter={props.tile.letter} isSelected={props.tile.isSelected} id={props.tile.id}/>
      }
    </CellWrapper>
  )
}

export default Cell