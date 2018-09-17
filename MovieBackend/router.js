//router that will be responsible for handling incoming HTTPc requests 
//and directing them to appropriate controllers.

import express, {Router} from 'express';
//import index action from movies controller
import {index} from './controllers/movies';

//init the router
const router = Router();

//handle movies.json route with index action from movies controller
router.route('/movies.json').get(index);

export default router;