window.onload = start;

var user = firebase.auth().currentUser;
var data2;
var refData2;
var visits2;
var CREATE = "Añadir visita"
var UPDATE = "Modificar visita"
var modo = CREATE;
var refEditData2;
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

function start() {

    data2 = document.getElementById("form-visits2");
    data2.addEventListener("submit", sendData, false);
    visits2 = document.getElementById("tbody-visits2");
    refData2 = firebase.database().ref().child("Visitas2");
    showData();

    const signOut = document.getElementById("sign-out");
    signOut.addEventListener("click", logout);

    userLogin();
}

function showData() {
    refData2.on("value", function (snap) {
        var data = snap.val();
        var showData = "";
        for (var key in data) {
            var botones = '<td>' +
            '<button class="size edit-button btn btn-default edit" data-vr="' + key + '">' +
            '<span class="fas fa-edit"></span>' +
            '</button>' +
            '</td>' +
            '<td>' +
            '<button class="size delete-button btn btn-danger delete" data-vr="' + key + '">' +
            '<span class="fas fa-trash"></span>' +
            '</button>' +
            '</td>';
            showData += "<tr>" +
                '<td class="letter">' + data[key].vrIsland + '</td>' +
                '<td class="letter">' + data[key].vrPlace + '</td>' +
                '<td></td>' +
                (userType == ADMINISTRATOR_TYPE ? botones : "")
                "</tr>";
        }
        visits2.innerHTML = showData;
        if (showData != "") {
            var editElements = document.getElementsByClassName("edit");
            for (var i = 0; i < editElements.length; i++) {
                editElements[i].addEventListener("click", editData, false);
            }
            var deleteElements = document.getElementsByClassName("delete");
            for (var i = 0; i < deleteElements.length; i++) {
                deleteElements[i].addEventListener("click", deleteData, false);
            }
        }
    });
}

function editData() {
    var keyEditDatabase = this.getAttribute("data-vr");
    refEditData2 = refData2.child(keyEditDatabase);
    refEditData2.once("value", function (snap) {
        var data = snap.val();
        document.getElementById("island").value = data.vrIsland
        document.getElementById("place").value = data.vrPlace
    });
    document.getElementById("send-data-final").value = UPDATE;
    modo = UPDATE;
}

function deleteData() {
    var keyDeleteDatabase = this.getAttribute("data-vr");
    var refDeleteDatabase = refData2.child(keyDeleteDatabase);
    refDeleteDatabase.remove();
}

function sendData(event) {
    event.preventDefault();

    switch (modo) {
        case CREATE:
            database = event.target;
            var error = false;
            island = database.vrIsland.value;
            place = database.vrPlace.value;
            // var devices = database.deviceModel.value;
            if (island == null || island == "") {
                error = true;
                document.getElementById("error-comment").style.display = "block";
                if (place == null || place == "") {
                    error = true;
                    document.getElementById("error-user").style.display = "block";
                }
            } else {
                document.getElementById("error-comment").style.display = "none";
                document.getElementById("error-user").style.display = "none";

                var data = {

                    vrIsland: database.vrIsland.value,
                    vrPlace: database.vrPlace.value,

                };
                refData2.push(data);
            }
            break;
        case UPDATE:
            var database = event.target;

            refEditData2.update({

                vrIsland: database.vrIsland.value,
                vrPlace: database.vrPlace.value

            });

            modo = CREATE;
            document.getElementById("send-data-final").value = CREATE;
    }
    database.reset();
}

function administrator() {
    document.getElementById("sign-out").style.display = "block";
    document.getElementById("database2").style.display = "block";
    document.getElementById("send-data3").style.display = "block";
    document.getElementById("sign-in").style.display = "none";
    document.getElementById("error").style.display = "none";

}

function nonAdministrator() {

    document.getElementById("send-data3").style.display = "none";
    document.getElementById("database2").style.display = "none"
    document.getElementById("sign-in").style.display = "none";
    document.getElementById("sign-out").style.display = "block";
    document.getElementById("error").style.display = "block";
    document.getElementById("footer").style.display = "none";
}

function nonUser() {
    document.getElementById("sign-in").style.display = "block";
    document.getElementById("sign-out").style.display = "none";
    document.getElementById("database2").style.display = "none";
    document.getElementById("send-data3").style.display = "none";
    document.getElementById("footer").style.display = "none";
    document.getElementById("error").style.display = "block";
}


function logout() {
    firebase.auth().signOut().then(() => {
        console.log("user logged out")
        location.reload();
    }).catch((error) => {
        console.log(error.message)
    });
}