import React, { Component } from 'react'
import { BrowserRouter , Route } from 'react-router-dom'
import Home from './ChatAPP/Home/Home'
import Login from './ChatAPP/Login/Login'
import Message from './ChatAPP/Message/Message'

function App() {
  return (
    <div>
        <BrowserRouter>
            <Route exact path="/" component={Home}/>
            <Route exact path="/login" component={Login}/>
            <Route exact path="/user/:id" component={Message}/>
        </BrowserRouter>
    </div>
  )
}

export default App;
