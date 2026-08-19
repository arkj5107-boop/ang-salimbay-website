// =====================================================
// ANG SALIMBAY — FIREBASE REACTIONS
// =====================================================

import { initializeApp } from
    "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    increment
} from
    "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// =====================================================
// FIREBASE CONFIG
// PALITAN ITO NG CONFIG MULA SA FIREBASE CONSOLE
// =====================================================

const firebaseConfig = {

    apiKey: "ILAGAY_DITO",

    authDomain: "ILAGAY_DITO",

    projectId: "ILAGAY_DITO",

    storageBucket: "ILAGAY_DITO",

    messagingSenderId: "ILAGAY_DITO",

    appId: "ILAGAY_DITO"

};


// =====================================================
// INITIALIZE FIREBASE
// =====================================================

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


// =====================================================
// ARTICLE ID
// =====================================================

const articleId = "sisi";


// =====================================================
// REACTION TYPES
// =====================================================

const reactionTypes = [
    "like",
    "love",
    "insightful",
    "dislike"
];


// =====================================================
// GET REACTION COUNTS
// =====================================================

async function loadReactions(){

    try{

        const reactionRef =
            doc(db, "reactions", articleId);

        const reactionSnap =
            await getDoc(reactionRef);


        if(!reactionSnap.exists()){

            await setDoc(reactionRef, {

                like: 0,
                love: 0,
                insightful: 0,
                dislike: 0

            });

            updateReactionDisplay({
                like: 0,
                love: 0,
                insightful: 0,
                dislike: 0
            });

            return;
        }


        updateReactionDisplay(
            reactionSnap.data()
        );

    }catch(error){

        console.error(
            "Firebase error:",
            error
        );

    }

}


// =====================================================
// DISPLAY COUNTS
// =====================================================

function updateReactionDisplay(data){

    const buttons =
        document.querySelectorAll(
            ".reaction-btn"
        );


    buttons.forEach((button, index) => {

        const type =
            reactionTypes[index];

        const count =
            button.querySelector(
                ".reaction-count"
            );


        if(count){

            count.textContent =
                data[type] || 0;

        }

    });

}


// =====================================================
// ADD REACTION
// =====================================================

async function addReaction(type, button){

    if(!reactionTypes.includes(type)){
        return;
    }


    try{

        const reactionRef =
            doc(db, "reactions", articleId);


        await setDoc(

            reactionRef,

            {
                [type]: increment(1)
            },

            {
                merge:true
            }

        );


        button.classList.add("active");


        await loadReactions();


    }catch(error){

        console.error(
            "Failed to add reaction:",
            error
        );

    }

}


// =====================================================
// BUTTON EVENTS
// =====================================================

function setupReactionButtons(){

    const buttons =
        document.querySelectorAll(
            ".reaction-btn"
        );


    buttons.forEach((button, index) => {

        const type =
            reactionTypes[index];


        button.addEventListener(
            "click",
            () => {

                addReaction(
                    type,
                    button
                );

            }
        );

    });

}


// =====================================================
// START
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupReactionButtons();

        loadReactions();

    }
);