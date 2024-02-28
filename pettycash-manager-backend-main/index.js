//Required framework/dependencies installation
import express from 'express';
import cors from 'cors'; 
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import router from './Router/router.js';
import connectDB from './Database/db-connectivity.js';


const app = express();
config();
const PORT = process.env.PORT || 4000;
//enabling cross origin site interaction
app.use(cors());
//body-parser.json() identifies and enables to process the request received as json object.
app.use(bodyParser.json());
//configuring api(parent) router
app.use("/api",router);
//Database connection establishment
connectDB();

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT, () => {
  console.log(`Application listening on port ${PORT}`)
})