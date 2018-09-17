import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
    Image,
    LayoutAnimation,
    PanResponder,
    TouchableHighlight,
} from 'react-native';
import { defaultStyles } from './styles';
import Options from './options';

//get screen dimension
const { width, height } = Dimensions.get('window');
//set default popup to fill 67% of screen
const defaultHeight = height * 0.67;

export default class MoviePopup extends Component{

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        //movie object
        movie: PropTypes.object,
        //index of chosen day
        chosenDay: PropTypes.number,
        //index of chosen time
        chosenTime: PropTypes.number,
        //gets called when user chooses day
        onChooseDay: PropTypes.func,
        //gets called when user chooses time
        onChooseTime: PropTypes.func,
        //gets called when user books ticket
        onBook: PropTypes.func,
        //gets called when popup closes
        onClose: PropTypes.func,
    }

    state = {
        //animate slide up and down when popup open or closes
        position: new Animated.Value(this.props.isOpen ? 0 : height),
        //backdrop opacity
        opacity: new Animated.Value(0),
        //popup height that can be changed by pulling down or up
        height: defaultHeight,
        //expanded mode with bigger poster flag
        expanded: false,
        //visibility flag
        visible: this.props.isOpen,
    }
    //user starts pulling popup previous height get stores in this
    //help to calculate new height value during & after pulling
    _previousHeight=0

    componentWillMount(){
        //initialize PanResponder to handle move gestures
        this._panResponder = PanResponder.create({

            onStartShouldSetPanResponder: (evt, gestureState)=>true,

            onMoveShouldSetPanResponder: (evt,gestureState) => {
                const {dx,dy} = gestureState;
                //ignore taps
                if(dx!==0 && dy===0){
                    return true;
                }
                return false;
            },

            onPanResponderGrant: (evt, gestureState) => {
                //store prev height before user changed it
                this._previousHeight = this.state.height;
            },

            onPanResponderMove: (evt, gestureState) => {
                //pull delta and velocity values for y axis from gestureState
                const {dy, vy} = gestureState;
                //subtract delta y from prev height to get new height
                let newHeight = this._previousHeight - dy;
                //animate height change so it looks smooth
                LayoutAnimation.easeInEaseOut();
                //Switch to expanded mode if popup pulled up above 80%
                if(newHeight > height-height/5){
                    this.setState({expanded:true});
                } else{
                    this.setState({expanded:false});
                }
                //expanded to full height if pulled up rapidly
                if(vy < -0.75){
                    this.setState({
                        expanded: true,
                        height: height
                    });
                }
                //close if pulled down rapidly
                else if (vy>0.75){
                    this.props.onClose();
                }
                //close if pulled down 75%
                else if (newHeight<defaultHeight*0.75){
                    this.props.onClose();
                }
                //limit max height to screen height
                else if (newHeight>height){
                    this.setState({height:height});
                }
                else{
                    this.setState({height:newHeight});
                }
            },
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => {
                const {dy} = gestureState;
                const newHeight = this._previousHeight - dy;

                //closed if pulled below default height
                if(newHeight<defaultHeight){
                    this.props.onClose();
                }
                //update prev height
                this._previousHeight = this.state.height;
            },
            onShouldBlockNativeResponder: (evt, gestureState) => {
                //returns if this component block native components from
                //responder. Returns true by default. Only supported by android
                return true;
            },
        });
    }
    //handles isOpen changes open or close
    componentWillReceiveProps(nextProps){
        //isOpen changed to true from false
        if(!this.props.isOpen && nextProps.isOpen){
            this.animateOpen();
        }
        //isOpen changed to false from true
        else if(this.props.isOpen && !nextProps.isOpen){
            this.animateClose();
        }
    }

    animateOpen(){
        //update state first
        this.setState({visible:true}, () => {
            //start an array of animations that start at same time
            Animated.parallel([
                //animate opacity
                Animated.timing(
                    this.state.opacity, {toValue: 0.5} //semi-trans
                ),
                //slide up
                Animated.timing(
                    this.state.position, {toValue:0}//top of screen
                ),
            ]).start();
        });
    }

    //close popup
    animateClose(){
        Animated.parallel([
            //Opacity
            Animated.timing(
                this.state.opacity,{toValue: 0}//transparent
            ),
            //slide down
            Animated.timing(
                this.state.position, {toValue:height}//bot of screen
            ),
        ]).start(()=> this.setState({
            //reset to default values
            height:defaultHeight,
            expanded: false,
            visible: false,
        }));
    }

    //dynamic styles that depends on state
    getStyles = () => {
        return{
            imageContainer: this.state.expanded ?
            {
                width: width/2, //half of screen width
            } : {
                maxWidth: 110,
                marginRight: 10,
            },
            movieContainer: this.state.expanded ? {
                flexDirection: 'column',//arrange image & movie info into a column
                alignItems: 'center',//center items
            }:{
                flexDirection: 'row',//arrange into row
            },
            movieInfo: this.state.expanded ? {
                flex:0,
                alignItems:'center',//center horizontally
                paddingTop: 20,
            }:{
                flex:1,
                justifyContent: 'center',//center vertically
            },
            title: this.state.expanded ? {
                textAlign: 'center',
            }:{},
        };
    }

    render(){
        const {
            movie,
            chosenDay,
            chosenTime,
            onChooseDay,
            onChooseTime,
            onBook
        } = this.props; 
        //pulls out movie data
        const { title, genre, poster, days, times } = movie || {};
        //render nothing if not visible
        if(!this.state.visible){
            return null;
        }

        return(
            <View style={styles.container}>
            {/*closes popup if user taps on semi-trans backdrop*/}
                <TouchableWithoutFeedback onPress={this.props.onClose}>
                    <Animated.View style={[styles.backdrop,{opacity:this.state.opacity}]}/>
                </TouchableWithoutFeedback>
                <Animated.View
                    style={[styles.modal, {
                        //animates height
                        height: this.state.height,
                         // Animates position on the screen
                        transform: [{ translateY: this.state.position }, { translateX: 0 }]
                    }]}
                >
                {/*content*/}
                <View style={styles.content}>
                {/*poster,title and genre*/}
                <View
                style={[styles.movieContainer, this.getStyles().movieContainer]}
                    {...this._panResponder.panHandlers}
                >
                    {/*Poster*/}
                    <View style={[styles.imageContainer, this.getStyles().imageContainer]}>
                        <Image source={{uri:poster}} style={styles.image}/>
                    </View>
                    {/* Title and genre */}
                    <View style={[styles.movieInfo, this.getStyles().movieInfo]}>
                        <Text style={[styles.title, this.getStyles().title]}>{title}</Text>
                        <Text style={styles.genre}>{genre}</Text>
                    </View>
                </View>

                {/* Showtimes */}
                    <View>
                    {/* Day */}
                        <Text style={styles.sectionHeader}>Day</Text>
                        <Options
                            values={days}
                            chosen={chosenDay}
                            onChoose={onChooseDay}
                        />
                    {/* Time */}
                        <Text style={styles.sectionHeader}>Showtime</Text>
                        <Options
                            values={times}
                            chosen={chosenTime}
                            onChoose={onChooseTime}
                        />
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <TouchableHighlight
                    underlayColor="#9575CD"
                    style={styles.buttonContainer}
                    onPress={onBook}
                    >
                        <Text style={styles.button}>Book My Tickets</Text>
                    </TouchableHighlight>
                </View>
                </Animated.View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    // Main container
    container: {
      ...StyleSheet.absoluteFillObject,   // fill up all screen
      justifyContent: 'flex-end',         // align popup at the bottom
      backgroundColor: 'transparent',     // transparent background
    },
    // Semi-transparent background below popup
    backdrop: {
      ...StyleSheet.absoluteFillObject,   // fill up all screen
      backgroundColor: 'black',
    },
    // Popup
    modal: {
      backgroundColor: 'white',
    },
    content: {
        flex: 1,
        margin: 20,
        marginBottom: 0,
    },
    movieContainer:{
        flex:1,
        marginBottom:20,
    },
    imageContainer:{
        flex:1,
    },
    image:{
        borderRadius:10,
        ...StyleSheet.absoluteFillObject,
    },
    movieInfo:{
        backgroundColor: 'transparent',
    },
    title:{
        ...defaultStyles.text,
        fontSize: 20,
    },
    genre:{
        ...defaultStyles.text,
        color: '#BBBBBB',
        fontSize: 14,
    },
    sectionHeader:{
        ...defaultStyles.text,
        color: '#AAAAAA',
    },
    footer:{
        padding:20,
    },
    buttonContainer:{
        backgroundColor:'#b73a3a',
        borderRadius:100,
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignItems: 'center',
    },
    button:{
        ...defaultStyles.text,
        color: '#FFFFFF',
        fontSize: 18,
    },
  });