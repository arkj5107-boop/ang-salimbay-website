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
// ARTICLE
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
// REACTION DOCUMENT
// =====================================================

const reactionRef = doc(
    db,
    "reactions",
    articleId
);


// =====================================================
// LOAD REACTIONS
// =====================================================

async function loadReactions(){

    try{

        const snapshot =
            await getDoc(reactionRef);


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

            updateReactionDisplay({
                like: 0,
                love: 0,
                insightful: 0,
                dislike: 0
            });

            return;
        }


        const data = snapshot.data();

        updateReactionDisplay(data);


    }catch(error){

        console.error(
            "ERROR LOADING REACTIONS:",
            error
        );

    }

}


// =====================================================
// UPDATE NUMBERS IN HTML
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

            const counter =
                button.querySelector(
                    ".reaction-count"
                );


            if(counter){

                counter.textContent =
                    data[type] ?? 0;

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

    try{

        console.log(
            "Reaction clicked:",
            type
        );


        await setDoc(
            reactionRef,
            {
                [type]: increment(1)
            },
            {
                merge: true
            }
        );


        button.classList.add(
            "active"
        );


        await loadReactions();


    }catch(error){

        console.error(
            "ERROR ADDING REACTION:",
            error
        );

        alert(
            "Hindi maidagdag ang reaction. Pakicheck ang Firebase configuration at Firestore Rules."
        );

    }

}


// =====================================================
// SETUP BUTTONS
// =====================================================

function setupReactionButtons(){

    const buttons =
        document.querySelectorAll(
            ".reaction-btn"
        );


    console.log(
        "Reaction buttons found:",
        buttons.length
    );


    buttons.forEach(
        (button, index) => {

            const type =
                reactionTypes[index];


            if(!type){
                return;
            }


            button.addEventListener(
                "click",
                function(){

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
    function(){

        setupReactionButtons();

        loadReactions();

    }
);