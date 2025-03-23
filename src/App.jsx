import { useState } from 'react'
import './App.css'
import { LoginSignup } from './components/LoginSignup'
import Login from './components/Login/Login'
import SetRoutes from './components/SetRoutes'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <SetRoutes>
        <Login />
      </SetRoutes>
    </>
  )
}

export default App
