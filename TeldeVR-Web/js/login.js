
    const signIn = document.getElementById("sign-in");
    signIn.addEventListener("click", login);


function login(event) {
    event.preventDefault();
    const txtEmail = document.getElementById("email")
    const txtPassword = document.getElementById("password")
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword(email, pass);
    promise.catch(e => console.log(e.message));
};

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        window.history.back()
    } else {
    }
})


