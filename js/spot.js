/* var ws = new WebSocket("ws://127.0.0.1:5678/");
ws.onmessage = function (event) {
    console.log(event.data);
};
 */
const REFRESH = 100;
const DX = 1, DY = 1;

let a1 = 0, a2 = 0;
let dir = 1;
let mode = "";

function init() {
    console.log("Init");

    let md = document.getElementById("sims");
    md.value = "stand";
    mode = "stand";

    setInterval(loop, REFRESH);
};

function combo(thelist) {
    let idx = thelist.selectedIndex;
    mode = thelist.options[idx].innerHTML;
    a1 = 1;
}

function loop() {
    if (mode == "swipe") {
        loop_1();
    }
    else if (mode == "positions") {
        loop_2(a1);
    }
    else if (mode == "bezier") {
        loop_3(a1);
    }
    else if (mode == "stand") {
        stand();
    }
    else if (mode == "sit") {
        sit();
    }
}

function moveNext(leg, target_x, target_y) {
    let x, y, dx = 0, dy = 0;
    x = Math.round(leg.X2);
    y = Math.round(leg.Y2);
    if (x < target_x) dx = DX;
    else if (x > target_x) dx = -DX;
    if (y < target_y) dy = DY;
    else if (y > target_y) dy = -DY;
    if ((dx != 0) || (dy != 0)) {
        console.log(x, y);
        leg.setTarget(x + dx, y + dy);
        leg.calcInverseKinematics();
    }
}

function sit() {
    moveNext(FL_leg, 0, 0);
    moveNext(FR_leg, 0, 0);
    moveNext(RL_leg, 0, 0);
    moveNext(RR_leg, 0, 0);
    drawRobot();
}

function stand() {
    moveNext(FL_leg, 0, 20);
    moveNext(FR_leg, 0, 20);
    moveNext(RL_leg, 0, 20);
    moveNext(RR_leg, 0, 20);
    drawRobot();
}

// Angle swipe loop (forward kinematic)
// Swipe both theta angles
function loop_1() {
    // Simulate movement by using forward kinematics
    a1 += dir;
    a2 += dir;
    if (a1 == 45) dir = -1;
    else if (a1 == -45) dir = 1;

    FL_leg.setTheta1(a1 * Math.PI / 180);
    FL_leg.setTheta2(a2 * Math.PI / 180);
    FL_leg.calcForwardKinematics();

    RL_leg.setTheta1(a1 * Math.PI / 180);
    RL_leg.setTheta2(a2 * Math.PI / 180);
    RL_leg.calcForwardKinematics();

    FR_leg.setTheta1(a1 * Math.PI / 180);
    FR_leg.setTheta2(a2 * Math.PI / 180);
    FR_leg.calcForwardKinematics();

    RR_leg.setTheta1(a1 * Math.PI / 180);
    RR_leg.setTheta2(a2 * Math.PI / 180);
    RR_leg.calcForwardKinematics();

    drawRobot();
}

// Position change (inverse kinematic)
function loop_2(step) {
    let x = 0;
    let y = step;
    // test inverse kenematics
    FL_leg.setTarget(x, y);
    FL_leg.calcInverseKinematics();

    FR_leg.setTarget(x, y);
    FR_leg.calcInverseKinematics();

    RL_leg.setTarget(x, y);
    RL_leg.calcInverseKinematics();

    RR_leg.setTarget(x, y);
    RR_leg.calcInverseKinematics();
    drawRobot();
    a1 += dir;
    if ((a1 == 30) || (a1 == 0)) dir = -dir;
}

// Bezier path (inverse kinematic)
function loop_3(step) {
    FL_leg.setPath(a1 / 10);
    FL_leg.calcInverseKinematics();

    FR_leg.setPath(a1 / 10);
    FR_leg.calcInverseKinematics();

    RL_leg.setPath(a1 / 10);
    RL_leg.calcInverseKinematics();

    RR_leg.setPath(a1 / 10);
    RR_leg.calcInverseKinematics();

    drawRobot();
    a1 += dir;
    if ((a1 == 10) || (a1 == 0)) {
        dir = -dir;
        FL_leg.reversePath();
        FR_leg.reversePath();
        RL_leg.reversePath();
        RR_leg.reversePath();
    }
}
