const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const User=require('./models/SignUpDataModel');
const Expense=require('./models/ExpenseDataModel');
var cors = require('cors');
const app = express();
app.use(cors());
app.use(bodyParser.json({ extended: false }));
const routes = require('./routes/routes');
User.hasMany(Expense);
Expense.belongsTo(User);
app.use(routes);
sequelize
    .sync()
    .then(result =>{
            app.listen(8000);
        })
    .catch(err => console.log(err));