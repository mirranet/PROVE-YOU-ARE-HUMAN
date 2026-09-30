import {
    initializeHandTracking,
    detectHands
} from "./camera/handTracking.js";

import {
    initializeFaceTracking,
    detectFace
} from "./camera/faceTracking.js";

import {
    detectRaisedHands
} from "./recognition/handGestures.js";

import {
    detectFaceGestures
} from "./recognition/faceGestures.js";

import {
    challenges
} from "./verification/challenges.js";

import {
    checkChallenge
} from "./verification/challengeChecker.js";


/* =========================
   ELEMENTS
========================= */

const landingScreen =
    document.getElementById("landing-screen");

const verificationScreen =
    document.getElementById("verification-screen");

const startButton =
    document.getElementById("start-button");

const retryCameraButton =
    document.getElementById("retry-camera");

const video =
    document.getElementById("camera-video");

const canvas =
    document.getElementById("tracking-canvas");

const cameraError =
    document.getElementById("camera-error");


/* =========================
   STATE
========================= */

let cameraStream = null;

let trackingStarted = false;

let currentChallengeIndex = 0;

let challengeCompleted = false;


/* =========================
   UI ELEMENTS
========================= */

const currentChallengeElement =
    document.getElementById(
        "current-challenge"
    );

const totalChallenges =
    document.getElementById(
        "total-challenges"
    );

const challengeTitle =
    document.getElementById(
        "challenge-title"
    );

const challengeDescription =
    document.getElementById(
        "challenge-description"
    );

const progressBar =
    document.getElementById(
        "progress-fill"
    );

const progressPercent =
    document.getElementById(
        "progress-percent"
    );

const feedbackBox =
    document.getElementById(
        "feedback-box"
    );

const feedbackText =
    document.getElementById(
        "feedback-message"
    );

const feedbackTitle =
    document.getElementById(
        "feedback-title"
    );

const handStatus =
    document.getElementById(
        "hand-status"
    );

const faceStatus =
    document.getElementById(
        "face-status"
    );

const movementStatus =
    document.getElementById(
        "movement-status"
    );


/* =========================
   SCREEN
========================= */

function showVerificationScreen() {

    landingScreen.classList.remove(
        "active"
    );

    verificationScreen.classList.add(
        "active"
    );
}


/* =========================
   CURRENT CHALLENGE
========================= */

function getCurrentChallenge() {

    return challenges[
        currentChallengeIndex
    ];
}


/* =========================
   UPDATE CHALLENGE UI
========================= */

function updateChallengeUI() {

    const challenge =
        getCurrentChallenge();


    if (!challenge) {
        return;
    }


    const number =
        String(
            currentChallengeIndex + 1
        ).padStart(2, "0");


    const total =
        String(
            challenges.length
        ).padStart(2, "0");


    /* Challenge counter */

    if (currentChallengeElement) {

        currentChallengeElement.textContent =
            number;
    }


    if (totalChallenges) {

        totalChallenges.textContent =
            total;
    }


    /* Challenge text */

    challengeTitle.textContent =
        challenge.title;


    challengeDescription.textContent =
        challenge.description;


    /* Progress */

    let progress = 0;


    if (challenges.length > 1) {

        progress =
            (
                currentChallengeIndex /
                (challenges.length - 1)
            ) * 100;
    }


    progress =
        Math.min(
            100,
            Math.max(
                0,
                progress
            )
        );


    progressBar.style.width =
        `${progress}%`;


    if (progressPercent) {

        progressPercent.textContent =
            `${Math.round(progress)}%`;
    }


    /* Status */

    if (handStatus) {

        handStatus.textContent =
            "WAITING";
    }


    if (faceStatus) {

        faceStatus.textContent =
            "WAITING";
    }


    if (movementStatus) {

        movementStatus.textContent =
            "WAITING";
    }


    setFeedback(
        "WAITING",
        "Waiting for movement..."
    );
}


/* =========================
   FEEDBACK
========================= */

function setFeedback(
    status,
    message
) {

    if (feedbackText) {

        feedbackText.textContent =
            message;
    }


    if (feedbackTitle) {

        if (status === "ERROR") {

            feedbackTitle.textContent =
                "CORRECTION REQUIRED";

        } else if (
            status === "SUCCESS"
        ) {

            feedbackTitle.textContent =
                "CHALLENGE COMPLETE";

        } else {

            feedbackTitle.textContent =
                "WAITING FOR MOVEMENT";
        }
    }


    if (feedbackBox) {

        feedbackBox.classList.remove(
            "feedback-waiting",
            "feedback-error",
            "feedback-success"
        );


        if (status === "ERROR") {

            feedbackBox.classList.add(
                "feedback-error"
            );

        } else if (
            status === "SUCCESS"
        ) {

            feedbackBox.classList.add(
                "feedback-success"
            );

        } else {

            feedbackBox.classList.add(
                "feedback-waiting"
            );
        }
    }
}


/* =========================
   CAMERA
========================= */

async function startCamera() {

    cameraError.classList.add(
        "hidden"
    );


    try {

        console.log(
            "Requesting camera..."
        );


        cameraStream =
            await navigator.mediaDevices
                .getUserMedia({

                    video: {
                        facingMode: "user",

                        width: {
                            ideal: 1280
                        },

                        height: {
                            ideal: 720
                        }
                    },

                    audio: false
                });


        console.log(
            "Camera success"
        );


        video.srcObject =
            cameraStream;


        await video.play();


        console.log(
            "Video:",
            video.videoWidth,
            video.videoHeight
        );


    } catch (error) {

        console.error(
            "Camera error:",
            error
        );


        cameraError.classList.remove(
            "hidden"
        );


        return;
    }


    /* =========================
       MEDIAPIPE
    ========================= */

    try {

        console.log(
            "Initializing Hand Tracking..."
        );


        await initializeHandTracking(
            canvas
        );


        console.log(
            "Hand Tracking initialized"
        );


        console.log(
            "Initializing Face Tracking..."
        );


        await initializeFaceTracking();


        console.log(
            "Face Tracking initialized"
        );


        /* =========================
           START
        ========================= */

        trackingStarted = true;

        currentChallengeIndex = 0;

        challengeCompleted = false;


        updateChallengeUI();


        requestAnimationFrame(
            trackingLoop
        );


    } catch (error) {

        console.error(
            "MediaPipe initialization error:",
            error
        );


        setFeedback(
            "ERROR",
            "Failed to initialize camera tracking."
        );
    }
}


/* =========================
   TRACKING LOOP
========================= */

function trackingLoop() {

    if (!trackingStarted) {
        return;
    }


    /* =========================
       HAND TRACKING
    ========================= */

    const handResults =
        detectHands(
            video,
            canvas
        );


    const hands =
        detectRaisedHands(
            handResults
        );


    /* =========================
       FACE TRACKING
    ========================= */

    const faceResults =
        detectFace(
            video
        );


    const face =
        detectFaceGestures(
            faceResults
        );


    /* =========================
       HAND STATUS
    ========================= */

    if (handStatus) {

        handStatus.textContent =
            hands.length > 0
                ? "DETECTED"
                : "WAITING";
    }


    /* =========================
       FACE STATUS
    ========================= */

    if (faceStatus) {

        faceStatus.textContent =
            face
                ? "DETECTED"
                : "WAITING";
    }


    /* =========================
       CURRENT CHALLENGE
    ========================= */

    const challenge =
        getCurrentChallenge();


    if (!challenge) {

        finishVerification();

        return;
    }


    /* =========================
       CHECK CHALLENGE
    ========================= */

    const result =
        checkChallenge(
            challenge,
            hands,
            face
        );


    /* =========================
       UPDATE FEEDBACK
    ========================= */

    if (!challengeCompleted) {

        setFeedback(
            result.status,
            result.feedback
        );


        if (movementStatus) {

            movementStatus.textContent =
                result.status === "SUCCESS"
                    ? "SUCCESS"

                    : result.status === "ERROR"
                        ? "CORRECTING"

                        : "WAITING";
        }
    }


    /* =========================
       SUCCESS
    ========================= */

    if (
        result.status === "SUCCESS" &&
        !challengeCompleted
    ) {

        challengeCompleted = true;


        setFeedback(
            "SUCCESS",
            result.feedback
        );


        if (movementStatus) {

            movementStatus.textContent =
                "SUCCESS";
        }


        setTimeout(
            nextChallenge,
            1200
        );
    }


    requestAnimationFrame(
        trackingLoop
    );
}


/* =========================
   NEXT CHALLENGE
========================= */

function nextChallenge() {

    currentChallengeIndex++;


    if (
        currentChallengeIndex >=
        challenges.length
    ) {

        finishVerification();

        return;
    }


    challengeCompleted = false;


    updateChallengeUI();
}


/* =========================
   FINISH
========================= */

function finishVerification() {

    trackingStarted = false;


    progressBar.style.width =
        "100%";


    if (progressPercent) {

        progressPercent.textContent =
            "100%";
    }


    if (currentChallengeElement) {

        currentChallengeElement.textContent =
            "✓";
    }


    if (totalChallenges) {

        totalChallenges.textContent =
            "";
    }


    challengeTitle.textContent =
        "HUMAN VERIFIED";


    challengeDescription.textContent =
        "Verification completed successfully.";


    if (handStatus) {

        handStatus.textContent =
            "COMPLETE";
    }


    if (faceStatus) {

        faceStatus.textContent =
            "COMPLETE";
    }


    if (movementStatus) {

        movementStatus.textContent =
            "VERIFIED";
    }


    setFeedback(
        "SUCCESS",
        "✓ All verification challenges completed."
    );


    console.log(
        "VERIFICATION COMPLETE"
    );
}


/* =========================
   START BUTTON
========================= */

startButton.addEventListener(
    "click",
    async () => {

        showVerificationScreen();

        await startCamera();
    }
);


/* =========================
   RETRY CAMERA
========================= */

retryCameraButton.addEventListener(
    "click",
    async () => {

        await startCamera();
    }
);


/* =========================
   CLEANUP
========================= */

window.addEventListener(
    "beforeunload",
    () => {

        if (!cameraStream) {
            return;
        }


        cameraStream
            .getTracks()
            .forEach(
                track => track.stop()
            );
    }
);