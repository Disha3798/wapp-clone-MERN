import React, { useState, useEffect } from 'react';
import './SidebarChat.css';
import { Avatar, DialogActions, DialogContent, DialogTitle, DialogContentText, Dialog, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Grid } from '@mui/material';
import axios from '../../config/axios';
import { useDispatch } from 'react-redux';
import { red } from '@mui/material/colors';
import { appActions } from '../../store';


const SidebarChat = (props) => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setIsHovered(false)
        setOpen(true);
    };

    const handleClose = () => {
        setIsHovered(false)
        setOpen(false);
    };


    const dispatch = useDispatch();
    const [seed, setSeed] = useState('');
    const [isHovered, setIsHovered] = useState(false)


    useEffect(() => {
        setSeed(props.id)
    }, [props.id])

    const createChat = async () => {
        const roomName = prompt("Please enter name for chat");
        if (roomName) {
            await axios.post('/rooms/new', {
                name: roomName,
                messages: []
            })
                .then((response) => {
                    if (response) {

                        dispatch(appActions.setSelectedRoom(response.data._id))
                        dispatch(appActions.setSelectedAvatar(response.data._id))
                        props.checkAddedChat(response)
                    }
                })
        }
    }

    const roomSelected = () => {
        dispatch(appActions.setSelectedRoom(props.id))
        dispatch(appActions.setSelectedAvatar(seed))
    }

    const onMouseHover = () => {
        setIsHovered(true)
    }
    const onMouseLeave = () => {
        setIsHovered(false)
    }
    const deleteRoom = (roomid) => {
        handleClose()
        axios.delete(`/rooms/delete/${roomid}`)
            .then((response) => {
                props.checkRoomDeleted(response)
                dispatch(appActions.setSelectedRoom(null))
                dispatch(appActions.setSelectedAvatar(null))
            })
    }

    return !props.addNewChat ? (
        <div className='sidebarChat' onMouseEnter={onMouseHover} onMouseLeave={onMouseLeave} onClick={roomSelected}>
            <Avatar
                src={`https://avatars.dicebear.com/api/identicon/${seed}.svg`} />
            <div className='sidebarChat_info'>
                <Grid container direction="row" alignItems="center">
                    <Grid item>
                        {isHovered &&
                            <React.Fragment>
                                <DeleteIcon
                                    className='sidebarChat_icon'
                                    onClick={() => handleClickOpen(props.id)}
                                    fontSize='small'
                                    sx={{ color: red[700] }} />
                                <Dialog open={open} onClose={handleClose}>
                                    <DialogTitle>
                                        Greetings from Whatsapp Clone!
                                    </DialogTitle>
                                    <DialogContent>
                                        <DialogContentText>
                                            Clearing or deleting entire chats will remove messages from all of your devices. Do you want to continue?
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleClose} color="success">
                                            Close
                                        </Button>
                                        <Button onClick={() => deleteRoom(props.id)} color="success" autoFocus>
                                            Continue
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </React.Fragment>
                        }
                    </Grid>
                    <Grid item className='title'>
                        {props.name}
                    </Grid>
                </Grid>

                <p className='text'>{props.lastMsg} </p>
            </div>

        </div>
    )
        :
        (
            <div onClick={createChat}
                className="sidebarChat">
                <h2>Add new chat</h2>
            </div>
        )
}

export default SidebarChat