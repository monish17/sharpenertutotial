const express = require('express');
require('dotenv').config();
const fs = require('fs');
const http=require('http');
const bodyParser = require('body-parser');
var cors = require('cors');
const path = require('path');
const sequelize=require('./util/database');
const compression = require('compression');
const morgan = require('morgan');
// const helmet = require('helmet');

// Database Model assigning
const User=require('./models/SignUpDataModel');
const Expense=require('./models/ExpenseTrackingModel');
const Order=require('./models/orders');
const forgotPassword = require('./models/ForgotPassword');
const S3URLTable=require('./models/S3URLModel');
//const S3Services=require('./DownloadFile/UserService');

// const privateKey=fs.readFileSync('server.key');
// const certificate=fs.readFileSync('server.cert');

const app = express();

// app.use(helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],
//         scriptSrc: ["'self'", "http://cdnjs.cloudflare.com", "http://checkout.razorpay.com"],
//         styleSrc: ["'self'", "'unsafe-inline'"],
//         imgSrc: ["'self'"],
//         connectSrc: ["'self'"],
//         fontSrc: ["'self'"],
//         objectSrc: ["'none'"],
//         frameSrc: ["'self'", "http://api.razorpay.com"],
//         upgradeInsecureRequests: [], //commenting this line to avoid http problem in the CSP
//       },
//     },
//   }));
// app.use(helmet());

app.use(compression());
app.use(cors());
app.use(bodyParser.json({ extended: false }));

app.use((req, res, next) => {
  req.getExpenses = () => getExpenses(req);
  next();
});


const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'accesslog'),
  { flags: 'a' }
);
app.use(morgan('combined', { stream: accessLogStream }));
app.use(express.static(path.join(__dirname, 'public')));

const routes = require('./routes/routes');
const password=require('./routes/password');
const purchase=require('./routes/purchase');
const premium=require('./routes/premium');
const expenseReport=require('./routes/expense');


app.use('/routes', routes);
app.use('/password',password);
app.use('/purchase',purchase);
app.use('/premium',premium);
app.use('/Expense',expenseReport);


// Database relationships
User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(forgotPassword);
forgotPassword.belongsTo(User);

User.hasMany(S3URLTable);
S3URLTable.belongsTo(User);


sequelize
  .sync()
  .then(result => {
    console.log('Sequelize is running');
    // http.createServer({key:privateKey,cert:certificate},app)
    app.listen(process.env.PORT_NUMBER||3000);
  })
  .catch(err => console.log(err));