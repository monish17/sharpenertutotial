const express = require('express');
require('dotenv').config();
const helmet = require('helmet');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const User = require('./models/SignUpDataModel');
const Expense = require('./models/ExpenseDataModel');
const Order = require('./models/orders');
const request = require("./models/forgotPassword");
const S3URLTable = require('./models/S3URLModel');
const compression = require('compression');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
var cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json({ extended: false }));

// Custom CSP settings with helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://cdnjs.cloudflare.com", "https://checkout.razorpay.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameSrc: ["'self'", "https://api.razorpay.com"],
      upgradeInsecureRequests: [],
    },
  },
}));

// Compression middleware
app.use(compression());

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'accesslog'),
  { flags: 'a' }
);
app.use(morgan('combined', { stream: accessLogStream }));

// Define static file serving
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
const routes = require('./routes/routes');
const purchase = require('./routes/purchase');
const premium = require('./routes/premium');
const password = require('./routes/password');
const expense = require('./routes/Expense');

app.use('/routes', routes);
app.use('/purchase', purchase);
app.use('/premium', premium);
app.use('/password', password);
app.use('/expense', expense);

// Serving static files
// app.use((req, res) => {
//   res.sendFile(path.join(__dirname, 'public', req.url));
// });

// Database relationships
User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(request);
request.belongsTo(User);

User.hasMany(S3URLTable);
S3URLTable.belongsTo(User);

sequelize
  .sync()
  .then(result => {
    app.listen(process.env.PORT_NUMBER || 8000);
  })
  .catch(err => console.log(err));
