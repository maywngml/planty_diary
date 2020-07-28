import React from 'react';
import {Component} from 'react'; 
import { 
     View, 
     Text, 
     TouchableHighlight,
     ScrollView,
     AsyncStorage
} from 'react-native';
// import { DrawerActions } from 'react-navigation-drawer';
import Amplify, { API } from 'aws-amplify';

import MyActionBar from  '../MyActionBar';
import ToDoListItem from '../ToDoListItem';
//styles
import common from '../../../styles/common'; 
import styles from './style';
import Colors from '../../../styles/colors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'; 
// import DatePicker from '../DatePicker';
import { getApi, getColor} from '../../common/common'

 export default class ToDoListScreen extends Component{

     // functions
     constructor(props) {
        super(props);

        this.state = {
            email: "",
            toDoList : []
        } 
       
       
    }

    componentDidMount = async() => {

        await AsyncStorage.getItem("email", (errs,result) => {
            if (!errs) {
                if (result !== null) {
                    this.setState({"email" : result});
                }
             }     
        });

       const path = "/todolist/getAllDayList/" + JSON.parse(this.state.email);
       const response = await getApi("ApiToDoList", path);

        this.setState({toDoList:response});
    }
     /*
        name:  gotoToDoScreen
        description: show ToDo Screen
    */
    gotoToDoScreen(){        
        this.props.navigation.navigate("ToDo", {
            isNew: true,
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            date: new Date().getDate(),
            day: new Date().getDay()
        });
    }

     /*
        name:  gotoSideNav
        description: show Setting Nav
    */
    // gotoSideNav(){
    //     this.props.navigation.dispatch(DrawerActions.openDrawer());
    // }

    // HomeScreen : 캘린더
     render(){ 
        // alert("email render: "+this.state.email);
      
        //  const title = this.props.navigation.state.params;
        // this.getToDoList =  this.getToDoList.bind("planty.adm@gmail.com");
        return ( 
           <View style = {styles.container}>
               <MyActionBar prev = {this.props} title = "내 할 일" />
                   <View style = {styles.nav}> 
                       
               </View>

               <View style = {styles.content}>
                   <ScrollView>
                           {this.state.toDoList&&( 
                                this.state.toDoList.map( (data) => {
                                    return <ToDoListItem name ={data.title} color = {getColor(data.color)} date = {data.end_date}/>
                                })
                           )}
                           
                   </ScrollView>

                   <TouchableHighlight style={[common.addButton]}
                       underlayColor={Colors.clicked} onPress={this.gotoToDoScreen.bind(this)}>
                       <Text style={{fontSize: 50, color: 'white'}}>+</Text>
                   </TouchableHighlight>

               </View>
           </View>            
        );
      
     } 
 } 

