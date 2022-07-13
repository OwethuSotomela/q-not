import axios from 'axios';

const appState = {
    Login: 'LOGIN',
    Signup: 'SIGNUP',
    Home: 'HOME'
}
export default function EQueue() {
    return {
        appState: 'HOME',
        init() {

            this.callFlatPicker()
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
                    console.log('on change')

                    console.log({ selectedDates, dateAndTimeStr, instance }, 'on change')

                    instance.config.disable.push(selectedDates[0])

                    console.log(instance.config.disable);
                },
            })
        },
        isOpen: false,
        user: {
            fullname: '',
            username: '',
            password: '',
            card_number: ''
        },
        logUser: {
            username: '',
            password: ''
        },
        patients: [],
        token: '',
        ourDayTime: '',
        gotToSignUp() {
            this.appState = appState.Signup;
        },
        gotToLogin() {
            this.appState = appState.Login;
        },
        signup() {
            alert('Hi')
            console.log('Hi, Ongi')
            try {
                const signupUser = this.user
                console.log({ signupUser: this.user });
                axios
                    .post(`http://localhost:5050/api/signup`, signupUser)
                    .then((myApp) => {
                        console.log(myApp.data)
                    }).catch(err => {
                        console.log(err)
                    })

            } catch (err) {
            }
        },

        login() {
            const loginUser = this.logUser;
            axios
                .post(`http://localhost:5050/api/login`, loginUser)
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
                    setTimeout(() => {
                        this.token = ''
                    }, 3000);
                    return true;
                })
                .catch((err) => {
                    console.log(err)
                    // console.log(err.response.data.message)

                });
        },
        selectDayTime() {
            // alert('Time')
            return {
                autoSelect() {
                    alert('Hi, 360-Degrees')
                    const config =

                    {
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
                            console.log('on change')

                            console.log({ selectedDates, dateAndTimeStr, instance }, 'on change')

                            instance.config.disable.push(selectedDates[0])

                            console.log(instance.config.disable);
                        },
                    }
                    flatpickr(".flatpickr", config)
                }
            }
        },

        makeAnAppo(day) {
            alert(day)
            try {
                alert(day)

                const { username } = this.user.username ? this.user : JSON.parse(localStorage.getItem('user'))
                axios
                    .post(`http://localhost:5050/api/book/${day.dateAndTimeStr}`, { username })
                    .then(result => result.data)
                    .then((data) => {
                        console.log(data)
                    })
            } catch (err) {
                alert(err.message);
            }
        },
    }
}
