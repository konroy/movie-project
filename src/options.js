//to render option.js inside a ScrollView,
//to enable a user to swipe between them if there is more than fits the screen

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import Option from './option';

const {width} = Dimensions.get('window');
const optionWidth = (width-0)/3-10;

export default class Options extends Component{
    
    static propTypes = {
        //set of values to choose from
        values: PropTypes.array.isRequired,
        //chosen value index
        chosen: PropTypes.number,
        //gets called when user choses a value
        onChoose: PropTypes.func.isRequired,
    }

    render(){
        const{values,chosen,onChoose} = this.props;
        return(
            <View style={styles.container}>
                <ScrollView
                    ref={(scrollView)=>{this._scrollView=scrollView;}}
                    //horizontal scrolling
                    horizontal={true}
                    //decelerate after user lifts finger
                    decelerationRate={0.1}
                    //hide all scroll indicators
                    showsHorizontalScrollIndicator={true}
                    showsVerticalScrollIndicator={false}
                    //don't adjust content auto
                    automaticallyAdjustContentInsets={false}
                    //snapp interval to stop at option edges
                    snapToInterval={optionWidth}
                    style={styles.options}
                >
                    {values.map((value,index)=>
                        <View style={{width:optionWidth}} key={index}>
                            <Option
                            value={value}
                            isChosen={index===chosen}
                            onChoose={()=>onChoose(index)}
                            />
                        </View>
                    )}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        marginTop: 10,
        marginBottom: 20,
    },
    options:{
        flexDirection: 'row',
        marginRight: -10,
    },
});