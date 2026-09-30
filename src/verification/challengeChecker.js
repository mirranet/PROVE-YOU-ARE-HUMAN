export function checkChallenge(challenge, hands, face) {

    /* =========================
       NO HAND
    ========================= */

    if (!hands || hands.length === 0) {
        return {
            status: "WAITING",
            feedback: "Show your hand to the camera."
        };
    }


    /* =========================
       RIGHT HAND
    ========================= */

    if (challenge.id === "RIGHT_HAND_UP") {

        const rightHand = hands.find(
            hand => hand.hand === "Right"
        );

        if (!rightHand) {
            return {
                status: "ERROR",
                feedback:
                    "Right hand not detected. Raise your right hand."
            };
        }

        if (!rightHand.raised) {
            return {
                status: "ERROR",
                feedback:
                    "Raise your right hand higher."
            };
        }

        return {
            status: "SUCCESS",
            feedback:
                "Right hand detected."
        };
    }


    /* =========================
       LEFT HAND
    ========================= */

    if (challenge.id === "LEFT_HAND_UP") {

        const leftHand = hands.find(
            hand => hand.hand === "Left"
        );

        if (!leftHand) {
            return {
                status: "ERROR",
                feedback:
                    "Left hand not detected. Raise your left hand."
            };
        }

        if (!leftHand.raised) {
            return {
                status: "ERROR",
                feedback:
                    "Raise your left hand higher."
            };
        }

        return {
            status: "SUCCESS",
            feedback:
                "Left hand detected."
        };
    }


    /* =========================
       THREE FINGERS
    ========================= */

    if (challenge.id === "THREE_FINGERS") {

        const hand = hands[0];

        if (hand.fingers === 3) {
            return {
                status: "SUCCESS",
                feedback:
                    "Three fingers detected."
            };
        }

        return {
            status: "ERROR",
            feedback:
                `Detected ${hand.fingers} fingers. Required 3.`
        };
    }


    /* =========================
       FIST
    ========================= */

    if (challenge.id === "FIST") {

        const hand = hands[0];

        if (hand.fingers === 0) {
            return {
                status: "SUCCESS",
                feedback:
                    "Fist detected."
            };
        }

        return {
            status: "ERROR",
            feedback:
                "Close your hand completely."
        };
    }


    /* =========================
       OPEN PALM
    ========================= */

    if (challenge.id === "OPEN_PALM") {

        const hand = hands[0];

        if (hand.fingers === 5) {
            return {
                status: "SUCCESS",
                feedback:
                    "Open palm detected."
            };
        }

        return {
            status: "ERROR",
            feedback:
                `Detected ${hand.fingers} fingers. Open your palm.`
        };
    }

    /* =========================
    LOOK LEFT
    ========================= */

    if (challenge.id === "LOOK_LEFT") {

        if (!face) {
            return {
                status: "WAITING",
                feedback:
                    "Face not detected. Look at the camera."
            };
        }

        if (face.lookDirection === "LEFT") {
            return {
                status: "SUCCESS",
                feedback:
                    "Left direction detected."
            };
        }

        return {
            status: "ERROR",
            feedback:
                "Turn your head to the left."
        };
    }


    /* =========================
    LOOK RIGHT
    ========================= */

    if (challenge.id === "LOOK_RIGHT") {

        if (!face) {
            return {
                status: "WAITING",
                feedback:
                    "Face not detected. Look at the camera."
            };
        }

        if (face.lookDirection === "RIGHT") {
            return {
                status: "SUCCESS",
                feedback:
                    "Right direction detected."
            };
        }

        return {
            status: "ERROR",
            feedback:
                "Turn your head to the right."
        };
    }


    /* =========================
    HEAD LEFT
    ========================= */

    if (challenge.id === "HEAD_LEFT") {

        if (!face) {
            return {
                status: "WAITING",
                feedback:
                    "Face not detected."
            };
        }

        if (face.headTilt === "LEFT") {
            return {
                status: "SUCCESS",
                feedback:
                    "Head tilted left."
            };
        }

        return {
            status: "ERROR",
            feedback:
                "Tilt your head to the left."
        };
    }


    /* =========================
    HEAD RIGHT
    ========================= */

    if (challenge.id === "HEAD_RIGHT") {

        if (!face) {
            return {
                status: "WAITING",
                feedback:
                    "Face not detected."
            };
        }

        if (face.headTilt === "RIGHT") {
            return {
                status: "SUCCESS",
                feedback:
                    "Head tilted right."
            };
        }

        return {
            status: "ERROR",
            feedback:
                "Tilt your head to the right."
        };
    }


    /* =========================
    OPEN MOUTH
    ========================= */

    if (challenge.id === "OPEN_MOUTH") {

        if (!face) {
            return {
                status: "WAITING",
                feedback:
                    "Face not detected."
            };
        }

        if (face.mouthOpen) {
            return {
                status: "SUCCESS",
                feedback:
                    "Mouth opening detected."
            };
        }

        return {
            status: "ERROR",
            feedback:
                "Open your mouth."
        };
    }


    /* =========================
       UNKNOWN
    ========================= */

    return {
        status: "WAITING",
        feedback: "Waiting for movement..."
    };
}