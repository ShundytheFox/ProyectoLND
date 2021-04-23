window.onload = initialize;

var user = firebase.auth().currentUser;
const ADMINISTRATOR_TYPE = 0;
const NON_ADMINISTRATOR_TYPE = 1;
const NON_USER_TYPE = 2;
var userType = NON_USER_TYPE;

function userLogin() {

    firebase.auth().onAuthStateChanged(function (user) {
        if (!user) {
            console.log("No user is signed in.");
            userType = NON_USER_TYPE;
            nonUser();

        } else if (user.email != 'soldonfull@gmail.com') {
            console.log("Non-administrator user is signed in.");
            console.log(user.email);
            userType = NON_ADMINISTRATOR_TYPE;
            nonAdministrator();

        } else if (user.email == 'soldonfull@gmail.com') {
            console.log("Administrator user is signed in.");
            console.log(user.email);
            userType = ADMINISTRATOR_TYPE;
            administrator();

        }
    });
}

function initialize () {
    const signOut = document.getElementById("sign-out");
    signOut.addEventListener("click", logout);

    userLogin();
}

function administrator() {
    document.getElementById("sign-out").style.display = "block";
    document.getElementById("sign-in").style.display = "none";
    
}

function nonAdministrator() {
    document.getElementById("sign-out").style.display = "block";
    document.getElementById("sign-in").style.display = "none";
}

function nonUser() {
    document.getElementById("sign-out").style.display = "none";
    document.getElementById("sign-in").style.display = "block";

}

function logout() {
    firebase.auth().signOut().then(() => {
        console.log("user logged out")
        location.reload();
    }).catch((error) => {
        console.log(error.message)
    });
}