window.onload = initialize;

var user = firebase.auth().currentUser;
var file;
var refStorage;
var refImages;
var database;
var refDatabase;
var tbodyVisits;
var CREATE = "Añadir visita"
var UPDATE = "Modificar visita"
var modo = CREATE;
var refEditDatabase;
var imagesFromFirebase;
var downloadURL;
const ADMINISTRATOR_TYPE = 0;
const NON_ADMINISTRATOR_TYPE = 1;
const NON_USER_TYPE = 2;
var userType = NON_USER_TYPE;
refData2 = firebase.database().ref().child("Visitas2");

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

function initialize() {


    database = document.getElementById("form-visits");
    database.addEventListener("submit", sendConvalidationstoFirebase, false);
    file = document.getElementById("file");
    tbodyVisits = document.getElementById("tbody-visits");
    imagesFromFirebase = document.getElementById("images-from-firebase");
    refDatabase = firebase.database().ref().child("Visitas");
    showDatabaseofFirebase();
    createSelection();
    file = document.getElementById("file");
    file.addEventListener("change", uploadImageToFirebase, false);
    refStorage = firebase.storage().ref();
    refImages = firebase.database().ref().child("images");


    const signOut = document.getElementById("sign-out");
    signOut.addEventListener("click", logout);

    userLogin();

}

function showDatabaseofFirebase() {
    refDatabase.on("value", function (snap) {
        var data = snap.val();
        var showData = "";
        for (var key in data) {
            var botones = '<td>' +
                '<button class=" size edit-button btn btn-default edit" data-vr="' + key + '">' +
                '<span class="fas fa-edit"></span>' +
                '</button>' +
                '</td>' +
                '<td>' +
                '<button class="size delete-button btn btn-danger delete" data-vr="' + key + '">' +
                '<span class="fas fa-trash"></span>' +
                '</button>' +
                '</td>';

            showData += "<tr>" +
                '<td><img margin="10" width="200" class="img-thumbnail delete-image" src="' + data[key].image + '"/></td>' +
                '<td class="letter">' + data[key].vrPlace + '</td>' +
                '<td class="letter">' + data[key].vrIsland + '</td>' +
                '<td align="center" class="letter">' + data[key].price + '</td>' +
                '<td class="letter">' + data[key].deviceModel + '</td>' +
                '<td></td>' +
                (userType == ADMINISTRATOR_TYPE ? botones : "")
            "</tr>";
        }
        tbodyVisits.innerHTML = showData;
        if (showData != "") {
            var editElements = document.getElementsByClassName("edit");
            for (var i = 0; i < editElements.length; i++) {
                editElements[i].addEventListener("click", editDatabasefromFirebase, false);
            }
            var deleteElements = document.getElementsByClassName("delete");
            for (var i = 0; i < deleteElements.length; i++) {
                deleteElements[i].addEventListener("click", deleteDatabaseFromFirebase, false);
            }
        }
    });
}

function uploadImageToFirebase() {
    var imageToUpload = file.files[0];
    var uploadTask = refStorage.child('images/' + imageToUpload.name).put(imageToUpload);
    refField = refStorage.child('images/' + imageToUpload.name)
    uploadTask.on('state_changed',
        function (snapshot) {
            // Se va mostrando el progreso de la subida de la imagen.
            document.getElementById("bar-for-progress").style.display = "block";
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            document.getElementById("progress").style.width = progress + "%";
        }, function (error) {
            // Gestionar el error si se produce.
        }, function () {
            // Cuando se ha subido exitosamente la imagen
            downloadURL = refField.getDownloadURL().then(function (downloadURLInside) {
                document.getElementById("bar-for-progress").style.display = "none";
                return downloadURLInside
            });
        });
}


function editDatabasefromFirebase() {
    var keyEditDatabase = this.getAttribute("data-vr");
    refEditDatabase = refDatabase.child(keyEditDatabase);
    refEditDatabase.once("value", function (snap) {
        var data = snap.val();
        var radios = document.getElementsByName("headset");
        console.log(document.getElementById("selector").value)
        document.getElementById("selector").value = data.vrPlace

        for (var i = 0; i < radios.length; i++) {
            if (data.deviceModel == "Valve Index") {
                radios[0].checked = true;
                console.log(radios[i])
                console.log(data.deviceModel)

                break;

            } else if (data.deviceModel == "HTC Vive") {
                radios[1].checked = true;

            } else {
                radios[2].checked = true;

            }
        }
        document.getElementById("price").value = data.price
    });
    document.getElementById("send-data").value = UPDATE;
    modo = UPDATE;
}

function deleteDatabaseFromFirebase() {
    var keyDeleteDatabase = this.getAttribute("data-vr");
    var refDeleteDatabase = refDatabase.child(keyDeleteDatabase);
    refDeleteDatabase.remove();

}

function createSelection() {

    refData2.on("value", function (snap) {
        var data = snap.val();

        for (var key in data) {
            if (data[key].vrPlace) {
                var opt = document.createElement('option');
                opt.value = data[key].vrPlace;
                opt.innerHTML = data[key].vrPlace;
                document.getElementById('selector').appendChild(opt);
            } else {
                error = true;
            }
        }
    })
}

function sendConvalidationstoFirebase(event) {
    event.preventDefault();
    database = event.target;
    var radioResult;
    var radios = document.getElementsByName("headset");

    selection = document.getElementById("selector").value
    price = database.price.value;
    var numbers = /^[0-9]+$/;
    if (!price.match(numbers)) {
        document.getElementById("error-price").style.display = "block";
    } else {
        document.getElementById("error-price").style.display = "none";
    }

    if (selection == "none") {
        document.getElementById("error-selector").style.display = "block";
    } else {
        document.getElementById("error-selector").style.display = "none";
    }
    if (radios) {
        for (var i = 0; i < radios.length; i++) {
            if (!radios[i].checked) {
                document.getElementById("error-radio").style.display = "block";

            } else {
                document.getElementById("error-radio").style.display = "none";
                radioResult = radios[i].value;
                break
            }
        }
    }

    if (downloadURL != undefined) {
        downloadURL.then(function (result) {

            switch (modo) {
                case CREATE:
                    document.getElementById("error-image").style.display = "none";

                    refData2.on("value", function (snap) {
                        var data = snap.val();

                        for (var key in data) {
                            try {

                                if (data[key].vrPlace == selection) {
                                    console.log(data[key].vrPlace);
                                    document.getElementById("error-radio").style.display = "none";

                                    var data = {
                                        deviceModel: radioResult,
                                        price: price,
                                        vrIsland: data[key].vrIsland,
                                        vrPlace: data[key].vrPlace,
                                        image: result
                                    };
                                    refDatabase.push(data);
                                    console.log(radios[i])
                                    console.log('result:' + result)

                                    break;

                                }
                            } catch (error) {
                                console.log(error);
                            }
                        }
                    })
                    downloadURL = undefined
                    break;
                case UPDATE:
                    refData2.on("value", function (snap) {
                        var data = snap.val();

                        for (var key in data) {
                            try {
                                if (data[key].vrPlace == selection) {
                                    console.log(data[key].vrPlace)

                                    var data = {
                                        deviceModel: radioResult,
                                        price: price,
                                        vrIsland: data[key].vrIsland,
                                        vrPlace: data[key].vrPlace,
                                        image: result
                                    };
                                    refEditDatabase.update(data);
                                    break;

                                }
                            } catch (error) {
                                console.log(error);
                            }
                        }
                    })
                    modo = CREATE;
                    document.getElementById("send-data").value = CREATE;
                    break;
            }
            downloadURL = undefined
        })
        database.reset();
    } else {

        switch (modo) {
            case CREATE:
                document.getElementById("error-image").style.display = "block";

                break;
            case UPDATE:
                document.getElementById("error-image").style.display = "none";
                refData2.on("value", function (snap) {
                    var data = snap.val();

                    for (var key in data) {
                        try {
                            if (data[key].vrPlace == selection) {
                                console.log(data[key].vrPlace)

                                var data = {
                                    deviceModel: radioResult,
                                    price: price,
                                    vrIsland: data[key].vrIsland,
                                    vrPlace: data[key].vrPlace,
                                };
                                refEditDatabase.update(data);
                                break;

                            }
                        } catch (error) {
                            console.log(error);
                        }
                    }
                })
                modo = CREATE;
                document.getElementById("send-data").value = CREATE;
                break;
        }
        downloadURL = undefined
        modo = CREATE;
        document.getElementById("send-data").value = CREATE;
        database.reset();
    }

}

function logout() {
    firebase.auth().signOut().then(() => {
        console.log("user logged out")
        location.reload();
    }).catch((error) => {
        console.log(error.message)
    });
}

function deleteImageFromFirebase() {
    var imageDeleteDatabase = this.getAttribute("data-image");
    var refImageDeleteDatabase = refDatabase.child(imageDeleteDatabase);
    refImageDeleteDatabase.remove();
}



function administrator() {
    document.getElementById("sign-out").style.display = "block";
    document.getElementById("database").style.display = "block";
    document.getElementById("send-data1").style.display = "block";
    document.getElementById("alert").style.display = "block";
    document.getElementById("file").style.display = "none";
    document.getElementById("bar-for-progress").style.display = "none";
    document.getElementById("sign-in").style.display = "none";
    document.getElementById("error").style.display = "none";

}

function nonAdministrator() {

    document.getElementById("send-data1").style.display = "none";
    document.getElementById("alert").style.display = "none";
    document.getElementById("database").style.display = "block"
    document.getElementById("sign-in").style.display = "none";
    document.getElementById("error").style.display = "none";
}

function nonUser() {
    
    document.getElementById("sign-out").style.display = "none";
    document.getElementById("database").style.display = "none";
    document.getElementById("send-data1").style.display = "none";
    document.getElementById("alert").style.display = "none";
    document.getElementById("file").style.display = "none";
    document.getElementById("sign-in").style.display = "block";
    document.getElementById("bar-for-progress").style.display = "none";
    document.getElementById("footer").style.display = "none";
}

