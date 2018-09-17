import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import router from './router';

//connect to mongoDB
mongoose.connect('mongodb://localhost/movies');

//initialise http server
const app = express();

//logger that output all request into console
app.use(morgan('combined'));
//use v1 as prefix for all API endpoints
app.use('/v1', router);

//launch the server on port 3000
const server = app.listen(3000, () => {
    const{address,port}=server.address();
    console.log(`Listening at http://${address}:${port}`);
});