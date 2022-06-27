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

const GameInfoView = ({ gameInfos, isLoading }) => {
  return (
    <GameInfoDiv>
      <div>
        {gameInfos &&  gameInfos.name}
      </div>
      <div>
        {gameInfos &&  gameInfos.players.map((player, index) => {
          return `${player.pseudo}: ${player.score} ${index !== gameInfos.players.length - 1 ? 'VS ' : ''}`
        })}
      </div>
      <div>
        {gameInfos && 'Tour #' + gameInfos.turn}
      </div>
    </GameInfoDiv>
  )
}

export default GameInfoView