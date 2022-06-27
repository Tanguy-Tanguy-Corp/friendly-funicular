import React from 'react'
import { Card } from 'antd'

const PlayerCard = ({ player, isLoading }) => {
  return (
    <>
      <Card title={isLoading ? "En attente d'un joueur" : player?.name} loading={isLoading} style={{ width: 300 }}>
        {
          <>
          <p>
            {'Pseudo: '}{player?.pseudo}
          </p>
          <p>
            {'ID: '}{player?.id}
          </p>
          </>
        }
      </Card>
    </>
  )
}

export default PlayerCard