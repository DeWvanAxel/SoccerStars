/* I am the slightly crappy sniper bot. I shoot the closest puck on the backside of the ball straight into the ball. 
If there are only shots in front. I shoot my puck that is furthest up straight towards my own goal at half speed.
smartness level: 2
*/

function slightlyCrappySniperPlay(ball, player1balls, player2balls, scoreRight, scoreLeft, settings, name){
	var myballs;
	var yourballs;
	var returnhere;
	var leftOrRight;

	if(name == "player 1"){
		myballs = player1balls;
		yourballs = player1balls;
		returnhere = {x:112,
			y:400};
		leftOrRight = -1;
	} else {
		myballs = player2balls;
		yourballs = player2balls;
		returnhere = {x:1088,
			y:400};
		leftOrRight = 1;
	}

	var closestIndex = -1;
	var closestDistance = 10000;
	var closestAngle;
	var furthestOut;
	var furthestReturnDistance = 0;
	var furthestReturnAngle;
	
	for(var i = 0; i < myballs.length; i++){
		// calculate the ideal angle we need.
		var diff_x = myballs[i].x - ball.x;
		var diff_y = myballs[i].y - ball.y;
		var distanceBall = Math.sqrt(diff_x*diff_x+diff_y*diff_y);

		var diff_x_r = myballs[i].x - returnhere.x;
		var diff_y_r = myballs[i].y - returnhere.y;
		var distanceReturn = Math.sqrt(diff_x_r*diff_x_r+diff_y_r*diff_y_r);



		// check if we are on the good side of the ball.
		//console.log("side of the ball I am on.", diff_x*leftOrRight);
		if(diff_x * leftOrRight >= 0){
			if(distanceBall < closestDistance){
				var tanangle = diff_y/diff_x;
				var angle = Math.atan(tanangle);
				if(diff_x>=0){
					angle += Math.PI;
				}
				//slight change on angle
				//angle += Math.random() / 100;
				//console.log(angle, "is my angle");
				closestIndex = i;
				closestDistance = distanceBall;
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
