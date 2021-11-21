const canv = document.getElementById("myCanvas2d");
const SIDE_OFFSET_X = 200, SIDE_OFFSET_Y = 10;
const FRONT_OFFSET_X = 200, FRONT_OFFSET_Y = 150;
const DRAW_FACTOR = 2;
const REFRESH = 100;

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

// Angle swipe loop (forward kinematic)
function loop_1(){
   move_1();
   drawRobot();
}

// Position change (inverse kinematic)
function loop_2(step){
   move_2(0, step);
   drawRobot();
   a1+=dir;
   if((a1==30) || (a1==0)) dir = -dir;
}

// Bezier path (inverse kinematic)
function loop_3(step){
   move_3();
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

// Swipe both theta angles
function move_1(){
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
};

// set different positions with inverse kinematics
function move_2(x, y){
   // test inverse kenematics
   FL_leg.setTarget(x, y);
   FL_leg.calcInverseKinematics();
   
   FR_leg.setTarget(x, y);
   FR_leg.calcInverseKinematics();
   
   RL_leg.setTarget(x, y);
   RL_leg.calcInverseKinematics();
   
   RR_leg.setTarget(x, y);
   RR_leg.calcInverseKinematics();
}

function move_3(){
   FL_leg.setPath(a1/10);
   FL_leg.calcInverseKinematics();

   FR_leg.setPath(a1/10);
   FR_leg.calcInverseKinematics();
   
   RL_leg.setPath(a1/10);
   RL_leg.calcInverseKinematics();
   
   RR_leg.setPath(a1/10);
   RR_leg.calcInverseKinematics();
}

function drawLeg(context, leg){

   context.lineWidth = 1;
   context.strokeStyle = "#000000";

   // Side view
   context.beginPath();
   context.moveTo(SIDE_OFFSET_X+leg.longPos*DRAW_FACTOR, SIDE_OFFSET_Y);
   context.lineTo(SIDE_OFFSET_X+leg.longPos*DRAW_FACTOR+leg.X1*DRAW_FACTOR, SIDE_OFFSET_Y+leg.Y1*DRAW_FACTOR);
   context.lineTo(SIDE_OFFSET_X+leg.longPos*DRAW_FACTOR+leg.X2*DRAW_FACTOR, SIDE_OFFSET_Y+leg.Y2*DRAW_FACTOR);
   context.stroke();
   // Articulations
   context.fillStyle = "#FF0000";
   context.fillRect(SIDE_OFFSET_X+leg.longPos*DRAW_FACTOR+leg.X1*DRAW_FACTOR-2, SIDE_OFFSET_Y+leg.Y1*DRAW_FACTOR-2, 5, 5);
   context.fillStyle = "#0000FF";
   context.fillRect(SIDE_OFFSET_X+leg.longPos*DRAW_FACTOR+leg.X2*DRAW_FACTOR-2, SIDE_OFFSET_Y+leg.Y2*DRAW_FACTOR-2, 5, 5);

   // Front view
   context.beginPath();
   context.moveTo(FRONT_OFFSET_X+leg.latPos*DRAW_FACTOR, FRONT_OFFSET_Y);
   context.lineTo(FRONT_OFFSET_X+leg.latPos*DRAW_FACTOR+leg.Z1*DRAW_FACTOR, FRONT_OFFSET_Y+leg.Y1*DRAW_FACTOR);
   context.lineTo(FRONT_OFFSET_X+leg.latPos*DRAW_FACTOR+leg.Z2*DRAW_FACTOR, FRONT_OFFSET_Y+leg.Y2*DRAW_FACTOR);
   context.stroke();
   // Articulations
   context.fillStyle = "#FF0000";
   context.fillRect(FRONT_OFFSET_X+leg.latPos*DRAW_FACTOR+leg.Z1*DRAW_FACTOR-2, FRONT_OFFSET_Y+leg.Y1*DRAW_FACTOR-2, 5, 5);
   context.fillStyle = "#0000FF";
   context.fillRect(FRONT_OFFSET_X+leg.latPos*DRAW_FACTOR+leg.Z2*DRAW_FACTOR-2, FRONT_OFFSET_Y+leg.Y2*DRAW_FACTOR-2, 5, 5);   
}

function drawGait(ctx, leg){
   let dx = SIDE_OFFSET_X+leg.longPos*DRAW_FACTOR;
   let dy = SIDE_OFFSET_Y;

   ctx.strokeStyle = "#888888";
   //ctx.setLineDash([5, 15]);
   ctx.lineWidth = 1;
   
   ctx.beginPath();
   ctx.moveTo(dx+leg.sx*DRAW_FACTOR, dy+leg.sy*DRAW_FACTOR);
   ctx.bezierCurveTo(dx+leg.c1x*DRAW_FACTOR, dy+leg.c1y*DRAW_FACTOR, dx+leg.c2x*DRAW_FACTOR, dy+leg.c2y*DRAW_FACTOR, dx+leg.ex*DRAW_FACTOR, dy+leg.ey*DRAW_FACTOR);
   ctx.stroke();
   ctx.beginPath();
   ctx.moveTo(dx+leg.sx*DRAW_FACTOR, dy+leg.sy*DRAW_FACTOR);
   ctx.bezierCurveTo(dx+leg.c1x*DRAW_FACTOR, dy+leg.c1y*DRAW_FACTOR, dx+leg.c2x*DRAW_FACTOR, dy+leg.c2y*DRAW_FACTOR, dx+leg.ex*DRAW_FACTOR, dy+leg.ey*DRAW_FACTOR);
   ctx.stroke();
   
   ctx.fillStyle = "#888888";
   ctx.fillRect(dx+leg.sx*DRAW_FACTOR-2, dy+leg.sy*DRAW_FACTOR-2, 5, 5);
   ctx.fillStyle = "#888888";
   ctx.fillRect(dx+leg.ex*DRAW_FACTOR-2, dy+leg.ey*DRAW_FACTOR-2, 5, 5);
   ctx.fillStyle = "#0000FF";
   ctx.fillRect(dx+leg.c1x*DRAW_FACTOR-1, dy+leg.c1y*DRAW_FACTOR-1, 3, 3);
   ctx.fillRect(dx+leg.c2x*DRAW_FACTOR-1, dy+leg.c2y*DRAW_FACTOR-1, 3, 3);
}

function drawRobot() {
   var ctx = canv.getContext("2d");
   ctx.clearRect(0, 0, canv.width, canv.height);

   ctx.strokeStyle = "#000000";
   ctx.lineWidth = 5;

   // Draw right side view chassis
   ctx.beginPath();
   ctx.moveTo(SIDE_OFFSET_X+RR_leg.longPos*DRAW_FACTOR, SIDE_OFFSET_Y);
   ctx.lineTo(SIDE_OFFSET_X+FR_leg.longPos*DRAW_FACTOR, SIDE_OFFSET_Y);
   ctx.stroke();

   // Draw front view chassis
   ctx.beginPath();
   ctx.moveTo(FRONT_OFFSET_X+FR_leg.latPos*DRAW_FACTOR, FRONT_OFFSET_Y);
   ctx.lineTo(FRONT_OFFSET_X+FL_leg.latPos*DRAW_FACTOR, FRONT_OFFSET_Y);
   ctx.stroke();

   // Text
   ctx.font = "20px Arial";
   ctx.fillStyle = "red";
   ctx.fillText("Right view", 10, 50);
   ctx.fillText("Front view", 10, 200);

   // Write data
   ctx.font = "10px Arial";
   ctx.fillStyle = "black";
   ctx.fillText("FL: ("+Math.ceil(FL_leg.X2)+", "+Math.ceil(FL_leg.Y2)+")", 10, 250);
   ctx.fillText("RL: ("+Math.ceil(RL_leg.X2)+", "+Math.ceil(RL_leg.Y2)+")", 10, 260);
   ctx.fillText("RL: ("+Math.ceil(FR_leg.X2)+", "+Math.ceil(FR_leg.Y2)+")", 10, 270);
   ctx.fillText("RR: ("+Math.ceil(RR_leg.X2)+", "+Math.ceil(RR_leg.Y2)+")", 10, 280);
   
   ctx.fillText("ThetaFL1: "+Math.ceil(FL_leg.theta1*180/Math.PI), 100, 250);
   ctx.fillText("ThetaFL2: "+Math.ceil(RL_leg.theta2*180/Math.PI), 100, 260);
   //ctx.fillText("RL: ("+Math.ceil(FR_leg.X2)+", "+Math.ceil(FR_leg.Y2)+")", 10, 270);
   //ctx.fillText("RR: ("+Math.ceil(RR_leg.X2)+", "+Math.ceil(RR_leg.Y2)+")", 10, 280);

   if(mode=="bezier"){
      // Draw gait for each leg
      drawGait(ctx, FL_leg);
      drawGait(ctx, RL_leg);
      drawGait(ctx, FR_leg);
      drawGait(ctx, RR_leg);
   }

   // Draw legs
   drawLeg(ctx, FL_leg);
   drawLeg(ctx, RL_leg);
   drawLeg(ctx, FR_leg);
   drawLeg(ctx, RR_leg);
};