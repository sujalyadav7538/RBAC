import express from 'express';
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import studentRoute from './routes/studentRoute.js';
import facultyRoute from './routes/facultyRoute.js';
import VerifyRole from './utils/checkRole.js';
const app=express();

dotenv.config({ path: "./.env" });
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

app.use(cors());

//  Database Connection
await mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.get('/',(req,res)=>{
    res.send('Hello World')
})



app.use('/student',studentRoute);
app.use('/faculty',facultyRoute);


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(3000,(req,res)=>{
    console.log("Listening on Port : 3000")
})