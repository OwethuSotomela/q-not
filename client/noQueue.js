import axios from 'axios';

const URL_BASE = import.meta.env.VITE_SERVER_URL;
const URL_Heroku = 'https://q-not-360-degrees.herokuapp.com';

const appState = {
    Login: 'LOGIN',
    Signup: 'SIGNUP',
    Home: 'HOME',
    AdminHome: 'ADMINISTRATOR',
    Confirmation: 'CONFIRMATION',
    Manage: 'MANAGE'
}

export default function EQueue() {
    return {
        booking: [],
        appState: 'LOGIN',
        init() {
            this.callFlatPicker()
            if (localStorage['user'] !== 'undefined') {
                this.isOpen = true;
                if(localStorage['screen']){
                    this.appState = localStorage.getItem('screen')
                    
                } else {
                    this.changeScreen(appState.Home)
                }
                if (localStorage['user']) {
                    this.user = localStorage.getItem('user')
                }
            }
        },
        changeScreen(name){
            this.appState = name;
            localStorage.setItem('screen', name);
            if(this.appState == appState.Confirmation) {
                this.gettingUserBooking()
            }
        },
        callFlatPicker() {
            flatpickr(".flatpickr", {
                enableTime: true,
                inline: true,
                dateFormat: "Y-m-d H:i",
                weekNumbers: true,
                allowInput: true,
                time_24hr: true,
                minTime: "09:00",
                maxTime: "16:00",
                altFormat: "F j, Y (h:S K)",
                disable: ["2022-07-30", "2022-07-21", "2022-08-08", new Date(2025, 4, 9)],
                onChange(selectedDates, dateAndTimeStr, instance) {

                    console.log({ selectedDates, dateAndTimeStr, instance }, 'on change')

                    instance.config.disable.push(selectedDates[0])

                    this.booking = instance.selectedDates
                    console.log(this.booking)

                    localStorage.setItem('Booking', this.booking);

                    console.log(instance.config.disable);

                },
            })
        },
        isOpen: false,
        feedback: '',
        user: {
            fullname: '',
            username: '',
            password: '',
            role: '',
            id_number: '',
            contact_number: ''
        },
        logUser: {
            username: 'OwSoto',
            password: 'owe123'
        },
        token: '',
        loading: true,
        description: null,
        myBooking: [],
        gotToSignUp() {
            this.appState = appState.Signup;
        },
        gotToLogin() {
            this.appState = appState.Login;
        },
        signup() {
            try {
                const signupUser = this.user
                console.log({ signupUser: this.user });
                axios
                    .post(`${URL_Heroku}/api/signup`, signupUser)
                    .then((myApp) => {
                        console.log(myApp.data)
                        this.feedback = myApp.data.message
                        this.users = myApp.data;
                    }).catch(err => {
                        console.log(err)
                        this.feedback = err.response.data.message
                        setTimeout(() => {
                            this.feedback = ''
                        }, 3000)
                    })
            } catch (err) {
            }
        },

        login() {
            const loginUser = this.logUser;
            axios
                .post(`${URL_Heroku}/api/login`, loginUser)
                .then((myApp) => {
                    console.log(myApp.data)
                    var { access_token, user } = myApp.data;
                    
                    if (!access_token) {
                        return false
                    }
                    
                    this.appState = appState.Home
                    this.isOpen = true;
                    this.user = user;
                    localStorage.setItem('user', JSON.stringify(user));
                    this.token = access_token
                    localStorage.setItem('access_token', this.token);

                    setTimeout(()=> {
                    this.loading = false;

                    },1990)
                    setTimeout(() => {
                        this.callFlatPicker()

                        this.token = ''
                    }, 2000);
                    return true;
                })
                .catch((err) => {
                    console.log(err)
                    // console.log(err.response.data.message)

                });
        },
        // Ace 
        loginAdmin() {
            const loginUser = this.logUser;
            axios
                .post(`${URL_Heroku}/api/login`, loginUser)
                .then((myApp) => {
                    console.log(myApp.data)
                    var { access_token, user } = myApp.data;
                    
                    if (!access_token) {
                        return false
                    }
                    
                    this.appState = appState.AdminHome
                    this.isOpen = true;
                    this.user = user;
                    localStorage.setItem('user', JSON.stringify(user));
                    this.token = access_token
                    localStorage.setItem('access_token', this.token);

                    setTimeout(()=>{
                        this.getBookings()
                    }, 1000)

                    return true;
                })
                .catch((err) => {
                    console.log(err)
                    // console.log(err.response.data.message)

                });
        },
        // end 

        makeAnAppo() {
            try {
                const appoReason = this.description;
                const bookedDay = this.Booking ? this.Booking : localStorage.getItem('Booking')

                alert( 'You have selected' + ' ' + bookedDay )
                alert( 'For' + ' ' + appoReason + ' ' + 'appointment' )

                const { username } = this.user.username ? this.user : JSON.parse(localStorage.getItem('user'))
                axios
                    .post(`${URL_Heroku}/api/book/${bookedDay}`, { username, appoReason})
                    .then(result => result.data)
                    .then((data) => {
                        console.log(data)
                    })
            } catch (err) {
                alert(err.message);
            }
        },
        gettingUserBooking() {
            alert('username')
            const { username } = (this.user && this.user.username) ? this.user : JSON.parse(localStorage.getItem('user'))
            axios
                .get(`${URL_Heroku}/api/booking/${username}`)
                .then(r => r.data)
                .then((clinicDate) => {

                    this.myBooking = clinicDate.data
                    this.user = clinicDate.user;

                    localStorage.setItem('user', JSON.stringify(this.user));
                }).catch(e => {
                    console.log(e);
                    // alert('Error')
                })
        },
        goToConfirmation(){
            this.changeScreen(appState.Confirmation)
            setTimeout(()=>{
                this.gettingUserBooking()
            }, 1000)
        },
        goToMakeAnAppointment(){
            this.changeScreen(appState.Home)
        },
        goToLogin(){
            this.changeScreen(appState.Login)
        },
        confirmBookings(){
            alert('Hi, All. Bye-All See you Monday')
        },

        // here 
        getBookings(){
            axios
            .get(`${URL_Heroku}/api/booking`)
            .then(r => r.data)
            .then((clinicDate) => {

                this.myBooking = clinicDate.data
                console.log(this.myBooking)

            }).catch(e => {
                console.log(e);
                // alert('Error')
            })
        }, confirmAdultBookings(){
            alert('Hi, All. Bye-All See you Monday')
        },
        // end

        logout() {
            this.isOpen = !this.isOpen
            this.appState = appState.Login
            localStorage.clear()
        }
    }
}
