/* Dummy Defense
This guy prioritises defense over offense. uses a lot of tricks we learned from the crappy sniper bots.
basic zoning. check if a puck or ball is in “the box”.
if ball in enemy box, shoot with closest behind.
if less than 2 pucks in own box, place a puck there.
if more than 2 pucks in enemy box, disrupt it.
otherwise, play as notsocrappysniperbot

smartness level: 4
*/

var repeated = 0;
var rep = "";

function shootClosest(myballs, ball){
	//shoots the closest puck towards the ball
	var closestDistance = 10000;
	var closestAngle;
	var closestIndex = -1;
	for(var i = 0; i < myballs.length; i++){
		var diff_x = myballs[i].x - ball.x;
		var diff_y = myballs[i].y - ball.y;
		var distance = Math.sqrt(diff_x*diff_x+diff_y*diff_y);
		if(distance < closestDistance){
			var tanangle = diff_y/diff_x;
			var angle = Math.atan(tanangle);
			if(diff_x >=0){
				angle += Math.PI;
			}
			closestIndex = i;
			closestDistance = distance;
			closestAngle = angle;
		}

	}
	return [closestIndex, radianToDegrees(closestAngle), 15] ;
}

function shootClosestBehind(myballs, ball, leftOrRight){
	var closestIndex = -1;
	var closestDistance = 10000;
	var closestAngle;
	var furthestOut;
	var furthestReturnDistance = 0;
	var furthestReturnAngle;
	
	for(var i = 0; i < myballs.length; i++){
		var diff_x = myballs[i].x - ball.x;
		var diff_y = myballs[i].y - ball.y;
		var distanceBall = Math.sqrt(diff_x*diff_x+diff_y*diff_y);
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
	}
	//console.log("now my closest index is:", closestIndex);
	if(closestIndex == -1){
		//console.log([furthestOut, radianToDegrees(furthestAngle), 7.5] );
		return false;
	}

	//console.log([closestIndex, radianToDegrees(closestAngle), 15] );
	return [closestIndex, radianToDegrees(closestAngle), 15] ;
	//return [0,0,15];
}



function dummyDefensePlay(ball, player1balls, player2balls, scoreRight, scoreLeft, settings, name, debug, trashtalk){

	if(trashtalk){
		var thrashTalk = ["You stand no chance versus the Shepards!",
		"Already panicking???",
		"You play like my grandmother :P",
		"I have seen better soccer star players in the kindergarten",
		"Best bot in the west? More like dead bot needs a rest!",
		"GG EZ",
		"Time to Tango!",
		"You should thank me for teaching you a lesson!",
		"What is that? Your guys are disappearing",
		"Mr Stark, I don't feel so good.",
		"Please, don't cry on my keyboard",
		"How will you ever beat my iron defense?",
		"You play like a wet towel",
		"You call that a shot?",
		"timer.emit('goal scored', 'player 2')",
		"Your tricks don't work on me...",
		"Prepare for the sniper shot!"];
	console.log(thrashTalk[Math.floor(Math.random() * thrashTalk.length)])
	}

	//console.clear();
	if(debug){
		console.log("dummy defense is booting up!");
	}
	var myballs;
	var yourballs;
	var leftOrRight;
	var aimhere,returnhere,myBox,enemyBox;

	//set up the right information for the shot
	if(name == "player 1"){
		myballs = player1balls;
		yourballs = player2balls;
		returnhere = {x:125,
			y:400};
		aimhere = {x:1075,
			y:400};
		myBox = {x1:125,
			x2: 225,
			y1: 320,
			y2: 480};
		enemyBox = {x1:975,
			x2: 1075,
			y1: 320,
			y2: 480}

		leftOrRight = -1;
	} else {
		myballs = player2balls;
		yourballs = player1balls;
		returnhere = {x:1075,
			y:400};
		aimhere = {x:125,
			y:400};
		enemyBox = {x1:125,
			x2: 225,
			y1: 320,
			y2: 480};
		myBox = {x1:975,
			x2: 1075,
			y1: 320,
			y2: 480}
		leftOrRight = 1;
	}

	//gather information about the game state.
	var information = gatherInformation(ball,myballs,yourballs,myBox,enemyBox, debug);
	//console.log("we succesfully gathered information!");
	//console.log(information);

	// so now, we just have to choose which action we do, based on the information.
	// is the ball in the box, then take a full power shot with the closest puck behind (do not worry about impact spot just yet).
	var shot;
	if (information.ballInbox){
		if(debug){
			console.log("The ball is in the enemy box. Shooting the closest behind!");
		}
		[index, angle, power] = shootClosestBehind(myballs,ball,leftOrRight);
		
		return [index, angle, power];
		
		//apparently they are all in front of the ball (highly unlikely, but well). just continue and let the program select a defensive move.
	}


	// see how many there are in my own box. we dont care about the colour here.
	var pucksInOwnBox = information.friendlyInOwnBoxCount + information.enemyInOwnBoxCount;
	var forceDefensiveShot = false;
	if(pucksInOwnBox < 2){
		//if there is one puck in the box, place one next to it. if there is no puck. put a puck defensively in front of the ball.
		// choose the closest puck behind that spot. otherwise, do the normal defensive shot with one puck in the box.
		if(debug){
			console.log("there are less than 2 pucks in our own box, let's defend");
		}
		if(pucksInOwnBox == 0){
			var ballAngle = findAngleWithLocations(ball,returnhere);
			//console.log("calling anglefinder with", ball.x, ball.y, ballAngle, 62);
			var aimLocation = findLocationWithAngle(ball,ballAngle, -62);
			//console.log("aimlocation", aimLocation, ball.x, ball.y, ballAngle );
			var [pucksBehind, pucksBehindCount] = findObjectsBehind(aimLocation.x, myballs, leftOrRight);
			if (pucksBehindCount == 0){
				forceDefensiveShot = true;
			} else {
				// so we know there is at least one ball behind the spot we want. let's find the closest ball behind and put it in the spot.
				var closestDistance = 10000;
				var closestIndex = -1;
				//var distanceList = calculateMoreDistance(aimLocation.x, myballs);
				var distanceList = calculateMoreDistance(aimLocation, myballs);
				for (var i = 0; i < myballs.length; i++){
					if(pucksBehind[i] && distanceList[i] < closestDistance){
						closestDistance = distanceList[i];
						closestIndex = i;
					}
				}
				if(closestIndex == -1){
					if(debug){
						console.log("the distance function fucked up somehow. just take the first puck behind");
					}
					for (var i = 0; i < myballs.length; i++){
						if(pucksBehind[i]){
							closestIndex = i;
						}
					}						
				}

				// calculate the angle and power to get this puck there.
				//console.log("this is where it crashed last time");
				//console.log(pucksBehind, distanceList, closestIndex, aimLocation);
				var [angle, power] = movePuckToLocation(myballs[closestIndex], aimLocation);
				//console.log(angle, power);
				// take the shot to put the puck right behind the ball.
				if(debug){
					console.log("TAKE SHOT A");
					showImpactSpot(aimLocation);
				}
				//console.log(closestIndex, radianToDegrees(angle) + 180, power);
				
				/*if(rep == "defensive"){
					repeated ++;
				}
				if(repeated == 5){
					shootClosest(myballs, ball);
				}*/
				return [closestIndex, radianToDegrees(angle) + 180, power];
				//(beforeshot(myballs, ball) : return beforeshot(myballs,ball) ? return [closestIndex, radianToDegrees(angle), power]);
			}
		}
		if(pucksInOwnBox == 1 || forceDefensiveShot){
			// so we now want to place a defensive shot with a puck that is already on our side of the ball (improvement possible)
			var [pucksBehind, pucksBehindCount] = findObjectsBehind(ball.x, myballs, leftOrRight);
			if(pucksBehindCount < 2){
				// we are fucked. there is no puck we can safely place in the box. just do a full power shot on the ball with the closest one (improvement possible)
				//observation seems that this is not true.
				if(debug){
					console.log("returning directly");
				}
				return shootClosest(myballs, ball, leftOrRight);
			} else {
				//shoot the first puck (improvement possible) that is behind the ball and not in the box into the box
				// if we force a defensive shot, just put it in the middle.
				if(forceDefensiveShot){
					var aimLocation = {x: returnhere.x + 60 *leftOrRight, y: returnhere.y};
					for (var i = 0; i < myballs.length; i++){
						if(pucksBehind[i]){
							var [angle, power] = movePuckToLocation(myballs[i], aimLocation);
							return [ i, radianToDegrees(angle), power];
						}
					}
				} else {
					// there is already one puck in the box. See if it is in the upper half.
					var alreadyThereIndex = -1
					for (var i = 0; i < myballs.length; i ++){
						if(information.friendlyInOwnBox[i]){
							alreadyThereIndex = i;
						}
					}
					// get the first puck that is behind the ball, but not already in the box
					for (var i = 0; i < myballs.length; i++){
						if(pucksBehind[i] && i != alreadyThereIndex){
							var puckToReturnIndex = i;
						}
					}

					if(alreadyThereIndex == -1){
						if(debug){
							console.log("something wrong with the already there index. setting it to 1 so it does not crash :(");
						}
						alreadyThereIndex = 1;
					}

					if (checkInBox(myballs[alreadyThereIndex], {x1: myBox.x1, x2:myBox.x2, y1:myBox.y1, y2:(myBox.y2 - myBox.y1)/2 + myBox.y1})){
						//upper half
						var [angle, power] = movePuckToLocation(myballs[puckToReturnIndex], {x: returnhere.x + leftOrRight * 60, y: returnhere.y + 33})
						if(debug){
							showImpactSpot({x: returnhere.x - leftOrRight * 60, y: returnhere.y - 33});
						}
					} else {
						//lower half
						var [angle, power] = movePuckToLocation(myballs[puckToReturnIndex], {x: returnhere.x + leftOrRight * 60, y: returnhere.y - 33})
						if(debug){
							showImpactSpot({x: returnhere.x - leftOrRight * 60, y: returnhere.y + 33});
						}
					}
					if(debug){
						console.log("TAKE SHOT B");
					}
					return [puckToReturnIndex, radianToDegrees(angle), power];
				}
			}
		}

	}
	if(debug){
						console.log("there are enough pucks in our own box. no need to defend :)");
	}
	// if we get here, we are already in the following situation
	// the ball is not in the enemy box
	// we have 2 pucks defending our own goal
	// this means we want to disrupt the enemy defense.
	if(information.enemyInEnemyBoxCount + information.friendlyInEnemyBoxCount > 0){
		//if it is just our own guys, let's clear them
		if(debug){
						console.log("let's clean out the enemy box");
		}
		if(information.enemyInEnemyBoxCount == 0){
			if(information.friendlyInEnemyBoxCount == 1){
				//it's just one of our own. let's put it to our return here coordinates, but more to the middle of the field..
				//var returnThisOneIndex = -1;
				for(var i= 0; i < myballs.length; i++){
					if(information.friendlyInEnemyBox[i]){
						var [angle, power] = movePuckToLocation(myballs[i], {x: returnhere.x + 120*leftOrRight, y:returnhere.y});
						return [i, radianToDegrees(angle), power];
					}
				}
			} else {
				// we somehow ended up with more than one of our own pucks in the enemy box. just shoot the first one with full power against the second one.
				var firstOne = -1;
				var secondOne = -1;
				for(var i = 0; i < myballs.length; i++){
					if(information.friendlyInEnemyBox[i]){
						firstOne = i;
						break;
					}
				}
				for(var i = firstOne + 1; i < myballs.length; i++){
					if(information.friendlyInEnemyBox[i]){
						secondOne = i;
						break;
					}
				}
				// aim a little to the goal side of the second puck
				var angle = findAngleWithLocations(myballs[firstOne], {x: myballs[secondOne].x - 20 *leftOrRight, y: myballs[secondOne].y});
				return [ firstOne, radianToDegrees(angle), 15];
					
			}
		} else {
			// there are enemy pucks in the enemy box. if there is also one of our pucks there, just shoot the first one against the first enemy.
			if(information.friendlyInEnemyBox >0){
				for (var i = 0; i < myballs.length; i++){
					if(information.friendlyInEnemyBox[i]){
						var friendlyIndex = i
						break;						
					}
				}
				for (var i = 0; i < myballs.length; i++){
					if(information.enemyInEnemyBox[i]){
						var enemyIndex = i
						break;						
					}
				}
				//purposely + 20 here and - 20 above.
				//console.log("the other locaiotn find with angle!");
				var angle = findAngleWithLocations(myballs[friendlyIndex], {x: yourballs[enemyIndex].x + 200 * leftOrRight, y: yourballs[enemyIndex].y});
				//console.log(angle);
				return [friendlyIndex, radianToDegrees(angle), 15];
			} else {
				//no friendly pucks in the enemy box. just shoot the closest hard against the first enemy puck you see in there.
				for (var i = 0; i < myballs.length; i++){
					if(information.enemyInEnemyBox[i]){
						var enemyIndex = i
						break;						
					}
				}
				return shootClosest(myballs, yourballs[enemyIndex]);
			}
		}
	} else {
		// the enemy box is already empty. time to go for a shot on goal.
		if(debug){
						console.log("nothing left to do, but do a sniper shot!!!!");
		}
		return closestSniperShot(ball, myballs, aimhere, leftOrRight, debug);
	}
	if(debug){
						console.log("panick shot");
	}
	return closestSniperShot(ball, myballs, aimhere, leftOrRight, debug);
}
//gatherInformation(ball,myballs,yourballs,myBox,enemyBox, debug);
function gatherInformation(ball,myballs,yourballs,myBox,enemyBox, debug){
	if(debug){
		drawTheBox();
	}
	// first of all, we want to know if the ball is in the enemy box
	var ballInBox = checkInBox(ball, enemyBox);
	//console.log("START FFING DIAGNOSTICS");
	//console.log(myBox,myballs,enemyBox,yourballs);
	//console.log("enemybox x1:", enemyBox.x1, "enemybox x2: " , enemyBox.x2);
	//console.log("ybox x1:", myBox.x1, "mybox x2: " , myBox.x2);
	//for(var i = 0; i < 5; i++){
	//	console.log("x: ", yourballs[i].x, "y: ", yourballs[i].y, checkInBox(yourballs[i],enemyBox));
	//}

	//console.log("END FFING DIAGNOSTICS");


	// now we want to know how many friendly objects are in our own box
	var [friendlyInOwnBox, friendlyInOwnBoxCount]  = checkMoreInBox(myballs, myBox);
	var [friendlyInEnemyBox, friendlyInEnemyBoxCount] = checkMoreInBox(myballs, enemyBox);
	var [enemyInOwnBox, enemyInOwnBoxCount] = checkMoreInBox(yourballs, myBox);
	var [enemyInEnemyBox, enemyInEnemyBoxCount] = checkMoreInBox(yourballs, enemyBox);
	var returnValues =  {
		ballInBox: ballInBox,
		friendlyInOwnBox: friendlyInOwnBox,
		friendlyInEnemyBox: friendlyInEnemyBox,
		enemyInOwnBox: enemyInOwnBox,
		enemyInEnemyBox: enemyInEnemyBox,
		friendlyInOwnBoxCount: friendlyInOwnBoxCount,
		friendlyInEnemyBoxCount: friendlyInEnemyBoxCount,
		enemyInOwnBoxCount: enemyInOwnBoxCount,
		enemyInEnemyBoxCount: enemyInEnemyBoxCount
	};
	return returnValues;
}

function closestSniperShot(ball, myballs, aimhere, leftOrRight, debug){
	// find the closest ball, behind the ball.
	var closestIndex = -1;
	var closestDistance = 10000;
	var closestAngle;
	//var furthestOut;
	//var furthestReturnDistance = 0;
	//var furthestReturnAngle;
	
	//calculate direction to hit ball in (there is a function for this.)
	var ballDirDiffX = ball.x - aimhere.x;
	var ballDirDiffY = ball.y - aimhere.y;
	var tanangle = ballDirDiffY/ballDirDiffX;
	var angleBallToGoal = Math.atan(tanangle);

	//calculate the impact spot on the ball
	//use 55 to aim a little in the ball
	// there is a function for this too
	var ballImpactSpot = {};
	ballImpactSpot.x = ball.x - Math.cos(angleBallToGoal + Math.PI) * 52 *leftOrRight; 
	ballImpactSpot.y = ball.y - Math.sin(angleBallToGoal + Math.PI) * 52; 

	if(debug){
		showImpactSpot(ballImpactSpot,ball);
	}


	for(var i = 0; i < myballs.length; i++){
		// calculate the ideal angle we need.
		var diff_x = myballs[i].x - ballImpactSpot.x;
		var diff_y = myballs[i].y - ballImpactSpot.y;
		var tanangle = diff_y/diff_x;
		var angle = Math.atan(tanangle);
		var currentDistance = calculateDistance(ballImpactSpot, myballs[i]);
		//var correctedAngle = Math.abs(angleBallToGoal - angle);


		// check if we are on the good side of the ball.
		if(diff_x * leftOrRight >= 0){
			if(currentDistance < closestDistance){
				if(diff_x>=0){
					angle += Math.PI;
				}
				closestIndex = i;
				closestDistance = currentDistance;
				closestAngle = angle;
			}
		}
	}
	//if we did not find any good shots, just shoot the closest one at it.
	if(closestIndex == -1){
		return shootClosest(myballs, ball) ;
	}

	return [closestIndex, radianToDegrees(closestAngle), 15] ;
	

}

function checkInBox(object, box){
	//checks if the object is in the box
	if(object.x > box.x1 && object.x < box.x2 && object.y > box.y1 && object.y < box.y2){
		return true;
	}
	return false;
}

function checkMoreInBox(objectlist, box){
	// checks a list of objects to see if they are in the box. 
	// return a list with the same indexes and a boolean true is they are in the box.
	var checklist = [];
	var count = 0;
	for (var i = 0; i < objectlist.length; i++){
		if(checkInBox(objectlist[i],box)){
			checklist[i] = true;
			count ++;
		} else {
			checklist[i] = false;
		}
		
	}
	return [checklist, count];
}

function findLocationWithAngle(startLocation, angle, distance){
	// u can use this to find an impact spot or a place where you can for instance block the ball
	//console.log("anglefinder", startLocation.x, startLocation.y, angle, distance);
	var newLocation = {};
	newLocation.x = startLocation.x - Math.cos(angle + Math.PI) * distance; 
	newLocation.y = startLocation.y - Math.sin(angle + Math.PI) * distance; 
	return newLocation;
}

function movePuckToLocation(puck, location){
	// tells you angle and shot power to move a certain puck to a location
	const powerCoeff = 56.08544648295549;
	var distance = calculateDistance (puck, location);
	var angle = findAngleWithLocations(puck, location);
	if (puck.x < location.x){
		angle += Math.PI;
	}
	return [angle, distance/powerCoeff];

}

function calculateDistance(location1, location2){
	// pythagoras magic. calculates the distance between two locations
	var dx = (location1.x - location2.x);
	var dy = (location1.y - location2.y);
	//console.log("assasa", dx, dy, Math.sqrt(dx*dx + dy*dy));
	return Math.sqrt(dx*dx + dy*dy);
}

function calculateMoreDistance(location, objectlist){
	// returns a list with the same indexes, showing the distance to a location
	var distanceList = [];
		//console.log("distance listing!!!", location.x, location.y);
	for (var i = 0; i < objectlist.length; i++){
		//console.log(objectlist[i].x, objectlist[i].y)
		distanceList[i] = calculateDistance(location, objectlist[i]);
	}
	return distanceList;
}


function findAngleWithLocations(location1,location2){
	// some tangens at work. gives the angle between 2 locations.
	var dx = location1.x - location2.x;
	var dy = location1.y - location2.y;

	var tanangle = dy/dx;

	// if the dx is negative, we need to inverse by 180 degrees. (I think)
	if(dx < 0){
		return Math.atan(tanangle) + Math.PI;	
	}
	return Math.atan(tanangle);
}

function findObjectsBehind(x, objectlist, leftOrRight){
	var objectsBehind = [];
	var objectsBehindCount = 0;
	
	for(var i = 0; i < objectlist.length; i++){
		var diff_x = objectlist[i].x - ball.x;
		// check if we are behind the line.
		if(diff_x * leftOrRight >= 0){
			objectsBehindCount ++;
			objectsBehind[i] = true;
		} else {
			objectsBehind[i] = false;
		}
	}
	return [objectsBehind, objectsBehindCount];
}

function calculateSpotToSpot(location1, location2){
	//console.log("spottospot", location1.x,location1.y,location2.x,location2.y);
	var distance = calculateDistance(location1, location2);
	var angle = findAngleWithLocations(location1, location2);
	return [angle, distance];

}


