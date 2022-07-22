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
};

export default function EQueue() {
  return {
    booking: [],
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
      }
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
    },
    callFlatPicker() {
      flatpickr(".flatpickr", {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        altInput: true,
        altFormat: "F j, Y",
        minTime: "09:00",
        maxTime: "16:00",

        inline: true,
        weekNumbers: true,
        allowInput: true,
        time_24hr: true,

        disable: [
          "2022-07-30",
          "2022-07-21",
          "2022-08-08",
          new Date(2025, 4, 9),
        ],
        onChange(selectedDates, dateAndTimeStr, instance) {
          console.log({ selectedDates, dateAndTimeStr, instance }, "on change");
          console.log(dateAndTimeStr);
          instance.config.disable.push(selectedDates[0]);

          this.booking = instance.selectedDates;
          console.log(this.booking);

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
    user: {
      fullname: "",
      username: "",
      password: "",
      role: "",
      persal_number: "",
      id_number: "",
      contact_number: "",
    },
    logUser: {
      username: "OwSoto",
      password: "owe123",
      role: "",
    },
    token: "",
    loading: true,
    description: null,
    myBooking: [],
    gotToSignUp() {
      this.changeScreen(appState.Signup);
    },
    gotToLogin() {
      this.changeScreen(appState.Login);
    },
    signup() {
      try {
        const signupUser = this.user;
        if (
          this.user.fullname == "" ||
          this.user.username == "" ||
          this.user.id_number == "" ||
          this.user.password == "" ||
          this.user.role == "" ||
          this.user.contact_number == ""
        ) {
          this.feedback = "Fill in all required fields to register";
          setTimeout(() => {
            this.feedback = "";
          }, 3000);
        } else {
          console.log({ signupUser: this.user });
          axios
            .post(`${URL_BASE}/api/signup`, signupUser)
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
      } catch (err) {}
    },

    login() {
      try {
        const loginUser = this.logUser;

        axios
          .post(`${URL_Heroku}/api/login`, loginUser)
          .then((myApp) => {
            console.log(myApp.data);
            var { access_token, user } = myApp.data;

            if (!access_token) {
              return false;
            }
            console.log(user)

            if (user.role == "Admin") {
              this.changeScreen(appState.AdminHome);
            } else {
              this.changeScreen(appState.Home);
            }
            this.isOpen = true;
            this.user = user;
            localStorage.setItem("user", JSON.stringify(user));
            this.token = access_token;
            localStorage.setItem("access_token", this.token);
            this.feedback = myApp.data.message;

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
            this.feedback = err.response.data.message;
            setTimeout(() => {
              this.feedback = "";
            }, 3000);
          });
      } catch (err) {}
    },
   
    makeAnAppo() {
      try {
        const appoReason = this.description;
        const bookedDay = this.Booking
          ? this.Booking
          : localStorage.getItem("Booking");

        alert("You have selected" + " " + bookedDay);
        alert("For" + " " + appoReason + " " + "appointment");

        const { username } = this.user.username
          ? this.user
          : JSON.parse(localStorage.getItem("user"));
        axios
          .post(`${URL_Heroku}/api/book/${bookedDay}`, { username, appoReason })
          .then((result) => result.data)
          .then((data) => {
            console.log(data);
          });
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
    confirmBookings() {
      alert("Hi, All. Bye-All See you Monday");
    },

    // here
    getBookings() {
      axios
        .get(`${URL_Heroku}/api/booking`)
        .then((r) => r.data)
        .then((clinicDate) => {
          this.myBooking = clinicDate.data;
          console.log(this.myBooking);
        })
        .catch((e) => {
          console.log(e);
          // alert('Error')
        });
    },
    confirmAdultBookings() {
      alert("Hi, All. Bye-All See you Monday");
    },

    cancelAppo(myAppointment) {
      try {
        axios
          .delete(`${URL_Heroku}/api/cancel/${myAppointment.id}`)
          .then(() => this.gettingUserBooking());

        this.feedback = "Your appointment has been cancelled";
        setTimeout(() => {
          this.feedback = "";
        }, 3000).catch((err) => {
          console.log(err.message);
        });
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
