// ==========================
// FIREBASE IMPORTS
// ==========================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    setPersistence,
    browserLocalPersistence,
    updatePassword,
    EmailAuthProvider,
    reauthenticateWithCredential
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

import {
    initializeFirestore,
    persistentLocalCache,
    doc,
    setDoc,
    serverTimestamp,
    collection,
    query,
    where,
    getDocs,
    onSnapshot,
    orderBy,
    addDoc,
    getDoc,
    limit,
    deleteDoc,
    updateDoc,
    arrayUnion,
    arrayRemove
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ==========================
// FIREBASE CONFIG
// ==========================
const firebaseConfig = {
    apiKey: "AIzaSyB0Fn4NJN0jsiA4rt9fwp70cABpHFfLThU",
    authDomain: "smail-6.firebaseapp.com",
    projectId: "smail-6",
    storageBucket: "smail-6.firebasestorage.app",
    messagingSenderId: "817477407437",
    appId: "1:817477407437:web:35e4fe351b548e2e7ccf84",
    measurementId: "G-HC5RNXE4DB"
};

// ==========================
// FIREBASE INIT
// ==========================
const app = initializeApp(firebaseConfig);

const db = initializeFirestore(app, {
    localCache: persistentLocalCache({})
});

const auth = getAuth(app);

export { app, db, auth };

// ==========================
// AUTH OBSERVER
// ==========================
window.observeAuthState = (callback) => {
    return onAuthStateChanged(auth, (user) => {
        if (user) {
            callback({
                loggedIn: true,
                uid: user.uid
            });
        } else {
            callback({
                loggedIn: false
            });
        }
    });
};

// ==========================
// LOGIN
// ==========================
window.loginUserToFirebase = async (email, password) => {
    try {

        await setPersistence(
            auth,
            browserLocalPersistence
        );

        const userCredential =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

        return {
            success: true,
            uid: userCredential.user.uid
        };

    } catch (error) {

        return {
            success: false,
            error: error.message
        };

    }
};

// ==========================
// LOGOUT
// ==========================
window.logoutUser = async () => {
    try {

        await auth.signOut();

        return {
            success: true
        };

    } catch (error) {

        return {
            success: false,
            error: error.message
        };

    }
};

// ==========================
// REGISTER
// ==========================
window.registerUserToFirebase = async (userData) => {
    try {

        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                userData.smail,
                userData.password
            );

        const user = userCredential.user;

        const smailLower =
            userData.smail.toLowerCase();

        await setDoc(
            doc(db, "users", user.uid),
            {
                surName: userData.surName,
                nickName: userData.nickName,
                gender: userData.gender,
                usage: userData.usage,
                name: userData.name,
                dOB: userData.dOB,
                smail: smailLower,
                password: userData.password,
                uid: user.uid
            }
        );

        await setDoc(
            doc(db, "public_profiles", user.uid),
            {
                smail: smailLower,
                uid: user.uid
            }
        );

        return {
            success: true,
            uid: user.uid
        };

    } catch (error) {

        return {
            success: false,
            error: error.message
        };

    }
};

// ==========================
// GET MESSAGES
// ==========================
window.getMessages = (uid, callback) => {

    const q = query(
        collection(db, "users", uid, "inbox"),
        orderBy("time", "desc")
    );

    return onSnapshot(q, (snapshot) => {

        callback(
            snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
        );

    });

};

// ==========================
// GET SENT MESSAGES
// ==========================
window.getSentMessages = (uid, callback) => {

    const q = query(
        collection(db, "users", uid, "sent"),
        orderBy("time", "desc")
    );

    return onSnapshot(q, (snapshot) => {

        callback(
            snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
        );

    });

};

// ==========================
// SEARCH USERS
// ==========================
window.searchUsers = async (searchText) => {

    try {

        if (!searchText) return [];

        const searchLower =
            searchText.toLowerCase().trim();

        const q = query(
            collection(db, "public_profiles"),
            where("smail", ">=", searchLower),
            where("smail", "<=", searchLower + "\uf8ff"),
            limit(10)
        );

        const querySnapshot =
            await getDocs(q);

        return querySnapshot.docs.map(
            doc => doc.data()
        );

    } catch (error) {

        return [];

    }

};

// ==========================
// MARK AS READ
// ==========================
window.markAsRead = async (
    uid,
    messageId
) => {

    try {

        await updateDoc(
            doc(
                db,
                "users",
                uid,
                "inbox",
                messageId
            ),
            {
                isRead: true
            }
        );

        return {
            success: true
        };

    } catch (error) {

        return {
            success: false
        };

    }

};

// ==========================
// GET USER DETAILS
// ==========================
window.getUserDetails = async (uid) => {

    try {

        const docSnap =
            await getDoc(
                doc(db, "users", uid)
            );

        return docSnap.exists()
            ? {
                success: true,
                data: docSnap.data()
            }
            : {
                success: false
            };

    } catch (error) {

        return {
            success: false,
            error: error.message
        };

    }

};

// ==========================
// VERIFY PASSWORD
// ==========================
window.verifyUserPassword = async (
    password
) => {

    try {

        const user = auth.currentUser;

        if (!user) {

            return {
                success: false,
                error: "No user logged in"
            };

        }

        const credential =
            EmailAuthProvider.credential(
                user.email,
                password
            );

        await reauthenticateWithCredential(
            user,
            credential
        );

        return {
            success: true
        };

    } catch (error) {

        return {
            success: false,
            error: "Incorrect Password. Please try again."
        };

    }

};

// ==========================
// UPDATE USER PROFILE
// ==========================
window.updateUserProfile = async (
    uid,
    data
) => {

    try {

        const userRef =
            doc(db, "users", uid);

        if (data.password) {

            const user =
                auth.currentUser;

            if (user) {

                await updatePassword(
                    user,
                    data.password
                );

            }

        }

        await updateDoc(userRef, {
            ...data,
            updatedAt:
                new Date().toISOString()
        });

        return {
            success: true
        };

    } catch (error) {

        return {
            success: false,
            error: error.message
        };

    }

};