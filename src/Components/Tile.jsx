import React from 'react';
import styled from 'styled-components';

const TileWrapper = styled.div`
height: 20Opx;
width: 10%;
text-align: center;
padding: 1em;
margin: 0.5em;
border-style: solid;
border-width: ${props => props.isLocked ? '3px' : '2px'};
border-radius: 5px;
background: ${props => props.isSelected ? 'grey' : 'lightgrey'};
`



const Tile = (props) => {

  return (
    <TileWrapper className='tile' id={props.id} isSelected={props.isSelected} isLocked={props.isLocked}>
        {props.letter}
    </TileWrapper>
  )
}

export default Tile