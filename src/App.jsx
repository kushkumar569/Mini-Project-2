import { useState } from 'react'
import './App.css'
import { LoginSignup } from './components/LoginSignup'
import Login from './components/Login/Login'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <Login/>
    </>
  )
}

export default App
