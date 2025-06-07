import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DashBoard from './pages/DashBoard'
import Analytics from './pages/Analytics'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashBoard />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
