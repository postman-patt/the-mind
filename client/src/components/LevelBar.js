import React from 'react'
import { Col } from 'react-bootstrap'

export const LevelBar = ({ level }) => {
  var levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

  return (
    <Col className='d-flex justify-content-center'>
      {levels.map((item) => (
        <h1 className={level === item ? 'mx-2 level active' : 'mx-2 level'}>
          {item}
        </h1>
      ))}
    </Col>
  )
}

export default LevelBar
