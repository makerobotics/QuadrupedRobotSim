var ws = new WebSocket("ws://127.0.0.1:5678/");
    ws.onmessage = function (event) {
        console.log(event.data);
};

let a1 = 0, a2 = 0;
let dir = 1;
let mode = "";

function init() {
   console.log("Init");

   let md = document.getElementById("sims");
   md.value = "bezier";
   mode = "bezier";

   setInterval(loop, REFRESH);
};

function combo(thelist) {
   let idx = thelist.selectedIndex;
   mode = thelist.options[idx].innerHTML;
   a1 = 1;
}

function loop(){
   if(mode=="swipe") {
      loop_1();
   }
   else if(mode == "positions"){
      loop_2(a1);
   }
   else if(mode == "bezier"){
      loop_3(a1);
   }
}


function standby(){
    let x = 0;
    let y = 0;
    
    FL_leg.setTarget(x, y);
    FL_leg.calcInverseKinematics();
    
    FR_leg.setTarget(x, y);
    FR_leg.calcInverseKinematics();
    
    RL_leg.setTarget(x, y);
    RL_leg.calcInverseKinematics();
    
    RR_leg.setTarget(x, y);
    RR_leg.calcInverseKinematics();
    drawRobot();
}

// Angle swipe loop (forward kinematic)
// Swipe both theta angles
function loop_1(){
    // Simulate movement by using forward kinematics
    a1 += dir;
    a2 += dir;
    if(a1 == 45) dir = -1;
    else if(a1 == -45) dir = 1;

    FL_leg.setTheta1(a1*Math.PI/180);
    FL_leg.setTheta2(a2*Math.PI/180);
    FL_leg.calcForwardKinematics();

    RL_leg.setTheta1(a1*Math.PI/180);
    RL_leg.setTheta2(a2*Math.PI/180);
    RL_leg.calcForwardKinematics();

    FR_leg.setTheta1(a1*Math.PI/180);
    FR_leg.setTheta2(a2*Math.PI/180);
    FR_leg.calcForwardKinematics();

    RR_leg.setTheta1(a1*Math.PI/180);
    RR_leg.setTheta2(a2*Math.PI/180);
    RR_leg.calcForwardKinematics();
    
    drawRobot();
}

// Position change (inverse kinematic)
function loop_2(step){
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
    a1+=dir;
    if((a1==30) || (a1==0)) dir = -dir;
}

// Bezier path (inverse kinematic)
function loop_3(step){
    FL_leg.setPath(a1/10);
    FL_leg.calcInverseKinematics();
 
    FR_leg.setPath(a1/10);
    FR_leg.calcInverseKinematics();
    
    RL_leg.setPath(a1/10);
    RL_leg.calcInverseKinematics();
    
    RR_leg.setPath(a1/10);
    RR_leg.calcInverseKinematics();

    drawRobot();
    a1+=dir;
    if((a1 == 10) || (a1 == 0)){
        dir = -dir;
        FL_leg.reversePath();
        FR_leg.reversePath();
        RL_leg.reversePath();
        RR_leg.reversePath();
    }
}
