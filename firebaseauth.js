// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCzkDAkDpEdOijtKMb9F0jAwIO0BRg-oSw",
    authDomain: "login-page-7f976.firebaseapp.com",
    projectId: "login-page-7f976",
    storageBucket: "login-page-7f976.appspot.com",
    messagingSenderId: "1007118546590",
    appId: "1:1007118546590:web:2ed0f2f3851a0f6ec3ed8f",
    measurementId: "G-VJG1LBM777"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Google Sign-In Function
function signInWithGoogle() {
    signInWithPopup(auth, provider)
        .then(async (result) => {
            const user = result.user;
            console.log("User signed in:", user);

            // Check if user exists in Firestore
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                // Store new user data in Firestore
                await setDoc(userRef, {
                    name: user.displayName,
                    email: user.email,
                    profilePic: user.photoURL
                });
            }

            localStorage.setItem("loggedInUserId", user.uid);
            window.location.href = "user-form.html"; // Redirect to user details form
        })
        .catch((error) => {
            console.error("Error during Google Sign-In:", error);
            alert("Google Sign-In Failed: " + error.message);
        });
}

// Email and Password Sign-Up Function
function signUpUser(email, password, firstName, lastName) {
    createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            const user = userCredential.user;

            // Save user data in Firestore
            const userData = {
                email: email,
                firstName: firstName,
                lastName: lastName
            };

            await setDoc(doc(db, "users", user.uid), userData);

            alert("Account Created Successfully");
            window.location.href = "user-form.html"; // Redirect after signup
        })
        .catch((error) => {
            alert("Sign-Up Error: " + error.message);
        });
}

// Email and Password Sign-In Function
function signInUser(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            localStorage.setItem("loggedInUserId", user.uid);
            window.location.href = "user-form.html"; // Redirect after login
        })
        .catch((error) => {
            alert("Incorrect Email or Password");
        });
}

// Attach event listeners
document.getElementById("google-signin-btn").addEventListener("click", signInWithGoogle);
document.getElementById("submitSignUp").addEventListener("click", (event) => {
    event.preventDefault();
    const email = document.getElementById("rEmail").value;
    const password = document.getElementById("rPassword").value;
    const firstName = document.getElementById("fName").value;
    const lastName = document.getElementById("lName").value;
    signUpUser(email, password, firstName, lastName);
});
document.getElementById("submitSignIn").addEventListener("click", (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    signInUser(email, password);
});
