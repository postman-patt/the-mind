import React from 'react'

const playedCard = ({ value }) => {
  return (
    <img
      className='playedCard'
      src={`../../assets/cardset/${value}.png`}
      alt='the-mind-title'
      width='30%'
    />
  )
}

export default playedCard
