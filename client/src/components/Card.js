import React from 'react'

export const Card = ({ value, playCard, player }) => {
  return <button onClick={() => playCard(value, player)}>{value}</button>
}

export default Card
