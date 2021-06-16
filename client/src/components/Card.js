import React from 'react'

export const Card = ({ value, playCard, player }) => {
  return (
    <>
      <a className='card' onClick={() => playCard(value, player)}>
        {' '}
        <img
          src={`../assets/cardset/${value}.png`}
          alt='the-mind-title'
          width='100%'
        />
      </a>{' '}
    </>
  )
}

export default Card
