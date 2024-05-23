const express = require('express');
require('dotenv').config();
const helmet=require('helmet');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const User=require('./models/SignUpDataModel');
const Expense=require('./models/ExpenseDataModel');
const Order=require('./models/orders');
const request=require("./models/forgotPassword");
const S3URLTable=require('./models/S3URLModel');
const compression =require('compression');
const morgan=require('morgan');
const fs=require('fs');
const path = require('path');
var cors = require('cors');
// const https=require('https');

const app = express();
// console.log("requested started");
// console.log(process.env.DATABASE_NAME,process.env.DATABASE_PASSWORD,process.env.DATABASE_USERNAME,process.env.DATABASE_HOST);
// const privateKey=fs.readFileSync('server.key');
// const certificate=fs.readFileSync('server.cert');
app.use(cors());
app.use(bodyParser.json({ extended: false }));
const routes = require('./routes/routes');
const purchase=require('./routes/purchase');
const premium=require('./routes/premium');
const password=require('./routes/password');
const expense=require('./routes/Expense');
User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);
User.hasMany(request);
request.belongsTo(User);
User.hasMany(S3URLTable);
S3URLTable.belongsTo(User);
const accessLogStream= fs.createWriteStream(
    path.join(__dirname,'accesslog'),
    {flags:'a'}
);
app.use(helmet());
app.use(compression());
app.use(morgan('combined',{stream:accessLogStream}));
app.use(routes);
app.use('/purchase',purchase);
app.use('/premium',premium);
app.use('/password',password);
app.use('/Expense',expense);
sequelize
    .sync()
    .then(result =>{
            app.listen(process.env.PORT_NUMBER||8000);
        })
    .catch(err => console.log(err));