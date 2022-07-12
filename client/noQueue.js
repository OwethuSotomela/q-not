import axios from 'axios';

const appState = {
    Login: 'LOGIN',
    Signup: 'SIGNUP',
    Home: 'HOME',
    Playlist: 'PLAYLIST'
}
export default function EQueue(){
    return{
        appState: 'LOGIN',
        init(){
            console.log('Hi, Oz')
        },
        isOpen: false,
        user: {
            fullname: '',
            username: '',
            password: '',
            card_number: ''
        },
        patients: [],
        config: {
            enableTime: true,
            dateFormat: "Y-m-d H:i",
            altInput: true,
            altFormat: "F j, Y (h:S K)"
        },
        // flatpickr("input[type=datetime-local]", config),

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
    }
}