
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const loginButton = document.getElementById("loginButton");
const signupButton = document.getElementById("signupButton");
const guestButton = document.getElementById("guestButton");

guestButton.addEventListener("click", handleGuest);
function handleGuest() {
    firebase.auth().signOut()
        .then(() => {
            console.log("Signed out successfully for guest browsing.");
            window.location.href = "home.html";
        })
        .catch((error) => {
            console.error("Error signing out:", error);
            // still go to home.html even if there's an error
            window.location.href = "home.html";
        });
}

loginButton.addEventListener("click", handleLogIn);
function handleLogIn() {

    const username = usernameInput.value;
    const password = passwordInput.value;

    if (!username || !password) {
        alert("Please enter a username and password");
        return;
    }

    //makes it so the users dont have to use an email
    const fakeEmail = convertUsername(username);

    firebase.auth().signInWithEmailAndPassword(fakeEmail, password)
        .then(() => {
            window.location.href = "home.html";
        })
        .catch((error) => {
            alert("Login failed: " + error.message);

        });

}

signupButton.addEventListener('click', handleSignUp);

function handleSignUp() {
    const username = usernameInput.value;
    const password = passwordInput.value;

    if(!username || !password) {
        alert("Please enter a username and password");
        return;
    }

    const fakeEmail = convertUsername(username);

     firebase.auth().createUserWithEmailAndPassword(fakeEmail, password)
        .then(() => {
            alert("Account created successfully!");
            window.location.href = "home.html";
        })
        .catch((error) => {
            alert("Signup failed: " + error.message);
        });

}

//changes username to a fake email so users dont have to type in an email
function convertUsername(username) {
    return `${username}@gearboxd.notreal`;
}