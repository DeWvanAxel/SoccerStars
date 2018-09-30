/* I am the crappy sniper bot. I shoot the closest puck to the ball at full power.
Smartness level: 1
*/

function crappySniperPlay(ball, player1balls, player2balls, scoreRight, scoreLeft, settings, name){
	var myballs;
	var yourballs;
	var aimhere;

	if(name == "player 1"){
		myballs = player1balls;
		yourballs = player1balls;
		aimhere = {x:1088,
			y:400};
		//leftOrRight = 1;
	} else {
		myballs = player2balls;
		yourballs = player2balls;
		aimhere = {x:112,
			y:400};
		//leftOrRight = -1;
	}

	var closestIndex;
	var closestDistance = 10000;
	var closestAngle;
	
	for(var i = 0; i < myballs.length; i++){
		// calculate the ideal angle we need.
		var diff_x = myballs[i].x - ball.x;
		var diff_y = myballs[i].y - ball.y;
		var distance = Math.sqrt(diff_x*diff_x+diff_y*diff_y);
		if(distance < closestDistance){
			var tanangle = diff_y/diff_x;
			var angle = Math.atan(tanangle);
			console.log(name, settings, "angle before direction check", angle);
			if(diff_x >=0){
				angle += Math.PI;
			}
			//slight change on angle
			angle += Math.random() / 100;
			console.log(angle, "is my angle");
			closestIndex = i;
			closestDistance = distance;
			closestAngle = angle;
		}

	}
	console.log([closestIndex, radianToDegrees(closestAngle), 15] );
	return [closestIndex, radianToDegrees(closestAngle), 15] ;
	//return [0,0,15];

}