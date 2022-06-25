import React from 'react'
import './login.css';
import { Button } from '@mui/material';

import AuthContext from '../store/auth-context';
import { useContext } from 'react';


const Login=()=> {

  
    const authCtx=useContext(AuthContext)

    const signIn = () => {
      authCtx.onLogin()
    };

    return (
        <div className='login'>
            <div className='login_container'>
                <div className='login_text'>
                    <h1>Sign in to Whatsapp</h1>
                </div>
                <Button type="submit" onClick={signIn}>
                    Sign In With Google
                </Button>
            </div>
        </div>
    )
}

export default Login