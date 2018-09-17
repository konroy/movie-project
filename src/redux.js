//configure Redux reducer and middleware
export const apiMiddleware = store => next => action => {
    //pass all actions thru by default
    next(action);
    switch(action.type){
        //receive action to send APi request
        case 'GET_MOVIE_DATA':
            //dispatch GET_MOVIE_DATA_LOADING to update loading state
            store.dispatch({type:'GET_MOVIE_DATA_LOADING'});
            //make API call and dispatch actions when done
            fetch('http://10.1.10.116:3000/v1/movies.json')
                .then(response => response.json())
                .then(data => next({
                    type: 'GET_MOVIE_DATA_RECEIVED',
                    data
                }))
                .catch(error => next({
                    type: 'GET_MOVIE_DATA_ERROR',
                    error
                }));
                break;
                //do nothing if the action does not interest us
                default:
                    break;
    }
};

export const reducer = (state = {movies: [], loading: true}, action)=>{
    switch(action.type){
        case 'GET_MOVIE_DATA_LOADING':
            return{
                ...state,//keep the existing state
                loading: true,
            };
        case 'GET_MOVIE_DATA_RECEIVED':
            return{
                loading:false,//set loading false
                movies:action.data.movies,//update movies array with response data
            };
        case 'GET_MOVIE_DATA_ERROR':
            return state;
        default:
            return state;
    }
};