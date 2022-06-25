import {createSlice,configureStore} from '@reduxjs/toolkit'

const initialUserState={
    user:sessionStorage.getItem('userDetails')?JSON.parse(sessionStorage.getItem('userDetails')):null
}

const userSlice=createSlice({
    name:'user',
    initialState:initialUserState,
    reducers:{
        userDetails(state,action)
        {
            state.user=action.payload
        }
    }
})

const initialAppState={
    selectedRoomId:null,
    selectedAvatarId:null,
    msgSent:null
}

const appSlice=createSlice({
    name:'app',
    initialState:initialAppState,
    reducers:{
        setSelectedRoom(state,action)
        {
            state.selectedRoomId=action.payload
        },
        setSelectedAvatar(state,action)
        {
            state.selectedAvatarId=action.payload
        },
        setMsgSent(state,action)
        {
            state.msgSent=action.payload
        }
    }
})


const store=configureStore({
    reducer:{user:userSlice.reducer,app:appSlice.reducer}
})

export const userActions=userSlice.actions
export const appActions=appSlice.actions

export default store