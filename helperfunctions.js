
function radianToDegrees(angle){
	//console.log("in degrees", angle*180/Math.PI);
	return angle*180/Math.PI;
}

function showImpactSpot(impactSpot, ball){
	graphics = thisGame.add.graphics();
	graphics.lineStyle(2, 0xFF00FF, 1.0);
	//graphics.beginPath();
	//graphics.moveTo(impactSpot.x, impactSpot.y);
	//graphics.lineTo(ball.x, ball.y);
	//graphics.lineTo(ball.x + (ball.x - impactSpot.x)*3, ball.y + (ball.y - impactSpot.y)*3);
	graphics.fillStyle(0xFFFFFF, 1.0);
	graphics.fillRect(impactSpot.x, impactSpot.y, 10, 10);
	//console.log(ball.x + (ball.x - impactSpot.x), impactSpot.x);
	//graphics.closePath();
	//graphics.strokePath();
}

function drawTheBox(){
	//draws boxes near the goals, so you can see them
	console.log("drawing boxes!!!");
	graphics = thisGame.add.graphics();
	graphics.fillStyle(0xFF0000, 0.5);
	graphics.fillRect(125,320,100,160);
	graphics.fillRect(975,320,100,160);

//    leftgoal = this.matter.add.image(112,400, 'leftgoal').setStatic(true).setName("leftgoal");
  //  rightgoal = this.matter.add.image(1088,400, 'rightgoal').setStatic(true).setName("rightgoal");

}