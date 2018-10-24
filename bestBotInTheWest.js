function bestBotInTheWest(ball, player1balls, player2balls, scoreRight, scoreLeft, settings, name){
	var thrashTalk = Array("Axel is on FIRE!","Your defense is terrified","YALALALALALALA LALALA LALA","You should play in the league, in fifth division!","Max is bronze 3 material","PARK the bus!","Hier gaan mijn kinderen het nog over hebben","Het gaat om winst en doelpunten","Max, je hebt het in ieder geval geprobeerd","Je speelt zo goed als TSM op worlds","Net het Nederlands eftal Max, die verliezen ook","Voor zo'n verlies heb ik geen woorden", "Kip, ik heb je daar bij de zijlijn")
	console.log(thrashTalk[Math.floor(Math.random() * thrashTalk.length)])
	
	var [open, angleOfHit] = openShot(ball, player1balls, player2balls,name);
	if(open){
		var [playerNumber,angle,speed] = shootOpen(ball, player1balls, player2balls, name, angleOfHit);
	}
	else if (defenseInPlay(ball, player1balls, player2balls,name)){
		var [playerNumber,angle,speed] = irritatingDefense(ball, player1balls, player2balls,name, angleOfHit);
	} else{
		var [playerNumber,angle,speed] = forcePlay(ball, player1balls, player2balls,name, angleOfHit)
	}
	
	return [playerNumber,angle,speed]
}

function openShot(ball, player1balls, player2balls,name){
	if (name == "player 1") {
		var goalX = 963;
		var ownBalls = player1balls;
		var enemyBalls = player2balls;
	}
	else {
		var goalX = 237;
		var ownBalls = player2balls;
		var enemyBalls = player1balls;
	}
	var goalY = Array(370,400,430);
	
	for (var k = 0; k < goalY.length; k++) {
		var placeToCheckX = Array(goalX);
		var placeToCheckY = Array(goalY[k]);
		var open = true;
		var deltaX = ball.x - goalX;
		var deltaY = ball.y - goalY[k];
		
		for (var i = 0; i < 100; i++) {
			currentX = ball.x - (i/100) * deltaX
			currentY = ball.y - (i/100) * deltaY
			for (var j = 0; j < enemyBalls.length; j++) {
				if((enemyBalls[j].x < currentX+54) && (currentX-54 < enemyBalls[j].x) && (currentY-54<enemyBalls[j].y) && (enemyBalls[j].y < currentY+54)){
					open = false;
				}
			}
			for (var j = 0; j < ownBalls.length; j++) {
				if((ownBalls[j].x < currentX+54) && (currentX-54 < ownBalls[j].x) && (currentY-54<ownBalls[j].y) && (ownBalls[j].y < currentY+54)){
					open = false;
				}
			}
		}
		if (open) {
			break;
		}
	}
	var angleOfHit = deltasToAngle(deltaX, deltaY)
	
	return [open, angleOfHit]
}

function shootOpen(ball, player1balls, player2balls,name, angleOfHit){
	var impactX = ball.x + Math.cos(angleOfHit * Math.PI/180) * 57;
	var impactY = ball.y + Math.sin(angleOfHit * Math.PI/180) * 57;
	if (impactX < 187){
		impactX = 187;
	}
	if (impactX > 963){
		impactX = 963
	}
	if (impactY < 237){
		impactY = 237
	}
	if (impactY > 613){
		impactY = 613
	}
	if (name == "player 1") {
		var ownBalls = player1balls;
		var enemyBalls = player2balls;
	}
	else{
		var ownBalls = player2balls;
		var enemyBalls = player1balls;
	}
	
	var thoseWithClearPath = Array();
	
	for (var k = 2; k < ownBalls.length; k++) {
		var placeToCheckX = Array([impactX]);
		var placeToCheckY = Array([impactY]);
		var open = true;
		var deltaX = ownBalls[k].x - impactX;
		var deltaY = ownBalls[k].y - impactY;
		
		for (var i = 0; i < 100; i++) {
			currentX = ownBalls[k].x - (i/100) * deltaX
			currentY = ownBalls[k].y - (i/100) * deltaY
			for (var j = 0; j < enemyBalls.length; j++) {
				if((enemyBalls[j].x < currentX+60) && (currentX-60 < enemyBalls[j].x) && (currentY-60<enemyBalls[j].y) && (enemyBalls[j].y < currentY+60)){
					open = false;
				}
			}
			for (var j = 0; j < ownBalls.length; j++) {
				if (k != j){
					if((ownBalls[j].x < currentX+60) && (currentX-60 < ownBalls[j].x) && (currentY-60<ownBalls[j].y) && (ownBalls[j].y < currentY+60)){
						open = false;
					}
				}
				
			}
		}
		if (open) {
			thoseWithClearPath.push(k)
			break;
		}
	}

	if (thoseWithClearPath.length > 0) {
		var bestSoFar = 0
		var bestScore = 0
		for (var i = 0; i < thoseWithClearPath.length; i++) {
			var score = 0
			if (name == "player 1") {
				if ((ball.x -25 > ownBalls[thoseWithClearPath[i]].x)){
					score += 100;
					if ((ball.x + 25> ownBalls[thoseWithClearPath[i]].x)&&(ball.x + 200 < ownBalls[thoseWithClearPath[i]].x)){
						score += 25;
					}
				}
				if ((ball.y -150 > ownBalls[thoseWithClearPath[i]].y)&&(ball.y +150 < ownBalls[thoseWithClearPath[i]].y)){
					score += 25;
					if ((ball.y -50 < ownBalls[thoseWithClearPath[i]].y)||(ball.y +50 > ownBalls[thoseWithClearPath[i]].y)){
						score += 25;
					}
				}
			}
			if (score>=bestScore){
				bestScore = score;
				bestSoFar = thoseWithClearPath[i]
			}
		}
		var playerNumber = bestSoFar
	} else{
		var playerNumber = 0;
	}

	var deltaX = impactX - ownBalls[playerNumber].x;
	var deltaY = impactY - ownBalls[playerNumber].y;
	var ratio = (Math.cos(angleOfHit * Math.PI/180) * 57)/(Math.sin(angleOfHit * Math.PI/180) * 57)
	
	var angle = deltasToAngle(deltaX, deltaY);
	//console.log(angle, angleOfHit)
	return [playerNumber,angle,15];
}

function defenseInPlay(ball, player1balls, player2balls,name){
	if (name == "player 1") {
		var topSpace = 300;
		var botSpace = 500;
		var leftSpace = 125;
		var rightSpace = 300;
		var ownBalls = player1balls;
		var enemyBalls = player2balls;
	}
	else{
		var topSpace = 300;
		var botSpace = 500;
		var leftSpace = 875;
		var rightSpace = 1050;
		var ownBalls = player2balls;
		var enemyBalls = player1balls;
	}
	var checkAmount = 0;
	for (var i = 0; i < ownBalls.length; i++) {
		if (((leftSpace < ownBalls[i].x) && (ownBalls[i].x < rightSpace) && (ownBalls[i].y < botSpace) && (topSpace < ownBalls[i].y))){
			checkAmount +=1
		}
		if (((leftSpace < enemyBalls[i].x) && (enemyBalls[i].x < rightSpace) && (enemyBalls[i].y < botSpace) && (topSpace < enemyBalls[i].y))){
			checkAmount +=1
		}
	}
	return (checkAmount < 3)
}

function irritatingDefense(ball, player1balls, player2balls,name){
	if (name == "player 1") {
		var topSpace = 300;
		var botSpace = 500;
		var leftSpace = 125;
		var rightSpace = 250;
		var ownBalls = player1balls;
		var enemyBalls = player2balls;
	}
	else{
		var topSpace = 300;
		var botSpace = 500;
		var leftSpace = 925;
		var rightSpace = 1050;
		var ownBalls = player2balls;
		var enemyBalls = player1balls;
	}
	
	var possible = Array();

	for (var i = 0; i < ownBalls.length; i++) {
		if (! ((leftSpace < ownBalls[i].x) && (ownBalls[i].x < rightSpace) && (ownBalls[i].y < botSpace) && (topSpace < ownBalls[i].y))){
			possible.push(i)
		}
	}
	if (possible.length >0){
		var lowest = 10000;
		var playerNumber = 0;
		for (var i = 0; i < possible.length; i++) {
			if ((Math.abs(ownBalls[possible[i]].x - (leftSpace+rightSpace/2)) < lowest)){
				playerNumber = possible[i];
				lowest = Math.abs(ownBalls[possible[i]].x - ((leftSpace+rightSpace)/2));
			} 
		}
	} else {
		var playerNumber = Math.floor(Math.random() * ownBalls.length)
	}
	var deltaX = (leftSpace + rightSpace)/2 - ownBalls[playerNumber].x;
	var deltaY = (topSpace + botSpace)/2 -ownBalls[playerNumber].y	;
	var angle = deltasToAngle(deltaX, deltaY);
	var speed = Math.sqrt(deltaX*deltaX+deltaY*deltaY)/57;
	return [playerNumber,angle,speed]
}

function forcePlay(ball, player1balls, player2balls,name, angleOfHit){
	if (name == "player 1") {
		var ownBalls = player1balls;
		var enemyBalls = player2balls;
		var rightSpaceEnemy = 1050;
		var rightSpaceOwn = 200

	}
	else{
		var ownBalls = player2balls;
		var enemyBalls = player1balls;
		var rightSpaceEnemy = 200
		var rightSpaceOwn = 1050
	}

	var lowest = 100000;
	var hitPlayer = 0;
	for (var i = 0; i < enemyBalls.length; i++) {
		if ((Math.abs(enemyBalls[i].x - rightSpaceEnemy) < lowest)){
			hitPlayer = i;
			lowest = Math.abs(enemyBalls[i].x - rightSpaceEnemy);
		} 
	}
	
	var highest = 0;
	var playerNumber = 0;
	for (var i = 0; i < ownBalls.length; i++) {
		if ((Math.abs(ownBalls[i].x - rightSpaceOwn) > highest)){
			playerNumber = i;
			highest = Math.abs(ownBalls[i].x - rightSpaceOwn);
		} 
	}

	var deltaX = enemyBalls[hitPlayer].x - ownBalls[playerNumber].x;
	var deltaY = enemyBalls[hitPlayer].y -ownBalls[playerNumber].y	;
	var angle = deltasToAngle(deltaX, deltaY);
	return [playerNumber,angle,15]
}


function deltasToAngle(deltaX, deltaY){
	if(deltaX<0){
		var angle = radianToDegrees(Math.atan(deltaY/deltaX) + Math.PI) 
	}
	else{
		var angle = radianToDegrees(Math.atan(deltaY/deltaX)) 
	}
	return angle
}