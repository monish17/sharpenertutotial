import express from "express"
import todosroutes from './routes/route';

import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json());

app.use(todosroutes);

app.listen(3000);