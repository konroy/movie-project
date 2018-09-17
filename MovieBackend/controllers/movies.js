//a controller that will be responsible for serving movie data.
import Movie from '../models/movie';
import moment from 'moment';

//hardcore days for simplicity
const days= ['Today','Tomorrow', moment().add(2,'days').format('ddd,MMM D')];
//same for time
const times = [ '9:00 AM', '11:10 AM', '12:00 PM', '1:50 PM', '4:30 PM', '6:00 PM', '7:10 PM', '9:45 PM' ];

export const index = (req,res,next) => {
    //find all movies and return json
    Movie.find().lean().exec((err,movies)=> res.json(
        //iterate thru each movie
        {movies: movies.map(movie=>({
            ...movie,
            days,//append days
            times,//append times to each
        }))}
    ));
};