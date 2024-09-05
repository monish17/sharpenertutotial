const express = require('express');
require('dotenv').config();
const fs = require('fs');
const http=require('http');
const bodyParser = require('body-parser');
var cors = require('cors');
const path = require('path');
const sequelize=require('./util/database');


const User=require('./Models/SignUpData');

const app = express();

app.use(cors({
    origin:"*",
    methods:['GET','POST','DELETE'],
    credentials:true
}
));
app.use(bodyParser.json({ extended: false }));

const routes = require('./Routes/Router');

app.use('/routes', routes);

sequelize
  .sync()
  .then(result => {
    console.log('Sequelize is running');
    // http.createServer({key:privateKey,cert:certificate},app)
    app.listen(process.env.PORT_NUMBER||3000);
  })
  .catch(err => console.log(err));