import mongoose, {Schema} from 'mongoose';

//define movie schema
var movieSchema = new Schema({
    title: {
        type: String,
        unique: true,
    },
    poster: String,
    genre: String,
    days: Array,
    times: Array,
});

//export mongoose model
export default mongoose.model('movies',movieSchema);