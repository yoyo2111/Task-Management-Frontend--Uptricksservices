import React from 'react'
import './App.css'
import {Route, Routes } from "react-router-dom";
import { TaskSheet } from './components/TaskSheet';
import { Login } from './components/Login';
import { Signup } from './components/Signup';

function App() {

  return (
    <div className='h-[100%] w-[100%]'>
      <Routes>
        <Route path='/' element={<TaskSheet />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
      </Routes>
    </div>
  )
}

export default App
