import React from 'react'
import { useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import { auth, provider } from '../Firebase/firebase'
import { userActions } from '.'

const AuthContext=React.createContext({
    isLoggedIn:false,
    onLogin:(email,password)=>{},
    // onLogout:()=>{}
})


export const AuthContextProvider=(props)=>{
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const dispatch= useDispatch()

    useEffect(()=>{
  
      if(sessionStorage.getItem('isLoggedIn')==='1')
      {
        setIsLoggedIn(true)
      }
    },[])
  
    const handleLogin = () => {
        auth.signInWithPopup(provider)
        .then(result =>{
            sessionStorage.setItem('userDetails',JSON.stringify(result.user))
            dispatch(userActions.userDetails(JSON.parse(sessionStorage.getItem('userDetails'))))
            sessionStorage.setItem('isLoggedIn','1')
            setIsLoggedIn(true)
        })
        .catch(error => alert(error.message))
   
    }
  
    // const handleLogout = () => {
    //   sessionStorage.removeItem('isLoggedIn')
    //   setIsLoggedIn(false)
    // }

    return (
        <AuthContext.Provider
          value={{
            isLoggedIn: isLoggedIn,
            onLogin: handleLogin,
            // onLogout: handleLogout,
           }}
        >
          {props.children}
        </AuthContext.Provider>
      );
}

export default AuthContext