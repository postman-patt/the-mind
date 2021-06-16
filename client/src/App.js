import GameStage from './components/GameStage'
import Home from './components/Home'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import './App.css'

function App() {
  return (
    <>
      <Router>
        <div className='App-header'>
          <Route path='/' exact component={Home} />
          <Route path='/play/:roomCode' exact component={GameStage} />
        </div>
      </Router>
    </>
  )
}

export default App
