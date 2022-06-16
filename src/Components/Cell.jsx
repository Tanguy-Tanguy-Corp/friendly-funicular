import React, { useState } from 'react';
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
border-radius: ${props => props.rack ? '10px' : '0px'};
background: ${props => props.isHovered ? 'lightgray' : 'white'};
display: flex;
justify-content: center;
align-items: center;
`

const Cell = (props) => {

  const [isHovered, setIsHovered] = useState(false)

  return (
    <CellWrapper rack={props.rack} isHovered={isHovered} onMouseOver={() => setIsHovered(true)} onMouseOut={() => setIsHovered(false)} className='cell' data-place={props.place} data-pos={props.pos} data-tileid={props.tile ? props.tile.id : null} x={props.x} y={props.y}>
      {
        props.tile && <Tile letter={props.tile.letter} isSelected={props.tile.isSelected} isLocked={props.tile.isLocked} id={props.tile.id}/>
      }
    </CellWrapper>
  )
}

export default Cell