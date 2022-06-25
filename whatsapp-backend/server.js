import express from "express";
import mongoose from "mongoose";
import Messages from './dbMessages.js';
import Rooms from './dbRooms.js';
import cors from "cors";
import dotenv from 'dotenv';

dotenv.config()

const app = express();
const port = process.env.PORT || 9000

app.use(express.json());
app.use(cors());

const CONNECTION_URL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.dn0yo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
mongoose.connect(CONNECTION_URL, {
    useNewUrlParser: true, useUnifiedTopology: true
})


app.get('/', (req, res) => {
    res.status(200).send("hello")
})

//get chat messages for particular room
app.get('/messages/sync', (req, res) => {

    Messages.find((err, data) => {
        if (err) {
            res.status(500).send(err)
        }
        else {
            res.status(200).send(data);
        }
    })
})

//post chat messages
app.post('/messages/new', (req, res) => {
    const dbMessage = req.body;

    Messages.create(dbMessage, (err, data) => {
        if (err) {
            res.status(500).send(err)
        }
        else {
            res.status(201).send(data);
        }
    })
})

//get chat rooms
app.get('/rooms/sync', (req, res) => {

    Rooms.find((err, data) => {
        if (err) {
            res.status(500).send(err)
        }
        else {
            res.status(200).send(data);
        }
    })
})

//get chat room by id
app.get('/rooms/:id', (req, res) => {
    const { id: _id } = req.params.id;

    Rooms.findById(req.params.id)
    .then((data)=>{
        res.status(200).send(data);
    })
    .catch((err)=>{
        res.status(500).send(err)
    })

})

//add chat room
app.post('/rooms/new', (req, res) => {
    const roomDetails = req.body;

    Rooms.create(roomDetails, (err, data) => {
        if (err) {
            res.status(500).send(err)
        }
        else {
            res.status(201).send(data);
        }
    })
})

//delete chat room
app.delete('/rooms/delete/:id', (req, res) => {

    Rooms.findByIdAndRemove(req.params.id)
    .then((data)=>{
        res.status(200).send(data);
    })
    .catch((err)=>{
        res.status(500).send(err)
    })
})

//update messages in  chat room
app.put('/updateroom/:id', async (req, res) => {
    const roomDetails = req.body;
    const { id: _id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send('No post with that id');

const updatedRoom = await Rooms.findByIdAndUpdate(_id, { ...roomDetails, _id }, { new: true })
res.json(updatedRoom);
 })

//get messages for particular room
app.get('/messages/:id', (req, res) => {
    const { id: _id } = req.params.id;

    Rooms.findById(req.params.id)
    .then((data)=>{
        res.status(200).send(data);
    })
    .catch((err)=>{
        res.status(500).send(err)
    })
   
})



app.listen(port, () =>
    console.log(`Listening on localhost:${port}`)
)
