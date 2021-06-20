import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

const Header = () => {
  return (
    <div className='title-header'>
      <Container>
        <Row className='justify-content-md-center'>
          <Col lg={5}>
            <img
              src={'../assets/the-mind-title.png'}
              alt='the-mind-title'
              width='100%'
            />
          </Col>
        </Row>
        <Row className='justify-content-md-center'>
          <Col
            lg={5}
            className='homepage-image d-flex justify-content-center mb-3'
          >
            <img
              src={'../assets/the-mind-cover2.png'}
              alt='the-mind-logo'
              width='80%'
            />
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Header
