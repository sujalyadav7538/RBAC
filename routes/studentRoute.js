import express from 'express';
import { login, signup , getData } from '../controllers/studentController.js';
import VerifyUserToken from './../utils/verifyToken.js';
import VerifyRole from '../utils/checkRole.js';

const route=express.Router();

route.post('/login',login);
route.post('/signup',signup);
// This Route Can only be Accessed by Admin or Student
route.post('/data',VerifyUserToken,VerifyRole,getData)

export default route;