import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import InputEmoji from 'react-input-emoji'
import { Avatar, IconButton } from '@mui/material';
import { AttachFile, MoreVert, SearchOutlined } from '@mui/icons-material';
import MicIcon from '@mui/icons-material/Mic';
import axios from '../config/axios';
import './Chat.css';
import { appActions } from '../store';

const Chat = () => {

  const user = useSelector((state) => state.user.user)
  const selectedRoomId = useSelector((state) => state.app.selectedRoomId)
  const selectedSeedId = useSelector((state) => state.app.selectedAvatarId)
  const dispatch = useDispatch()

  const [input, setInput] = useState("");
  const [roomName, setRoomName] = useState("");
  const [messages, setRoomMessages] = useState("");
  const [lastSeen, setLastSeen] = useState("");
  const [newMsg, setNewMsg] = useState("")

  useEffect(() => {
    if (selectedRoomId) {
      axios.get(`/rooms/${selectedRoomId}`)
        .then(
          response => {
            setRoomName(response.data.name);
            setRoomMessages(response.data.messages)
            response.data.messages.length ?
              setLastSeen(response.data.messages[response.data.messages.length - 1].timestamp)
              : setLastSeen('just now')

          }
        )
        .catch((error) => console.log(error))
    }

  }, [selectedRoomId, newMsg]);

  const sendMessage = async () => {
    // e.preventDefault();
    const reqBody = {
      name: roomName,
      messages: [...messages, {
        message: input,
        name: user.displayName,
        timestamp: new Date().toTimeString().split(' ')[0].substring(0, 5),
        send: true
      }]
    }

    await axios.put(`/updateroom/${selectedRoomId}`, reqBody)
      .then(
        response => {
          setInput('');
          setNewMsg(response);
          dispatch(appActions.setMsgSent(input))
        }

      )
    scrollToBottom()
  }

  const scrollToBottom = () => {
    const element = document.getElementById('scrollId');
    element.scrollTop = element.scrollHeight;
  }

  return (
    <React.Fragment>
      {selectedRoomId &&

        <span className='chat' id='scrollId'>

          <div className='chat_header'>
            <Avatar src={`https://avatars.dicebear.com/api/identicon/${selectedSeedId}.svg`} />
            <div className='chat_headerInfo'>
              <h3>{roomName}</h3>
              <p>Last seen {lastSeen} </p>
            </div>

            <div className='chat_headerRight'>
              <IconButton>
                <SearchOutlined />
              </IconButton>

              <IconButton>
                <AttachFile />
              </IconButton>

              <IconButton>
                <MoreVert />

              </IconButton>

            </div>


          </div>

          <div className='chat_body'>
            {messages ? (messages.map((message) => {
              return (
                <p className={`chat_message ${user.displayName === message.name && 'chat_reciever'}`}>
                  <span className='chat_name'>{message.name}</span>
                  {message.message}
                  <span className='chat_timestamp'>
                    {message.timestamp}
                  </span>
                </p>
              )
            }))
              :
              (
                <div></div>
              )}
          </div>

          <div className='chat_footer'>
            <InputEmoji
              value={input}
              onChange={(e) => setInput(e)}
              cleanOnEnter
              onEnter={sendMessage}
              placeholder="Type a message"
            />
            <MicIcon />
          </div>

        </span>}
      {
        !selectedRoomId &&
        <span className='box_body'>
          <div className='box'>
            <p>Catch up with friends by clicking on existent chat or create a new chat</p>
          </div>
        </span>

      }
    </React.Fragment>
  )
}

export default Chat