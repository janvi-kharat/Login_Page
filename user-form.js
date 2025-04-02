import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";


// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCzkDAkDpEdOijtKMb9F0jAwIO0BRg-oSw",
    authDomain: "login-page-7f976.firebaseapp.com",
    projectId: "login-page-7f976",
    storageBucket: "login-page-7f976.firebasestorage.app",
    messagingSenderId: "1007118546590",
    appId: "1:1007118546590:web:2ed0f2f3851a0f6ec3ed8f",
    measurementId: "G-VJG1LBM777"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


// Get elements
const firstName = document.getElementById("firstName");
const middleName = document.getElementById("middleName");
const lastName = document.getElementById("lastName");
const mobileNumber = document.getElementById("mobileNumber");
const birthdate = document.getElementById("birthdate");
const saveBtn = document.getElementById("saveBtn");
const editBtn = document.getElementById("editBtn");

// Check if user is logged in
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const data = userSnap.data();
            firstName.value = data.firstName || "";
            middleName.value = data.middleName || "";
            lastName.value = data.lastName || "";
            mobileNumber.value = data.mobileNumber || "";
            birthdate.value = data.birthdate || "";

            saveBtn.style.display = "none";
            editBtn.style.display = "block";
        }
    } else {
        window.location.href = "index.html";  // Redirect if not logged in
    }
});

// Save user details
saveBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    const user = auth.currentUser;

    if (user) {
        const userData = {
            firstName: firstName.value,
            middleName: middleName.value,
            lastName: lastName.value,
            mobileNumber: mobileNumber.value,
            birthdate: birthdate.value
        };

        await setDoc(doc(db, "users", user.uid), userData, { merge: true });
        alert("Data saved successfully!");
        saveBtn.style.display = "none";
        editBtn.style.display = "block";
    }
});

// Edit user details
editBtn.addEventListener("click", async () => {
    saveBtn.style.display = "block";
    editBtn.style.display = "none";
});
