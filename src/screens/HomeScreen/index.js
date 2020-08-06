//homescreen-index
import React from 'react';
import { Component } from 'react';
import {
    View,
    Text,
    TouchableHighlight,
    AsyncStorage
    /* ScrollView */
} from 'react-native';
import Modal from 'react-native-modal';
import XDate from 'xdate';

//styles
import common from '../../../styles/common';
import styles from './style';
import { Calendar, calendarModal, modalReal, CalendarList } from 'react-native-calendars';
// import CalendarHeader from 'react-native-calendars/src/calendar/header';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../../styles/colors';
// import ScrollPicker from 'react-native-wheel-scroll-picker';
// import Swipeable from 'react-native-gesture-handler/Swipeable';

// import { createStackNavigator } from '@react-navigation/drawer';
// import { DrawerActions } from 'react-navigation-drawer';
// import { DrawerActions } from "react-navigation-drawer";
import Drawer from '../drawer';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';


import { ScrollView } from 'react-native-gesture-handler';
import { getApi, change_date, change_month, getColor } from '../../common/common';
import { API } from 'aws-amplify';

export default class HomeScreen extends Component {

    constructor(props) {
        super(props);
        
        selected: undefined
        this.state = {
            PickerModalVisible: false,
            CalendarModalVisible: false,
            CalendarDate: new Date().getDate(),
            CalendarMonth: new Date().getMonth() + 1,
            CalendarDay: new Date().getDay(),
            PickerYear: new Date().getFullYear(),
            PickerMonth: new Date().getMonth() + 1,
            PickerCalendar: props.current ? parseDate(props.current) : XDate(),
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            Calendarheader_month: props.current ? parseDate(props.current) : XDate(),
            nickname: this.props.route.params.nickname,
            email: "",
            CalendarList: [],
            // TodoList: [],
            nickname: this.props.route.params.nickname
        }

        console.log("home: ", this.props.route.params);

    };

    componentDidMount = async () => {

        await AsyncStorage.getItem("email", (errs, result) => {
            if (!errs) {
                if (result !== null) {
                    this.setState({ "email": result });
                }
            }
        });
        console.log("homescreen");
    }

    onDayPress = (day) => {
        this.setState({ selected: day.dateString });
    }


    // functions

    /*
       name:  gotoDiaryScreen
       description: show Diary Screen with params
   */
    gotoDiaryScreen = (bool_params, data) => {

        console.log("다이어리 페이지로 이동하자.");
        if(this.state.CalendarList != null || this.state.CalendarList == undefined)
            bool_params = true;
        else bool_params = false;

        this.props.navigation.navigate("Diary", {
            isNew: bool_params,
            year: data.toString('yyyy'),
            month: data.toString('MM'),
            date: data.toString('dd')
        });
    }

    gotoToDoScreen = (bool_params, data) => {
        this.props.navigation.navigate("ToDo", {
            isNew: bool_params,
            uuid: data,
            year: this.state.year,
            month: this.state.CalendarMonth,
            date: this.state.CalendarDate,
            day: this.state.CalendarDay,
            calendarheader_month: this.state.Calendarheader_month
        });
    }

    /*
       name:  gotoSideNav
       description: show Setting Nav
   */
    gotoSideNav() {
        // this.props.route.params.nickname
        this.props.navigation.toggleDrawer({ nickname: this.state.nickname });
        // this.props.navigation.dispatch(DrawerActions.toggleDrawer());
    }

    /*
        name:  togglePickerModal
        description: show yearmonthday picker
    */
    togglePickerModal = () => {
        this.setState({ PickerModalVisible: !this.state.PickerModalVisible });
    }

    /*
        name:  changePickerModal
        description: change year,month in pickerModal
    */
    changePickerModal = (calendar) => {
        this.setState({ PickerYear: calendar.toString("yyyy") });
        this.setState({ PickerMonth: change_month(calendar.toString("MM")) });
        this.setState({ PickerCalendar: calendar });
    }

    /*
        name:  setPickerModal
        description: set year,month in pickerModal when press the header
    */
    setPickerModal() {
        this.setState({ PickerYear: this.state.year });
        this.setState({ PickerMonth: this.state.month });
    }

    /*
        name:  setDayName
        description: set day in korean
    */
    setDayName(en_day) {
        var ko_day;

        if (en_day == "Sun" || en_day == 0)
            ko_day = "일"
        else if (en_day == "Mon" || en_day == 1)
            ko_day = "월"
        else if (en_day == "Tue" || en_day == 2)
            ko_day = "화"
        else if (en_day == "Wed" || en_day == 3)
            ko_day = "수"
        else if (en_day == "Thu" || en_day == 4)
            ko_day = "목"
        else if (en_day == "Fri" || en_day == 5)
            ko_day = "금"
        else if (en_day == "Sat" || en_day == 6)
            ko_day = "토"
        else 
            ko_day = en_day;

        return (ko_day);
    }

    /*
        name:  toggleCalendarModal
        description: show yearmonthday picker
    */
    toggleCalendarModal = () => {
        this.setState({ CalendarModalVisible: !this.state.CalendarModalVisible });
    }

    /*
        name: setDateModal
        description: set month, date, day in calendar modal
    */
    setDateModal = async (flag, month, date, day) => {
        this.setState({ CalendarDate: change_date(date) });
        this.setState({ CalendarMonth: change_month(month) });
        this.setState({ CalendarDay: this.setDayName(day) });

        // const end_date = this.state.year + "." + month + "." + date;
        const start_date = this.state.year + "." + month + "." + date;     
        // const path_todolist = "/todolist/getCurrentDayList/" + JSON.parse(this.state.email) + "/" + end_date;
        const path_calendarlist = "/calendar/getCurrentDayList/" +JSON.parse(this.state.email) + "/2020.08.01";
        console.log("log: ",path_calendarlist);
        if (flag) {
            // const response_todolist = await getApi("ApiToDoList", path_todolist);
            const response_calendarlist = await API.get("ApiCalendar", path_calendarlist).then(response => {
                console.log("dfsfsdfsd:",response);
                this.gotoDiaryScreen.bind(true);
            }).catch(error => {
                this.gotoDiaryScreen.bind(false);
                console.log("error", error.response);
            });
           

            // this.setState({ TodoList: response_todolist });
            // this.setState({ CalendarList: response_calendarlist });
        }
        
    }

    /*
        name:  changeYearMonth
        description: change year, month of header, calendar modal
    */
    changeYearMonth = (calendar) => {
        this.setState({ Calendarheader_month: calendar });
        this.setState({ year: calendar.toString('yyyy') });
        this.setState({ month: change_month(calendar.toString('MM')) });

        this.forceUpdate();
    }

    goToUpdateScreen = (index, day_list) => {
        switch (index) {
            case 0: //캘린더
                break;
            case 1: //할일
                this.props.navigation.navigate("ToDo", { data: day_lis });
                break;

        }
    }
    // HomeScreen : 캘린더

    render() {

        return (
            <View style={styles.container}>
                <View style={styles.nav}>
                    <Icon name="ios-menu" size={30} color={Colors.gray}
                        onPress={this.gotoSideNav.bind(this)}
                    ></Icon>

                    <TouchableOpacity onPress={() => { this.togglePickerModal(); this.setPickerModal() }}>
                        <Text style={[common.font_title, { color: Colors.gray }]}>{this.state.year}.{this.state.month}</Text>
                    </TouchableOpacity>
                    {/* <Modal isVisible={this.state.PickerModalVisible} onBackdropPress={() => { this.togglePickerModal() }} >

                        <View style={styles.modal_container}>
                            <View style={styles.modalheader}>
                            </View>

                            <View style={styles.modalyearmonth}>

                                <Text style={[common.font_title, { color: Colors.darkPrimary }, { fontSize: 43 }]}>{this.state.PickerYear}</Text>

                                <Text style={[common.font_title, { color: Colors.darkPrimary }, { fontSize: 28 }]}>{this.state.PickerMonth}월</Text>

                            </View>


                            <View style={styles.modalContent}>

                                <Calendar
                                    style={styles.calendar}
                                    calendar_flag={2}
                                    onDayPress={this.onDayPress}
                                    Calendarheader_month={this.state.Calendarheader_month}
                                    markedDates={{
                                        [this.state.selected]: {
                                            selected: true,
                                            disableTouchEvent: true,
                                            selectedDotColor: "orange"
                                        }
                                    }}
                                    theme={{
                                        textSectionTitleColor: Colors.darkgray,
                                        selectedDayBackgroundColor: Colors.lightgray,
                                        selectedDayTextColor: "black",
                                        todayTextColor: Colors.darkPrimary,
                                    }}
                                    changePickerModal={this.changePickerModal}
                                    setDateModal={this.setDateModal}
                                />

                            </View>


                            <View style={styles.modalButton}>
                                <TouchableHighlight onPress={() => { this.togglePickerModal(); this.changeYearMonth(this.state.PickerCalendar); }}>
                                    <Text style={[common.font_mid, { color: Colors.darkPrimary }]}>완료</Text>
                                </TouchableHighlight>
                            </View>

                        </View>

                    </Modal> */}

                    {/* 먼슬리 -> 위클리 전환 */}
                    <Icon name="ios-calendar" size={30} color={Colors.gray}></Icon>

                    {/* 위클리 -> 먼슬리 전환 */}
                    {/* 모듈 업데이트되면서 아이콘 사라짐;; */}
                </View>
                <View style={styles.content}>
                    <Calendar
                        style={styles.Calendar}
                        calendarHeight={500}
                        Calendarheader_month={this.state.Calendarheader_month}
                        hideExtraDays={false}
                        onDayPress={this.onDayPress}
                        markedDates={{
                            [this.state.selected]: {
                                selected: true,
                                disableTouchEvent: true,
                                selectedDotColor: "orange"
                            }
                        }}
                        calendar_flag={1}

                        theme={{
                            "stylesheet.calendar.header": {
                                header: {
                                    height: 0,
                                    opacity: 0
                                }
                            },

                            textSectionTitleColor: Colors.darkgray,
                            selectedDayBackgroundColor: Colors.lightgray,
                            selectedDayTextColor: "black",
                            todayTextColor: Colors.darkPrimary,
                        }}
                        toggleCalendarModal={this.toggleCalendarModal}
                        changeYearMonth={this.changeYearMonth}
                        setDateModal={this.setDateModal}
                        // gotoDiaryScreen={this.gotoDiaryScreen}
                        changePickerModal={this.changePickerModal}
                    />

                </View>

            </View>

        );

    }
}