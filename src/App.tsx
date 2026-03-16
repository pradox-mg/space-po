import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { IntroPage } from './components/IntroPage'
import { ExperiencePage } from './components/ExperiencePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route 1: The Intro (Black Hole) */}
        <Route path="/" element={<IntroPage />} />
        
        {/* Route 2: The Main Experience (Asteroids) */}
        <Route path="/experience" element={<ExperiencePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
