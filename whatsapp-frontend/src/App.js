import React from "react";
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from './Sidebar/Sidebar';
import Chat from './Chat/Chat';
import Login from '../src/Login/login';
import { useContext } from "react";
import AuthContext from "./store/auth-context";
import { useSelector } from "react-redux";

const App=()=>{

  const authCtx=useContext(AuthContext)
  const user=useSelector((state)=>state.user.user)
  
  return (
    <div className="app">
      {(!authCtx.isLoggedIn && !user)&&<Login/>}
      {(authCtx.isLoggedIn && user) && 
      <div className='app_body'>
   
                <Sidebar />
                <Chat  />
      </div>
    }
  

    </div>
  );
}

export default App;
