import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from '../config/axios';

import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import { Avatar, IconButton } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

import SidebarChat from './SidebarChat/SidebarChat';
import './Sidebar.css';


const Sidebar = () => {

  const user = useSelector((state) => state.user.user)
  const msgSent = useSelector((state) => state.app.msgSent)
  const [chatAdded, setChatAdded] = useState("");
  const [rooms, setRooms] = useState([]);
  const [roomDeleted, setRoomDeleted] = useState("");

  useEffect(() => {
    axios.get('/rooms/sync')
      .then(
        response => {
          const sortedRooms = response.data.sort((a, b) => b._id.localeCompare(a._id));
          setRooms(sortedRooms);
        }
      )
      .catch((error) => console.log(error))
  }, [chatAdded, roomDeleted, msgSent]);

  const checkAddedChat = (value) => {
    setChatAdded(value)
  }

  const checkRoomDeleted = (value) => {
    setRoomDeleted(value)
  }

  const filterRooms = (event) => {
    const inputText = event.target.value
    let updatedRooms = [];
    if (inputText) {
      updatedRooms = rooms.map((room) => {
        if (!room.name.includes(inputText)) {
          return { ...room, hide: true };
        }
        return room;
      })
    }
    else {
      updatedRooms = rooms.map((room) => {
        return { ...room, hide: false };
      })
    }

    setRooms(updatedRooms)
  }

  return (
    <div className='sidebar'>

      <div className='sidebar_header'>
        <Avatar src={user?.photoURL} />
        <div className='sidebar_headerRight'>
          <IconButton>
            <DonutLargeIcon />
          </IconButton>

          <IconButton>
            <ChatIcon />
          </IconButton>

          <IconButton>
            <MoreVertIcon />
          </IconButton>

        </div>
      </div>

      <div className='sidebar_search'>
        <div className='sidebar_searchContainer'>
          <SearchOutlinedIcon />
          <input
            placeholder='Search or start new chat'
            onChange={filterRooms}
            type="text" />
        </div>
      </div>

      <div className='sidebar_chats'>
        <SidebarChat addNewChat checkAddedChat={checkAddedChat} />
        {rooms.map(room => {
          const lastMsg = room.messages.length ?
            room.messages[(room.messages.length) - 1].message :
            ' ';

          return (
            <React.Fragment>
              {!room.hide && <SidebarChat key={room._id} id={room._id}
                name={room.name} lastMsg={lastMsg} checkRoomDeleted={checkRoomDeleted} />}
            </React.Fragment>
          )

        })}
      </div>
    </div>
  )
}

export default Sidebar