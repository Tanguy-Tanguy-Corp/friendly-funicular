import React from 'react';
import styled from 'styled-components';
import Cell from './Cell';
import { Space, Button } from 'antd';

const RackWrapper = styled.div`
margin: 1em;
padding: 4em;
border-style: solid;
border-width: 5px;
border-radius: 20px;
background: ${props => props.isLoading ? 'lightgray' : 'white'};
display: flex;
justify-content: center;
`

const Rack = ({ tiles, size, onReset, onSubmit, isLoading }) => {

  const rackCells = new Array(size**2);
  for (var i=0; i < size; i++) {
    rackCells[i] = { pos: i };
  };

  return (
    <RackWrapper isLoading={isLoading} className='rack'>
      <Space>
      {
        rackCells.map((cell,i) => {
          const tile = tiles?.find(tile => 
            tile.location.coords === cell.pos
          )
          return (
          <Cell place={'rack'} rack pos={cell.pos} key={i} tile={tile}/>
          )
        })
      }
      <Button onClick={onSubmit} type='primary' shape='round' loading={isLoading}>Poser</Button>
      <Button onClick={onReset} shape='round'>Annuler</Button>
      </Space>
    </RackWrapper>
  )
}

export default Rack