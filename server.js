const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
var cors = require('cors');
const app = express();
app.use(cors());
app.use(bodyParser.json({ extended: false }));
const routes = require('./routes/routes');
app.use(routes);
sequelize
    .sync()
    .then(result =>{
            app.listen(8000);
        })
    .catch(err => console.log(err));