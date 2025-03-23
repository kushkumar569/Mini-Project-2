import { useState } from 'react'
import './App.css'
import React from "react";
import ReactDOM from "react-dom";
import Login from './components/Login/Login'
import SetRoutes from './components/SetRoutes'
import Teacher from '../src/components/HomePage/Teacher'
import Student from '../src/components/HomePage/Student'
import { RecoilRoot } from "recoil";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <SetRoutes>
        <Login />
      </SetRoutes> */}
      <RecoilRoot>
        <Teacher />
      </RecoilRoot>
      {/* <Student/> */}
    </>
  )
}

export default App
