import './App.css'
import GameStage from './components/GameStage'
import Home from './components/Home'
import { BrowserRouter as Router, Route } from 'react-router-dom'

function App() {
  return (
    <>
      <Router>
        <div className='App'>
          <header className='App-header'>
            <h1>The Mind Card Game</h1>
            <Route path='/' exact component={Home} />
            <Route path='/play' exact component={GameStage} />
          </header>
        </div>
      </Router>
    </>
  )
}

export default App
