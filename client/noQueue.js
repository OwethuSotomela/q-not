import axios from "axios";

const URL_BASE = import.meta.env.VITE_SERVER_URL;
const URL_Heroku = "https://q-not-360-degrees.herokuapp.com";
// const URL_Heroku = import.meta.env.VITE_SERVER_URL;

const appState = {
    Login: "LOGIN",
    Signup: "SIGNUP",

    Home: "HOME",

    AdminHome: "ADMINISTRATOR",
    Confirmation: "CONFIRMATION",
    Manage: "MANAGE",
    Approved: "APPROVED",
    Schedule: "SCHEDULE"
};

export default function EQueue() {
    return {
        booking: [],
        schedule: [],
        appState: "LOGIN",
        init() {
            this.callFlatPicker();
            if (localStorage["user"] !== "undefined") {
                this.isOpen = true;
                if (localStorage["screen"]) {
                    this.appState = localStorage.getItem("screen");
                } else {
                    this.changeScreen(appState.Home);
                }
                if (localStorage["user"]) {
                    this.user = localStorage.getItem("user");
                }
            };
            this.getBookings()
            
        },
        changeScreen(name) {
            this.appState = name;
            localStorage.setItem("screen", name);
            if (this.appState == appState.Confirmation) {
                this.gettingUserBooking();
            }
            if (this.appState == appState.Home) {
                this.callFlatPicker();
            }
            if (this.appState == appState.Approved) {
                this.confirmedList() 
            }
        },
        callFlatPicker() {
            flatpickr(".flatpickr", {
                enableTime: true,
                dateFormat: "Y-m-d H:i",

                minDate: "today",
                maxDate: "2022-11-30",

                altInput: true,
                altFormat: "F j, Y",
                minTime: "09:00",
                maxTime: "16:00",

                inline: true,
                weekNumbers: true,
                allowInput: true,
                time_24hr: true,

                "disable": [
                    function (date) {
                        return (date.getDay() === 0 || date.getDay() === 6);
                    },
                    "2022-03-25",
                    "2022-03-10",
                    "2022-03-04",

                    "2022-01-01",
                    "2022-03-21",
                    "2022-04-15",
                    "2022-04-18",
                    "2022-04-27",
                    "2022-05-02",
                    "2022-06-16",
                    "2022-12-16",
                    "2022-12-26",
                    "2022-08-09",
                    "2022-09-24"
                ],
                onChange(selectedDates, dateAndTimeStr, instance) {
                    console.log({ selectedDates, dateAndTimeStr, instance }, "on change");
                    console.log(selectedDates);
                    
                    instance.config.disable.push(selectedDates[0]);

                    this.booking = instance.selectedDates;

                    localStorage.setItem("Booking", this.booking);

                    console.log(instance.config.disable);
                },
            });
        },
        isOpen: false,
        feedback: "",
        description: {
            mhc: "Mental health care",
            dh: "Dental Health",
            fp: "Family Planning",
            nbac: "NBAC",
            art: "ART",
            club: "Clinic for chronic diseases",
            kids: "Child Immunization",
        },
        loggedIn: "Logged in as Admin:",
        loginFeed: "",
        user: {
            fullname: "",
            username: "",
            password: "",
            role: "",
            id_number: "",
            contact_number: "",
        },
        logUser: {
            username: "OwSoto",
            password: "owe123"
        },
        token: "",
        loading: true,
        description: null,
        myBooking: [],
        confirmedTable: [],
        gotToSignUp() {
            this.changeScreen(appState.Signup);
        },
        gotToLogin() {
            this.changeScreen(appState.Login);
        },
        signup() {
            try {
                const signupUser = this.user;
                console.log(this.user)
                if (
                    this.user.fullname == undefined ||
                    this.user.username == undefined ||
                    this.user.password == undefined ||
                    this.user.role == undefined ||
                    this.user.id_number == undefined ||
                    this.user.contact_number == undefined
                ) {
                    this.feedback = "Fill in all required fields to register";
                    setTimeout(() => {
                        this.feedback = "";
                    }, 3000);
                } else {
                    axios
                        .post(`${URL_Heroku}/api/signup`, signupUser)
                        .then((myApp) => {
                            console.log(myApp.data);
                            this.feedback = myApp.data.message;
                            this.users = myApp.data;
                        })
                        .catch((err) => {
                            console.log(err);
                            this.feedback = err.response.data.message;
                            setTimeout(() => {
                                this.feedback = "";
                            }, 3000);
                        });
                }
            } catch (err) { }
        },

        login() {
            try {
                const loginUser = this.logUser;

                axios
                    .post(`${URL_Heroku}/api/login`, loginUser)
                    .then((myApp) => {
                        // console.log(myApp.data);
                        var { access_token, user } = myApp.data;

                        if (!access_token) {
                            return false;
                        }
                        console.log(user)

                        if (user.role == "Admin") {
                            this.changeScreen(appState.AdminHome);
                            this.getBookings()
                        } else {
                            this.changeScreen(appState.Home);
                        }
                        this.isOpen = true;
                        this.user = user;
                        localStorage.setItem("user", JSON.stringify(user));
                        this.token = access_token;
                        localStorage.setItem("access_token", this.token);
                        this.loginFeed = myApp.data.message;
                        setTimeout(() => {
                            this.loginFeed = ""
                        }, 3000)

                        setTimeout(() => {
                            this.loading = false;
                        }, 1990);
                        setTimeout(() => {
                            this.callFlatPicker();

                            this.token = "";
                        }, 2000);
                        return true;
                    })
                    .catch((err) => {
                        console.log(err);
                        console.log(err.response.data.message);
                        this.loginFeed = err.response.data.message;
                        setTimeout(() => {
                            this.loginFeed = "";
                        }, 3000);
                    });
            } catch (err) { }
        },

        makeAnAppo() {
            try {
                const appoReason = this.description;
                const bookedDay = this.Booking
                    ? this.Booking
                    : localStorage.getItem("Booking");

                const { username } = this.user.username
                    ? this.user
                    : JSON.parse(localStorage.getItem("user"));

                axios
                    .post(`${URL_Heroku}/api/book/${bookedDay}`, { username, appoReason })
                    .then((result) => result.data)
                    .then((data) => {
                        console.log(data);
                    });

                this.feedback = "Your appointment has been created... It will be confirmed when the status changes to 'True'";
                setTimeout(() => {
                    this.feedback = "";
                }, 3000)

            } catch (err) {
                alert(err.message);
            }
        },

        gettingUserBooking() {
            const { username } =
                this.user && this.user.username
                    ? this.user
                    : JSON.parse(localStorage.getItem("user"));
            axios
                .get(`${URL_Heroku}/api/booking/${username}`)
                .then((r) => r.data)
                .then((clinicDate) => {
                    this.myBooking = clinicDate.data;
                    this.user = clinicDate.user;

                    localStorage.setItem("user", JSON.stringify(this.user));
                })
                .catch((e) => {
                    console.log(e);
                    // alert('Error')
                });
        },

        cancelAppo(myAppointment) {
            try {
                axios
                    .delete(`${URL_Heroku}/api/cancel/${myAppointment.id}`)
                    .then(() => this.gettingUserBooking());

                this.feedback = "You have cancelled your appointment";
                setTimeout(() => {
                    this.feedback = "";
                }, 3000)
            } catch (err) {
                console.log(err);
            }
        },

        goToConfirmation() {
            this.changeScreen(appState.Confirmation);
            setTimeout(() => {
                this.gettingUserBooking();
            }, 1000);
        },
        goToMakeAnAppointment() {
            this.changeScreen(appState.Home);
            setTimeout(() => {
                this.callFlatPicker();
            }, 1000);
        },
        goToLogin() {
            this.changeScreen(appState.Login);
        },
        goToApproved() {
            this.changeScreen(appState.Approved)
        },
        goToConfirm() {
            this.changeScreen(appState.AdminHome)
        },
        goToSchedule() {
            this.changeScreen(appState.Schedule)
        },

        getBookings() {
            // alert('called')
            axios
                .get(`${URL_Heroku}/api/booking`)
                .then((r) => r.data)
                .then((clinicDate) => {
                    this.myBooking = clinicDate.data;
                    // console.log(this.myBooking);
                })
                .catch((e) => {
                    console.log(e);
                    // alert('Error')
                });
        },

        // Ace 

        confirmAnAppo(appointments) {
            try {
                axios
                    .post(`${URL_Heroku}/api/confirm/${appointments.id}`)
                    .then(() => this.getBookings());

                this.feedback = "You have confirmed this appointment";
                setTimeout(() => {
                    this.feedback = "";
                }, 3000)
            } catch (err) {
                console.log(err);
            }
        },

        confirmedList() {
            try {
                axios
                    .get(`${URL_Heroku}/api/list`)
                    .then((r) => r.data)
                    .then((clinicDate) => {
                        this.confirmedTable = clinicDate.data;
                        console.log(this.confirmedTable);
                    })
                    .catch((e) => {
                        console.log(e);
                        // alert('Error')
                    });
            } catch (error) {
                console.log(error)
            }

        },

        removeDone(AllAppointment) {
            try {
                axios
                    .delete(`${URL_Heroku}/api/remove/${AllAppointment.id}`)
                    .then(() => this.getBookings());

                this.feedback = "You have deleted this appointment";
                setTimeout(() => {
                    this.feedback = "";
                }, 3000)
            } catch (err) {
                console.log(err);
            }
        },

        // end

        logout() {
            this.isOpen = !this.isOpen;
            this.changeScreen(appState.Login);
            localStorage.clear();
        },
    };
}



