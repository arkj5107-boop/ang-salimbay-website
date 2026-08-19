// =====================================================
// ANG SALIMBAY — FIREBASE REACTIONS
// =====================================================

import { initializeApp } from
    "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getFirestore,
    doc,
    onSnapshot,
    setDoc,
    increment
} from
    "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// =====================================================
// FIREBASE CONFIG
// PALITAN ANG VALUES SA IBABA NG ACTUAL FIREBASE CONFIG MO
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
// FIRESTORE DOCUMENT
// =====================================================

const reactionRef =
    doc(
        db,
        "reactions",
        articleId
    );


// =====================================================
// LOAD REACTIONS — REAL TIME
// =====================================================

function loadReactions(){

    onSnapshot(
        reactionRef,
        async (snapshot) => {

            try{

                // Kung wala pang document,
                // gagawa tayo ng initial values.

                if(!snapshot.exists()){

                    await setDoc(
                        reactionRef,
                        {
                            like: 0,
                            love: 0,
                            insightful: 0,
                            dislike: 0
                        }
                    );

                    return;

                }


                const data =
                    snapshot.data();


                updateReactionDisplay(
                    data
                );


            }catch(error){

                console.error(
                    "Firebase reaction listener error:",
                    error
                );

            }

        },

        (error) => {

            console.error(
                "Firebase connection error:",
                error
            );

        }
    );

}


// =====================================================
// DISPLAY REACTION COUNTS
// =====================================================

function updateReactionDisplay(data){

    const buttons =
        document.querySelectorAll(
            ".reaction-btn"
        );


    buttons.forEach(
        (button, index) => {

            const type =
                reactionTypes[index];


            const countElement =
                button.querySelector(
                    ".reaction-count"
                );


            if(countElement){

                countElement.textContent =
                    data[type] || 0;

            }

        }
    );

}


// =====================================================
// ADD REACTION
// =====================================================

async function addReaction(
    type,
    button
){

    if(
        !reactionTypes.includes(type)
    ){

        return;

    }


    try{

        // Dagdag ng +1 sa tamang reaction

        await setDoc(

            reactionRef,

            {
                [type]: increment(1)
            },

            {
                merge: true
            }

        );


        // Visual feedback

        button.classList.add(
            "active"
        );


        setTimeout(
            () => {

                button.classList.remove(
                    "active"
                );

            },
            350
        );


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


    buttons.forEach(
        (button, index) => {

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

        }
    );

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