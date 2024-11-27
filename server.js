const express = require('express');
require('dotenv').config();
const fs = require('fs');
const http=require('http');
const bodyParser = require('body-parser');
var cors = require('cors');
const multer= require('multer');
const path = require('path');
const sequelize=require('./util/database');
const cron = require('node-cron');
const axios = require('axios'); 


const app = express();

const server = http.createServer(app);



const io=require('socket.io')(server,{
  cors: {
    origin: 'http://127.0.0.1:5500', 
    methods: ['GET', 'POST'],
    credentials: true,
  }
})

io.on('connection',socket=>{
  let roomId
  console.log("???????????????????????????????????????????????????",socket.id);
  socket.on('Send-event',(obj)=>{
    console.log('Received  Emitted Message>>>>>>>>>>>>>>>>>>>',obj);
    socket.broadcast.emit('receive-message',obj);
  })
  // socket.on('send-fileEvent',(obj)=>{
  //   console.log('file arrived');
  //   socket.broadcast.emit('receive-message',obj);
  // })
  socket.on('Room-Id',(roomNumber)=>{
    console.log('value Received<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<',roomNumber);
    socket.join(roomNumber);
    roomId=roomNumber;
  })

  socket.on('Room-Message',(obj)=>{
    console.log('Received  Emitted Message>>>>>>>>>>>>>>>>>>>',obj);
    socket.to(roomId).emit('Send-To-Room',obj);
  })

})


app.use(cors({
    origin:"*",
    methods:['GET','POST','DELETE'],
    credentials:true
}
));
app.use(bodyParser.json({ extended: false }));
const fileBufferStorage = multer.memoryStorage();

const upload = multer({
  fileBufferStorage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

app.use('/Messages/postFiles/:userName/:Group_Id', upload.single('file'), (req, res, next) => {
  if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
  }
  console.log("File metadata:", req.file);
  next();
});

const routes = require('./Routes/Router');
const messages=require('./Routes/Messages');
const CreateGroup=require('./Routes/NewGroup');

app.use('/routes', routes);
app.use('/Messages',messages);
app.use('/NewGroup',CreateGroup);

//Database Relation
const User=require('./Models/SignUpData');
const CustomGroups=require('./Models/NewGroupCreation');
const UserGroupRelation=require('./Models/UserGroupRelation');
const { Socket } = require('socket.io');

User.hasMany(CustomGroups, { foreignKey: 'CREATED_BY' });
CustomGroups.belongsTo(User, { foreignKey: 'CREATED_BY' });

User.hasMany(UserGroupRelation, { foreignKey: 'USER_ID' });
UserGroupRelation.belongsTo(User, { foreignKey: 'USER_ID' });

CustomGroups.hasMany(UserGroupRelation, { foreignKey: 'GROUP_ID' });
UserGroupRelation.belongsTo(CustomGroups, { foreignKey: 'GROUP_ID' });

cron.schedule('* * * * *', () => {
  console.log('Task is running every minute');
  axios.get('http://localhost:3000/Messages/backUpData')
    .then(response => {
        console.log('Response Data:', response.data);
    })
    .catch(error => {
        console.error('Error:', error.message);
    });
});

sequelize
  .sync()
  .then(result => {
    console.log('Sequelize is running');
    // http.createServer({key:privateKey,cert:certificate},app)
    server.listen(process.env.PORT_NUMBER||3000);
  })
  .catch(err => console.log(err));