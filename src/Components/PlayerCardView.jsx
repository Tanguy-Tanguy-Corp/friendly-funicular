import React from 'react'
import { Button, Card } from 'antd'

const PlayerCardView = ({ player, isLoading, leave }) => {
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
          <Button>Quitter</Button>
          </>
        }
      </Card>
    </>
  )
}

export default PlayerCardView