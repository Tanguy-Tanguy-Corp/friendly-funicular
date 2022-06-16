import React from 'react'
import styled from 'styled-components'

const GameInfoDiv = styled.div`
margin: 1em;
padding: 1em;
border-style: solid;
border-width: 5px;
border-radius: 20px;
background: white;
display: flex;
justify-content: space-around;
`

const GameInfo = () => {
  return (
    <GameInfoDiv>
      <div>
        Player 1 VS Player 2
      </div>
      <div>
        Score: 100
      </div>
      <div>
        Temps restant 10:00
      </div>
    </GameInfoDiv>
  )
}

export default GameInfo