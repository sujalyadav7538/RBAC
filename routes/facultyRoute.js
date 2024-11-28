import express from 'express';
import { login, signup , getData } from '../controllers/facultyController.js';
import VerifyUserToken from './../utils/verifyToken.js';
import VerifyRole from './../utils/checkRole.js';

const route=express.Router();

route.post('/login',login);
route.post('/signup',signup);
//  This Route can only be accessed by Admin and Faculty
route.post('/data',VerifyUserToken,VerifyRole,getData)
export default route;