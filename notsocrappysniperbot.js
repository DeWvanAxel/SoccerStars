/* I am the not so crappy sniper bot. 
I look for the direction the ball needs to go to hit the goal. Then I find the spot where the ball should receive an impact.
Then I find the puck behind the ball, most in line with the angle of hitting the ball, and shoot it full strength at the ball.
If there are no pucks behind the ball, I return the furthest towards my own goal, at half strength.
smartness level: 3
*/



function notSoCrappySniperPlay(ball, player1balls, player2balls, scoreRight, scoreLeft, settings, name, debug){
	var myballs;
	var yourballs;
	var returnhere;
	var leftOrRight;

	if(name == "player 1"){
		myballs = player1balls;
		yourballs = player1balls;
		returnhere = {x:112,
			y:400};
		aimhere = {x:1088,
			y:400};
		leftOrRight = -1;
	} else {
		myballs = player2balls;
		yourballs = player2balls;
		returnhere = {x:1088,
			y:400};
		aimhere = {x:112,
			y:400};
		leftOrRight = 1;
	}

	var closestIndex = -1;
	var closestAngleToBall = Math.PI;
	var closestAngle;
	var furthestOut;
	var furthestReturnDistance = 0;
	var furthestReturnAngle;
	
	//calculate direction to hit ball in
	var ballDirDiffX = ball.x - aimhere.x;
	var ballDirDiffY = ball.y - aimhere.y;
	var tanangle = ballDirDiffY/ballDirDiffX;
	var angleBallToGoal = Math.atan(tanangle);

	//calculate the impact spot on the ball
	//use 50 to aim a little in the ball
	var ballImpactSpot = {};
	ballImpactSpot.x = ball.x - Math.cos(angleBallToGoal + Math.PI) * 50; 
	ballImpactSpot.y = ball.y - Math.sin(angleBallToGoal + Math.PI) * 50; 

	if(debug){
		console.log("sjpw e");
		showImpactSpot(ballImpactSpot,ball);
	}


	for(var i = 0; i < myballs.length; i++){
		// calculate the ideal angle we need.
		var diff_x = myballs[i].x - ballImpactSpot.x;
		var diff_y = myballs[i].y - ballImpactSpot.y;
		var tanangle = diff_y/diff_x;
		var angle = Math.atan(tanangle);
		var correctedAngle = Math.abs(angleBallToGoal - angle);
		
		var diff_x_r = myballs[i].x - returnhere.x;
		var diff_y_r = myballs[i].y - returnhere.y;
		var distanceReturn = Math.sqrt(diff_x_r*diff_x_r+diff_y_r*diff_y_r);



		// check if we are on the good side of the ball.
		if(diff_x * leftOrRight >= 0){
			if(correctedAngle < closestAngleToBall){
				if(diff_x>=0){
					angle += Math.PI;
				}
				//slight change on angle
				//angle += Math.random() / 100;
				//console.log(angle, "is my angle");
				closestIndex = i;
				closestAngleToBall = correctedAngle;
				closestAngle = angle;
			}
		}

		//console.log("now my closest index is:", closestIndex);

		if(distanceReturn > furthestReturnDistance){
			var tanangle = diff_y_r/diff_x_r;
			var angle = Math.atan(tanangle);
			if(diff_x_r>=0){
				angle += Math.PI;
			}
			furthestOut = i;
			furthestReturnDistance = distanceReturn;
			furthestAngle = angle;
		}


	}
	//console.log("now my closest index is:", closestIndex);
	if(closestIndex == -1){
		//console.log([furthestOut, radianToDegrees(furthestAngle), 7.5] );
		return [furthestOut, radianToDegrees(furthestAngle), 7.5] ;
	}

	//console.log([closestIndex, radianToDegrees(closestAngle), 15] );
	return [closestIndex, radianToDegrees(closestAngle), 15] ;
	//return [0,0,15];

}
