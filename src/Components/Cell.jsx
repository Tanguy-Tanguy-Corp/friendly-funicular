import React from 'react';
import styled from 'styled-components';
import Tile from './Tile';

const CellWrapper = styled.div`
height: 50px;
width: 50px;
text-align: center;
padding: 0;
margin: 0;
border-style: solid;
border-width: 1px;
background: lightgrey;
display: flex;
justify-content: center;
align-items: center;
`

const Cell = (props) => {
  return (
    <CellWrapper onMouseOver={() => console.log(props.x)} className='cell' data-place={props.place} data-pos={props.pos} data-tileid={props.tile ? props.tile.id : null} x={props.x} y={props.y}>
      {
        props.tile && <Tile letter={props.tile.letter} isSelected={props.tile.isSelected} isLocked={props.tile.isLocked} id={props.tile.id}/>
      }
    </CellWrapper>
  )
}

export default Cell