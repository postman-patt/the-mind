import React from 'react'

const playedCard = ({ value }) => {
  return (
    <img
      className='playedCard'
      src={`../../assets/cardset/${value}.png`}
      alt='the-mind-title'
      width='20%'
    />
  )
}

export default playedCard
