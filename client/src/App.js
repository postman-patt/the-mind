import GameStage from './components/GameStage'
import Home from './components/Home'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <>
      <Router>
        <div className='App-header'>
          <Route path='/' exact component={Home} />
          <Route path='/play/:name/:roomCode' exact component={GameStage} />
        </div>
      </Router>
    </>
  )
}

export default App
