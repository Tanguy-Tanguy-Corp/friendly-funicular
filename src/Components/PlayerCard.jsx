import React from 'react'
import { Card } from 'antd'

const PlayerCard = ({ player }) => {
  return (
    <>
      <Card title='Player Card' style={{ width: 300 }}>
        <p>
          {player?.pseudo}
        </p>
        <p>
          {player?.ID}
        </p>
        <p>
          {player?.isReady}
        </p>
      </Card>
    </>
  )
}

export default PlayerCard