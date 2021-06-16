import React from 'react'

const playedCard = ({ value }) => {
  return (
    <img
      src={`../assets/cardset/${value}.png`}
      alt='the-mind-title'
      width='20%'
    />
  )
}

export default playedCard
